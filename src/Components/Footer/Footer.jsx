import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles["footer-container"]}>
      {" "}
      <div
        className={`${styles["footer-column"]} ${styles["footer-col-1"]}`}
      ></div>
      <div className={`${styles["footer-column"]} ${styles["footer-col-2"]}`}>
        <p>
          <span className={styles["category-headings"]}>
            Develper & Designer
          </span>
          <a
            href="https://www.glassinteractive.com/about-me/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mike Glass
          </a>
        </p>
        <p>
          <span className={styles["category-headings"]}>Contact</span>
          <a href="mailto:general@glassinteractive.com">
            general@glassinteractive.com
          </a>
        </p>
        <p>
          <span className={styles["category-headings"]}>
            Find more web apps and info at
          </span>
          <a
            href="https://www.glassinteractive.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            glassinteractive.com
          </a>
        </p>
      </div>
      <div
        className={`${styles["footer-column"]} ${styles["footer-col-3"]}`}
      ></div>
    </div>
  );
};

export default Footer;
