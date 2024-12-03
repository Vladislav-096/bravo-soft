import { z } from "zod";
import styles from "./auth.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getUser, Users } from "../../api/User";
import { queryClient } from "../../api/queryClient";
import { useNavigate } from "react-router";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext";
import { FormField } from "../FormField/FormField";

const FormSchema = z.object({
  login: z.string().min(1, "Should be filled in"),
  password: z.string().min(1, "Should be filled in"),
});

type Form = z.infer<typeof FormSchema>;

export const Auth = () => {
  const navigate = useNavigate();
  const { setUser } = useContext<IAuthContext>(AuthContext);
  const [isUserInvalid, setIsUserInvalid] = useState<boolean>(false);
  const [loginText, setLoginText] = useState<string>("");
  const [passwordText, setPasswordText] = useState<string>("");

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    clearErrors("login");
    setLoginText(value);
    setIsUserInvalid(false);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    clearErrors("password");
    setPasswordText(value);
    setIsUserInvalid(false);
  };

  const userData = useQuery<Users>(
    {
      queryFn: () => getUser(),
      queryKey: ["user"],
      retry: false,
    },
    queryClient
  );

  const isUserValid = ({ login, password }: Form) => {
    let user;

    if (userData.data) {
      user = userData.data.filter((item) => item.login === login)[0];
    }

    if (user && password === user?.password) {
      setUser({ login: user.login, id: user.id, name: user.name });
      navigate("/");
    } else {
      setIsUserInvalid(true);
      return;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<Form>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(({ login, password }) => {
        isUserValid({ login, password });
      })}
    >
      <FormField
        label={"Login"}
        errorMessage={errors.login?.message}
        text={loginText}
        placeholder={"Login"}
      >
        <input
          className={styles.input}
          value={loginText}
          {...register("login")}
          onChange={handleLoginChange}
        />
      </FormField>

      <FormField
        label={"Password"}
        errorMessage={errors.password?.message}
        text={passwordText}
        placeholder={"Password"}
      >
        <input
          className={styles.input}
          value={passwordText}
          {...register("password")}
          onChange={handlePasswordChange}
          type="password"
        />
      </FormField>

      {isUserInvalid && (
        <p className={styles.error}>Incorrect login or password</p>
      )}
      <button className={`btn-reset ${styles.submit}`} type="submit">
        Log in
      </button>
    </form>
  );
};
