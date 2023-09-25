import styles from "./Slide-Button.module.css";
import { useEffect } from "react";

const SlideButton = (props) => {
  return (
    <div className={styles["slide-button-wrap"]}>
      <span className={styles.title}>{props.label}</span>
      <label className={styles.switch}>
        <input
          key={props.label + props.refresh}
          type="checkbox"
          name={props.label}
          onClick={props.onClick}
          className={styles["switch-input"]}
          value={props.label}
          defaultChecked={props.checked}
        />
        <span className={styles["slider"]}></span>
      </label>
    </div>
  );
};

export default SlideButton;
