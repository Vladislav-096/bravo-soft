import "./styles/fonts.scss";
import "./styles/_variables.scss";
import "./styles/common.scss";
import { Layout } from "./components/Layout/Layout";
import { useEffect, useState } from "react";
import { AuthContext, user } from "./context/AuthContext";

export function App() {
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const updateUser = (newUserData: user | null) => {
    setUser(newUserData);
    if (newUserData) {
      localStorage.setItem("user", JSON.stringify(newUserData));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser }}>
      <Layout />
    </AuthContext.Provider>
  );
}
