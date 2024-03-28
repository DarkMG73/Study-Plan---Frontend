import styles from "./NotFound.module.scss";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  console.log(
    "%c⚪️►►►► %cline:4%cNotFound",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
  );
  let navigate = useNavigate();

  const modalButtonHandler = () => {
    let path = `/`;
    navigate(path);
  };

  return (
    <div id="not-found-page" className={styles["not-found-container"]}>
      <div id="not-found-modal" className={styles["modal"]}>
        <div className={styles["inner-container"]}>
          <div>
            <h2>Hmmmmm...</h2>
            <p>that page does not seem to be available.</p>
            <p>Close this to head back home.</p>
          </div>
          <button onClick={modalButtonHandler}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
