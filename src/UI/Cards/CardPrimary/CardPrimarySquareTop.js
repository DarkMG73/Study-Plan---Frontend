import styles from "./CardPrimary.module.css";
import stylesSquareTop from "./CardPrimarySquareTop.module.css";
import React from "react";

const CardPrimarySquareTop = (props) => {
  return (
    <div
      className={
        styles.header +
        " " +
        styles["card-primary"] +
        " " +
        stylesSquareTop["card-primary-square-top"]
      }
      style={props.styles}
      data-elmtype="card"
      data-cardtype="card-primary-square-top"
      data-identifier={props.identifier}
    >
      {props.children}
    </div>
  );
};

export default CardPrimarySquareTop;
