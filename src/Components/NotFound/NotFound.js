import styles from "./NotFound.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  let navigate = useNavigate();

  const modalButtonHandler = () => {
    let path = `/`;
    navigate(path);
  };

  return (
    <div id="not-found-page" className={styles["not-found-container"]}>
      <div id="not-found-modal" className={styles["modal"]}>
        <div className={styles["inner-container"]}>
          <div>
            <h2>Hmmmmm...</h2>
            <p>that page does not seem to be available.</p>
            <p>Close this to head back home.</p>
          </div>
          <button onClick={modalButtonHandler}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
