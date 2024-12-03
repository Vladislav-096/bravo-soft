import { Route, Routes } from "react-router";
import { MainPage } from "../../pages/MainPage/MainPage";
import { TablePage } from "../../pages/TablePage/TablePage";
import { AuthPage } from "../../pages/AuthPage/AuthPage";
import { useContext } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext";
import { AccessDeniedPage } from "../../pages/AccessDeniedPage/AccessDeniedPage";

export const Main = () => {
  const { user } = useContext<IAuthContext>(AuthContext);

  return (
    <main>
      <Routes>
        <Route
          path="/auth"
          element={user ? <AccessDeniedPage /> : <AuthPage />}
        />
        <Route path="/" element={!user ? <AccessDeniedPage /> : <MainPage />} />
        <Route path="/table" element={<TablePage />} />
      </Routes>
    </main>
  );
};
