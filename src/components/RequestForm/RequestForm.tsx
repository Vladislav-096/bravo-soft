import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChangeEvent, useRef, useState } from "react";
import { FormField } from "../FormField/FormField";
import {
  createDocument,
  getDucuments,
  updateDocument,
} from "../../api/Documents";
import styles from "./requestForm.module.scss";
import { useQuery } from "@tanstack/react-query";
import { getUser, User, Users } from "../../api/User";
import { queryClient } from "../../api/queryClient";
import { useClickOutside } from "../../hooks/useClickOutside";

const FormSchema = z.object({
  username: z.string().min(1, "Should be filled in"),
  document: z.string().min(1, "Should be filled in"),
});

type Form = z.infer<typeof FormSchema>;

export const RequestForm = () => {
  const [isUserInvalid, setIsUserInvalid] = useState<boolean>(false);
  const [usernameText, setUsernameText] = useState<string>("");
  const [documentText, setDocumentText] = useState<string>("");
  const [dropdownStatus, setDropdownStatus] = useState<boolean>(false);
  const [idOfUser, setIdOfUser] = useState<string>("");
  const [isOrderedSuccessfully, setIsOrderedSuccessfully] =
    useState<boolean>(false);
  const [serverError, setServerError] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const suggestRef = useRef<HTMLUListElement>(null);

  const userOptionClick = (user: User) => {
    setUsernameText(user.name);
    setIdOfUser(user.id);
    setDropdownStatus(false);
    clearErrors("username");
    setValue("username", user.name);
  };

  const handleDocumentChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    setIsOrderedSuccessfully(false);
    clearErrors("document");
    setDocumentText(value);
    setIsUserInvalid(false);
  };

  const dropdownToggle = () => {
    setIsOrderedSuccessfully(false);
    setDropdownStatus((status) => !status);
  };

  const userData = useQuery<Users>(
    {
      queryFn: () => getUser(),
      queryKey: ["user"],
      retry: false,
    },
    queryClient
  );

  const handleSubmitForm = async ({ document }: Form) => {
    const documents = await getDucuments(document);
    console.log("documents", documents);

    if (documents.length > 1) {
      setServerError(true);
      return;
    }

    if (documents.length > 0) {
      const documentData = documents[0];
      if (documentData.users.includes(idOfUser)) {
        // document already exists
        setIsUserInvalid(true);
      } else {
        // otherwise add user
        const updatedUsers = [...documentData.users, idOfUser];
        await updateDocument(documentData.id, updatedUsers);
        reset({
          username: "",
        });
        setDocumentText("");
        setUsernameText("");
        setIsOrderedSuccessfully(true);
      }
    } else {
      // the very first one order
      await createDocument(document, [idOfUser]);
      reset({
        username: "",
      });
      setDocumentText("");
      setUsernameText("");
      setIsOrderedSuccessfully(true);
    }
  };

  useClickOutside([inputRef, suggestRef], () => {
    setDropdownStatus(false);
  });

  const {
    setValue,
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
      <FormField
        label={"User name"}
        errorMessage={errors.username?.message}
        text={usernameText}
        placeholder={"Full name"}
      >
        <div
          style={{ position: "relative" }}
          className={styles["fake-input"]}
          onClick={dropdownToggle}
          ref={inputRef}
        >
          {usernameText ? (
            usernameText
          ) : (
            <span className={styles["fake-placeholder"]}>Full name</span>
          )}
        </div>
        <input className={styles["input-dropdown"]} />
      </FormField>

      {userData.data && dropdownStatus && (
        <ul ref={suggestRef} className={`list-reset ${styles.dropdown}`}>
          {userData.data.map((item, index) => (
            <li
              className={styles.option}
              key={index}
              onClick={() => userOptionClick(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}

      <FormField
        label={"Document name"}
        errorMessage={errors.document?.message}
        text={documentText}
        placeholder={"Document name"}
      >
        <input
          className={styles.input}
          value={documentText}
          {...register("document")}
          onChange={handleDocumentChange}
        />
      </FormField>

      {serverError && (
        <p className={styles.error}>Unable to update data, server error</p>
      )}

      {isOrderedSuccessfully && (
        <p className={styles.success}>Document ordered successfully</p>
      )}

      {isUserInvalid && (
        <p className={styles.error}>You already have ordered the document</p>
      )}
      <button
        onClick={() => {
          setIsOrderedSuccessfully(false);
          setServerError(false);
        }}
        className={`btn-reset ${styles.submit}`}
        type="submit"
      >
        Order document
      </button>
    </form>
  );
};
