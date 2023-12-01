import styles from "./TextZoomControls.module.scss";

const TextZoomControls = () => {
  const upClickButtonHandler = () => {
    const htmlElm = document.getElementsByTagName("html")[0];
    const currentFontSize =
      window
        .getComputedStyle(htmlElm, null)
        .getPropertyValue("font-size")
        .replace(/\D/g, "") * 1;
    htmlElm.style.fontSize =
      currentFontSize >= 24 ? "24px" : currentFontSize + 1 + "px";
  };
  const resetClickButtonHandler = () => {
    const htmlElm = document.getElementsByTagName("html")[0];
    htmlElm.style.fontSize = "10px";
  };

  const downClickButtonHandler = () => {
    const htmlElm = document.getElementsByTagName("html")[0];
    const currentFontSize =
      window
        .getComputedStyle(htmlElm, null)
        .getPropertyValue("font-size")
        .replace(/\D/g, "") * 1;
    htmlElm.style.fontSize =
      currentFontSize <= 5 ? "5x" : currentFontSize - 1 + "px";
  };

  return (
    <div className={styles["text-zoom-controls"]}>
      <p>Text Size: </p>
      <div className={styles["button-wrap"]}>
        <button
          className={styles["larger-button"]}
          onClick={upClickButtonHandler}
        >
          &#x2B;
        </button>
        <button
          className={styles["reset-button"]}
          onClick={resetClickButtonHandler}
        >
          Reset
        </button>
        <button
          className={styles["smaller-button"]}
          onClick={downClickButtonHandler}
        >
          &#x2212;
        </button>
      </div>
    </div>
  );
};

export default TextZoomControls;
