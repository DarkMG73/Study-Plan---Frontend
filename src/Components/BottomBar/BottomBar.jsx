import styles from "./BottomBar.module.scss";
import React, { useState } from "react";
import StatusUpdate from "../../Components/StatusUpdate/StatusUpdate";
import TextZoomControls from "../../Components/TextZoomControls/TextZoomControls";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import SubscribeCTA from "../SubscribeCTA/SubscribeCTA";

const BottomBar = (props) => {
  const user = false;
  const [toggleLoginModal, setToggleLoginModal] = useState(false);
let {showLogin} = props;
  const toggleLoginModalButtonHandler = () => {
    setToggleLoginModal(!toggleLoginModal);
  };

  const loginModalToggleStyles = toggleLoginModal
    ? { opacity: "1", pointerEvents: "all", left: "0" }
    : {};

  return (
    <div className={styles["bottom-bar"]}>
      <div className={styles["subscribe-cta-wrap"]}>
        <SubscribeCTA />
      </div>
      {false && <StatusUpdate />}
      {showLogin && user && (
        <p>
          Login Status: {user.userName ? user.userName : user.email} is
          currently logged in. &nbsp;&nbsp;
          <button
            onClick={toggleLoginModalButtonHandler}
            className={styles["login-bar-button"]}
          >
            LOGOUT
            <span className={styles["right-arrow"]}>&#x2192;</span>
          </button>
        </p>
      )}
      {showLogin && !user && (
        <p>
          <span className={styles["not-logged-in"]}>
            No one is logged in.
            <button
              onClick={toggleLoginModalButtonHandler}
              className={styles["login-bar-button"]}
            >
              {" "}
              LOGIN or REGISTER HERE
              <span className={styles["right-arrow"]}>&#x2192;</span>
            </button>
          </span>
        </p>
      )}
      {false && <TextZoomControls />}
      <div className={styles["login-modal"]} style={loginModalToggleStyles}>
        <CardPrimary>
          <LoginStatus />
          <button onClick={toggleLoginModalButtonHandler}>Close</button>
          <StatusUpdate />
        </CardPrimary>
      </div>
    </div>
  );
};

export default BottomBar;
