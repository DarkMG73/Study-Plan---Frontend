import styles from "./SocialConnectMenu.module.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as icons from "react-icons/fa";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import { toTitleCase } from "../../Hooks/utility";

function SocialConnectMenu(props) {
  const { socialConnections } = useSelector((state) => state.contentData);
  const [toggleLoginModal, setToggleLoginModal] = useState(false);

  const toggleLoginModalButtonHandler = () => {
    setToggleLoginModal(!toggleLoginModal);
  };

  if (!socialConnections) return;

  const outputArray = [];
  const iconObj = { ...icons };

  for (const value of Object.values(socialConnections)) {
    const name = "Fa" + toTitleCase(value.slug);
    if (
      Object.hasOwn(value, "active") &&
      (!value.active ||
        value.active.replace(" ", "") === "" ||
        value.active.replace(" ", "") === "false")
    )
      continue;
    if (Object.hasOwn(iconObj, name)) {
      const Module = iconObj[name];
      outputArray.push(
        <a
          key={iconObj[name]}
          href={Object.hasOwn(value, "link") ? value.link : "#"}
          alt=""
          target="_blank"
          rel="noopener noreferrer"
          style={props.linksStyles}
        >
          <Module />{" "}
          <span className={styles["social-title"]}>{value.title}</span>
        </a>
      );
    }
  }

  const loginModalToggleStyles = toggleLoginModal
    ? { opacity: "1", pointerEvents: "all", left: "0" }
    : {};

  if (socialConnections)
    return (
      <div id="social-connect-menu" className={styles.outerwrap}>
        <div
          className={styles["social-connect-container"]}
          style={props.socialContainerStyles}
        >
          {!props.disableModal && (
            <button onClick={toggleLoginModalButtonHandler}>Follow </button>
          )}
          {props.disableModal && <h2>Follow </h2>}
          <div
            className={styles["links-container"]}
            style={props.linksContainerStyles}
          >
            {outputArray.map((item) => item)}
          </div>
          {!props.disableModal && (
            <button onClick={toggleLoginModalButtonHandler}>&rarr;</button>
          )}
        </div>
        <div className={styles["login-modal"]} style={loginModalToggleStyles}>
          <CardPrimary styles={{ maxHeight: "100vh" }}>
            <div className={styles["social-connect-container"]}>
              <h2>Follow on Social Media</h2>
              <div className={styles["links-container"]}>
                {outputArray.map((item) => item)}
              </div>
            </div>
            <button onClick={toggleLoginModalButtonHandler}>Close</button>
          </CardPrimary>
        </div>
      </div>
    );
}

export default SocialConnectMenu;
