import styles from "./SubscribeCTA.module.scss";

const SubscribeCTA = () => {
  return (
    <div className={styles["subscribeCTA-container"]}>
      <form className={styles["subscribeCTA-form"]}>
        <p>Let’s stay connected:</p>
        <input
          type="text"
          className={styles["subscribeCTA-email-input"]}
          placeholder="Email address..."
        />
        <input
          type="submit"
          className={styles["subscribeCTA-email-submit"]}
          value="&#11136;"
        />
      </form>
    </div>
  );
};

export default SubscribeCTA;
