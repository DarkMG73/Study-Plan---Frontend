import styles from "./Navbar.module.scss";
import React from "react";
import SocialConnectMenu from "../SocialConnectMenu/SocialConnectMenu";

function Navbar(props) {
  return (
    <div className={styles["nav-container"]}>
      {props.aboutIsActive && (
        <a href="#about" alt="">
          About
        </a>
      )}
      {props.musicIsActive && (
        <a href="#music-studyPlan" alt="">
          Music
        </a>
      )}
      <SocialConnectMenu />
    </div>
  );
}

export default Navbar;
