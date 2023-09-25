import styles from "./StatusUpdate.module.css";
import React, { useState, useEffect } from "react";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";

const StatusUpdate = () => {
  /* eslint eqeqeq: 0 */
  // const status = useSelector((state) => state.statusUpdate.status);
  const status = false;
  // const loadingStatus = useSelector(
  //   (state) => state.loadingRequests.pendingLoadRequests
  // );
  const loadingStatus = false;
  const [statusText, setStatusText] = useState("Waiting...");
  const [errorStatus, setErrorStatus] = useState("all-fine");

  // if ((status && status.status >= 400) || (status && status.status === 0)) {
  //   setErrorStatus("error");
  // }

  useEffect(() => {
    if (loadingStatus >= 1)
      setStatusText(<span className={styles.transmit}>&#xbb;</span>);
  }, [loadingStatus]);

  useEffect(() => {
    if (
      status &&
      status.hasOwnProperty("rateLimitRemaining") &&
      status.rateLimitRemaining < 10
    ) {
      if (status.rateLimitRemaining <= 0) {
        setErrorStatus("error");
        setStatusText(
          "As a security measure, calls to the server are limited. Please wait about ten minutes before continuing. If this happens a lot, please contact the site admin."
        );
        console.log(
          "%cERROR:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
          status
        );
      } else {
        setErrorStatus("warning");
        setStatusText(
          "As a security measure, there are " +
            status.rateLimitRemaining +
            " calls to the server left. If the limit is reached, please wait about ten minutes before continuing."
        );
      }
    } else if (status && status.hasOwnProperty("statusText")) {
      if (status.hasOwnProperty("status") && status.status == 401) {
        setErrorStatus("all-fine");
        setStatusText("OK");
      } else if (
        (status.hasOwnProperty("status") && !status.status) ||
        status.status >= 400 ||
        (status.status >= 400 && status.statusText === "") ||
        status.status == 0
      ) {
        setErrorStatus("error");
        setStatusText(
          "There is an error communicating with the server. Please check your internet connection and refresh the browser."
        );
        console.log(
          "%cERROR:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
          status
        );
      } else if (status.statusText === "") {
        setErrorStatus("all-fine");
        setStatusText("OK");
      } else if (status.statusText.includes("Unauthorized")) {
        setStatusText("The user could not be logged in");
        setErrorStatus("all-fine");
      } else {
        setErrorStatus("all-fine");
        setStatusText(status.statusText);
      }
    }
  }, [status]);

  return (
    <div
      className={`${styles["status-update-container"]}  ${
        styles[errorStatus]
      } ${styles[loadingStatus > 0 && "loading"]}`}
    >
      <CardPrimary>
        <p>Server: {statusText}</p>
      </CardPrimary>
    </div>
  );
};

export default StatusUpdate;
