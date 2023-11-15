import styles from "./SPLogo.module.scss";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as SptLogo } from "../../assets/media/spt-ring.svg";
// import SubscribeCTA from "../SubscribeCTA/SubscribeCTA";
import SocialConnectMenu from "../SocialConnectMenu/SocialConnectMenu";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import useViewport from "../../Hooks/useViewport";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import LoginStatus from "../User/LoginStatus/LoginStatus";
import Navbar from "../Navbar/Navbar";

function Header(props) {
  const [width] = useViewport();

  return (
    <div className={styles["sp-logo-container"]}>
      <a href="/" alt="">
        <h1 className={styles["spt-title"] + " " + styles["first-word"]}>S</h1>
        <h1 className={styles["spt-title"] + " " + styles["second-word"]}>P</h1>
      </a>
    </div>
  );
}

export default Header;
