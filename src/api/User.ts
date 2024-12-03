import { API_URL } from "../constants/constants";
import { z } from "zod";
import { validateResponse } from "./validationResponse";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  login: z.string(),
  password: z.string(),
});
export type User = z.infer<typeof UserSchema>;

const UsersSchema = z.array(UserSchema);
export type Users = z.infer<typeof UsersSchema>;

export const getUser = () => {
  return fetch(`${API_URL}/users`)
    .then(validateResponse)
    .then((res) => res.json())
    .then((data) => UsersSchema.parse(data))
    .catch((err) => {
      console.log("getUser error", err);
      throw err;
    });
};
