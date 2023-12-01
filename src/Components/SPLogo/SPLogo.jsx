import styles from "./SPLogo.module.scss";

function Header() {
  return (
    <div className={styles["sp-logo-container"]}>
      <a href="/" alt="">
        <h1 className={styles["spt-title"] + " " + styles["first-word"]}>S</h1>
        <h1 className={styles["spt-title"] + " " + styles["second-word"]}>P</h1>
      </a>
    </div>
  );
}

export default Header;
