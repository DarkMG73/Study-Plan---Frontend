import React from "react";
import styles from "./LocalErrorDisplay.module.scss";
import CardPrimary from "../../../UI/Cards/CardPrimary/CardPrimary";

const LocalErrorDisplay = (props) => {
  return (
    <CardPrimary
      styles={{
        boxShadow:
          "inset 4px 4px 14px -7px rgb(255 255 255), inset -4px -4px 14px -7px rgb(0 0 0 / 50%), 0 0 30px var(--spt-color-accent)",
      }}
    >
      <div className={styles["error-container"]}>
        {props.title ? (
          <h3>{props.title}</h3>
        ) : (
          <h3>Oh No! Something is wrong.</h3>
        )}
        <div className={styles["error-text-container"]}>
          <p>{props.message}</p>
          <p>
            {" "}
            if the problem continues, please click the link below for a fully
            populated and ready-to-send email. <br />
            <a
              href={`mailto:general@glassinteractive.com.com?body=${encodeURIComponent(
                "Hello! An error has occurred on the Ignite Revolution Music website: " +
                  props.message
              )}`}
            >
              Click here {"\u2B95"}
            </a>
          </p>
        </div>
      </div>
    </CardPrimary>
  );
};

export default LocalErrorDisplay;
