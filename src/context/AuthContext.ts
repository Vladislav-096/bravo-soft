import { createContext } from "react";

export interface user {
  login: string;
  name: string;
  id: string;
}

export interface IAuthContext {
  user: user | null;
  setUser: (user: user | null) => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: () => {},
});
