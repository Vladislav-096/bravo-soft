import { Link, useNavigate } from "react-router";
import styles from "./header.module.scss";
import { useContext } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext";

export const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext<IAuthContext>(AuthContext);

  const logout = () => {
    setUser(null);
    navigate("/auth");
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrapper}>
          <nav className={`list-reset ${styles.nav}`}>
            <Link to={"/"} className={styles.link}>
              Order document
            </Link>
            <Link to={"/table"} className={styles.link}>
              Table
            </Link>
          </nav>
          {user ? (
            <button onClick={logout} className={`btn-reset ${styles.button}`}>
              Log out
            </button>
          ) : (
            <Link to={"/auth"} className={styles.button}>
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
