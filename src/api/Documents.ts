import { z } from "zod";
import { API_URL } from "../constants/constants";
import { validateResponse } from "./validationResponse";

const DocumenSchema = z.object({
  id: z.string(),
  name: z.string(),
  users: z.array(z.string()),
});
export type Document = z.infer<typeof DocumenSchema>;

const DocumentsSchema = z.array(DocumenSchema);
export type Documents = z.infer<typeof DocumentsSchema>;

export const getDucuments = (name: string = "") => {
  let url = `${API_URL}/documents`;

  if (name) {
    url += `?name=${name}`;
  }

  console.log("url", url);

  return fetch(encodeURI(url))
    .then(validateResponse)
    .then((res) => res.json())
    .then((data) => DocumentsSchema.parse(data))
    .catch((err) => {
      console.log("getDucuments", err);
      throw err;
    });
};

export const updateDocument = (id: string, users: string[]) => {
  return fetch(`${API_URL}/documents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users }),
  });
};

export const createDocument = (name: string, users: string[]) => {
  return fetch(`${API_URL}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, users }),
  });
};
