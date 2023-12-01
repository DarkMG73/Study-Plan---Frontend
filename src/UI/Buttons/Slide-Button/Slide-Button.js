import styles from "./Slide-Button.module.css";

const SlideButton = (props) => {
  return (
    <div className={styles["slide-button-wrap"]}>
      {props.label && <span className={styles.title}>{props.label}</span>}
      <label className={styles.switch}>
        <input
          key={props.label}
          type="checkbox"
          name={props.label}
          onClick={props.onClick}
          className={styles["switch-input"]}
          value={props.label}
          defaultChecked={props.checked}
        />
        <span
          className={
            styles["slider"] +
            " " +
            styles["checked-" + props.checked.toString()]
          }
        ></span>
      </label>
    </div>
  );
};

export default SlideButton;
