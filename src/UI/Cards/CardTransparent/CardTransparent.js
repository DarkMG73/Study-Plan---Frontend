import styles from "./CardTransparent.module.css";
import cardStyles from "../Card/Card.module.css";

const CardSecondary = (props) => {
  return (
    <div
      className={styles.header + " " + cardStyles.card}
      style={props.styles}
      data-elmtype="card"
      data-cardtype="card-transparent"
      data-identifier={props.identifier}
    >
      {props.children}
    </div>
  );
};

export default CardSecondary;
