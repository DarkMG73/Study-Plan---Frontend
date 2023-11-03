import styles from "./Navbar.module.scss";
import React from "react";
import SocialConnectMenu from "../SocialConnectMenu/SocialConnectMenu";

function Navbar(props) {
  const linkOnClick = props.linkOnClick;
  return (
    <div className={styles["nav-container"]}>
      {props.navLinks &&
        props.navLinks.map((item) => (
          <a
            key={item._id + item.type}
            href={`#${item.type}`}
            alt=""
            className={styles["small-header-nav"]}
          >
            {item.titleOnNavMenu ? item.titleOnNavMenu : item.title}
          </a>
        ))}
      {props.aboutIsActive && (
        <a
          href="#about"
          alt=""
          className={styles["small-header-nav"]}
          onClick={linkOnClick}
        >
          About
        </a>
      )}

      {props.goalsIsActive && (
        <a
          href="#section-goal"
          alt=""
          className={styles["small-header-nav"]}
          onClick={linkOnClick}
        >
          Goals
        </a>
      )}
      {props.stepsIsActive && (
        <a
          href="#section-step"
          alt=""
          className={styles["small-header-nav"]}
          onClick={linkOnClick}
        >
          Steps
        </a>
      )}
      {props.holdsIsActive && (
        <a
          href="#section-hold"
          alt=""
          className={styles["small-header-nav"]}
          onClick={linkOnClick}
        >
          Holds
        </a>
      )}

      {props.controlsIsActive && (
        <a
          href="#section-controls"
          alt=""
          className={styles["small-header-nav"]}
          onClick={linkOnClick}
        >
          Controls
        </a>
      )}
      {props.socialIsActive && <SocialConnectMenu />}
    </div>
  );
}

export default Navbar;
