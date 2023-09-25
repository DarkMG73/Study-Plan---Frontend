import styles from "./CardTransparent.module.css";
import cardStyles from "../Card/Card.module.css";
import React from "react";

const CardSecondary = (props) => {
  return (
    <div className={styles.header + " " + cardStyles.card} style={props.styles}>
      {props.children}
    </div>
  );
};

export default CardSecondary;
