import { Link, useNavigate } from "react-router";
import { AuthContext, IAuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import styles from "./accessDenied.module.scss";

export const AccessDenied = () => {
  const { user, setUser } = useContext<IAuthContext>(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div>
      {user ? (
        <button className={styles.button} onClick={logout}>
          Разлогинься сначала, брат
        </button>
      ) : (
        <span className={styles.notification}>
          You need to be{" "}
          <span>
            <Link className={styles.link} to={"./auth"}>
              authorized
            </Link>
          </span>{" "}
          to have access to this page
        </span>
      )}
    </div>
  );
};
