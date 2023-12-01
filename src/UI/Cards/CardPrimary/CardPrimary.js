import styles from "./CardPrimary.module.css";
import cardStyles from "../Card/Card.module.css";

const CardPrimary = (props) => {
  return (
    <div
      className={
        styles.header + " " + cardStyles.card + " " + styles["card-primary"]
      }
      style={props.styles}
      id={"-card" + props.elmID}
      data-elmtype="card"
      data-cardtype="card-primary"
      data-identifier={props.identifier}
    >
      {props.children}
    </div>
  );
};

export default CardPrimary;
