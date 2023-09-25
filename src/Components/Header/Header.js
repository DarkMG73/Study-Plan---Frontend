import styles from "./Header.module.css";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as MS1Logo } from "../../assets/media/ms1-ring.svg";
import SubscribeCTA from "../SubscribeCTA/SubscribeCTA";
import SocialConnectMenu from "../SocialConnectMenu/SocialConnectMenu";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import useViewport from "../../Hooks/useViewport";

function Header(props) {
  const [logoToHeaderBar, setLogoToHeaderBar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useSelector((state) => state.contentData);
  const [width, height] = useViewport();
  const { welcomeScrollPosition } = useSelector(
    (state) => state.scrollPosition
  );
  const [logoTitleSize, setLogoTitleSize] = useState(100);
  const [initialWelcomePositionTop, setInitialWelcomePositionTop] = useState(
    false
  );
  let xChange = logoTitleSize - 100;
  let yChange = logoTitleSize - 79;
  let logoTitleTransform = {
    transform:
      "scale(" +
      logoTitleSize +
      "%) translate(" +
      xChange +
      "%, " +
      yChange +
      "%)",
  };
  const navLinks = [];

  if (content) {
    for (const value of Object.values(content)) {
      if (
        value.hasOwnProperty("active") &&
        value.active &&
        value.active.replace(" ", "") !== ""
      ) {
        if (
          value.hasOwnProperty("addToNavMenu") &&
          value.addToNavMenu &&
          value.addToNavMenu.replace(" ", "") !== ""
        )
          navLinks.push(value);
      }
    }
  }

  const mobileMenuButtonHandler = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuModalToggleStyles = mobileMenuOpen
    ? { opacity: "1", pointerEvents: "all", left: "0" }
    : {};

  useEffect(() => {
    xChange = logoTitleSize - 112.5;
    yChange = logoTitleSize - 75;
    logoTitleTransform = {
      transform:
        "scale(" +
        logoTitleSize +
        "%) translate(" +
        xChange +
        "%, " +
        yChange +
        "%)",
    };
  }, [logoTitleSize]);

  useEffect(() => {
    if (
      !initialWelcomePositionTop &&
      welcomeScrollPosition &&
      welcomeScrollPosition.hasOwnProperty("top")
    ) {
      setInitialWelcomePositionTop(64);
    } else if (
      welcomeScrollPosition &&
      welcomeScrollPosition.hasOwnProperty("top")
    ) {
      let newSizeValue =
        100 + (welcomeScrollPosition.top - initialWelcomePositionTop) / 5;

      if (newSizeValue >= 100) newSizeValue = 100;
      if (newSizeValue <= 33 && width > 600) newSizeValue = 33;
      if (newSizeValue <= 85 && width <= 600) newSizeValue = 33;
      setLogoTitleSize(newSizeValue);

      if (newSizeValue <= 38) {
        setLogoToHeaderBar("header");
      } else if (newSizeValue <= 50) {
        setLogoToHeaderBar("medium");
      } else if (logoToHeaderBar) {
        setLogoToHeaderBar(false);
      }
    }
  }, [welcomeScrollPosition, initialWelcomePositionTop]);

  return (
    <div id="ms1-header" className={styles.outerwrap}>
      <div
        className={
          styles["logo-title-outerwrap"] +
          " " +
          styles["logo-to-header-" + logoToHeaderBar]
        }
        style={logoTitleTransform}
      >
        <div className={styles["header-title-container"]}>
          <a href="/" alt="">
            <div className={styles["logo-wrap"]}>
              <MS1Logo />
            </div>
            <div className={styles["title-wrap"]}>
              <h1 className={styles["ms1-title"] + " " + styles["first-word"]}>
                Ignite
              </h1>
              <h1 className={styles["ms1-title"] + " " + styles["second-word"]}>
                Revolution
              </h1>
              <h3 className={styles["ms1-subtitle"]}>
                Unite in Rhythm | Elevate
              </h3>
            </div>
          </a>
        </div>
      </div>
      <div className={styles["header-functions-container"]}>
        <div className={styles["subscribe-cta-wrap"]}>
          <SubscribeCTA />
        </div>
        <div className={styles["nav-container"]}>
          {navLinks &&
            navLinks.map((item) => (
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
            <a href="#about" alt="" className={styles["small-header-nav"]}>
              About
            </a>
          )}
          {props.musicIsActive && (
            <a
              href="#music-catalog"
              alt=""
              className={styles["small-header-nav"]}
            >
              Music
            </a>
          )}
          <button
            className={styles["mobile-menu-button"]}
            onClick={mobileMenuButtonHandler}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <SocialConnectMenu />
        </div>
      </div>
      <div className={styles["menu-modal"]} style={menuModalToggleStyles}>
        <CardPrimary styles={{ maxHeight: "100vh", maxWidth: "100vw" }}>
          <div className={styles["nav-container"]}>
            {navLinks &&
              navLinks.map((item) => (
                <a
                  key={item._id + item.type}
                  href={`#${item.type}`}
                  alt=""
                  onClick={mobileMenuButtonHandler}
                >
                  {item.titleOnNavMenu ? item.titleOnNavMenu : item.title}
                </a>
              ))}
            {props.aboutIsActive && (
              <a href="#about" alt="" onClick={mobileMenuButtonHandler}>
                About
              </a>
            )}
            {props.musicIsActive && (
              <a href="#music-catalog" alt="" onClick={mobileMenuButtonHandler}>
                Music
              </a>
            )}
            <SocialConnectMenu
              socialContainerStyles={{
                flexDirection: "column",
                maxWidth: "100%",
              }}
              linksContainerStyles={{
                flexDirection: "column",
                maxWidth: "100%",
              }}
              linksStyles={{ margin: "0.25em auto" }}
              disableModal={true}
            />
          </div>
          <button onClick={mobileMenuButtonHandler}>Close</button>
        </CardPrimary>
      </div>
    </div>
  );
}

export default Header;
