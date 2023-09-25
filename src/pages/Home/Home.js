import React, { useLayoutEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Home.module.css";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import CardTransparent from "../../UI/Cards/CardTransparent/CardTransparent";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import NotFound from "../../Components/NotFound/NotFound";
import Footer from "../../Components/Footer/Footer";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";
import MusicCatalog from "../../Components/MusicCatalog/MusicCatalog";
import About from "../../Components/About/About";
import NoticeOne from "../../Components/NoticeOne/NoticeOne";
import NoticeTwo from "../../Components/NoticeTwo/NoticeTwo";
import NoticeThree from "../../Components/NoticeThree/NoticeThree";
import BottomBar from "../../Components/BottomBar/BottomBar";
import backgroundVideo from "../../assets/media/backgrounds/background-energy6.mp4";
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { scrollPositionActions } from "../../store/scrollPositionSlice";

const Home = (props) => {
  const { catalog, catalogMetadata } = useSelector(
    (state) => state.catalogData
  );
  const { content } = useSelector((state) => state.contentData);
  // const [scrollToElm, setScrollToElm] = useState(false);
  // const [scrollToSessionResults, setScrollToSessionResults] = useState(false);
  // const [scrollToAnswer, setScrollToAnswer] = useState(false);
  const angledRectangleRef = useRef();
  const dispatch = useDispatch();
  const hideMusicCatalog = false;
  const defaultSourceURLObj = determineDefaultSourceURLObj(
    catalog,
    catalogMetadata
  );

  ////////////////////////////////////////
  /// Effects
  ////////////////////////////////////////
  useLayoutEffect(() => {
    const updateScrollPosition = () => {
      if (!angledRectangleRef.current) return;

      const welcomeScrollPosition = angledRectangleRef.current.getBoundingClientRect();

      dispatch(
        scrollPositionActions.updateWelcomeScrollPosition(
          JSON.parse(JSON.stringify(welcomeScrollPosition))
        )
      );
    };
    window.addEventListener("scroll", updateScrollPosition);
    updateScrollPosition();
    return () => window.removeEventListener("scroll", updateScrollPosition);
  }, []);

  ////////////////////////////////////////
  /// Functionality
  ////////////////////////////////////////
  const checkIfContentSectionActive = (targetSectionName, contentData) => {
    if (contentData) {
      for (const key in contentData) {
        if (
          contentData[key].hasOwnProperty("type") &&
          contentData[key].type === targetSectionName &&
          contentData[key].hasOwnProperty("active") &&
          contentData[key].active !== false &&
          contentData[key].active.replace(" ", "") !== ""
        )
          return true;
      }
    }
    return false;
  };

  function determineDefaultSourceURLObj(catalog, catalogMetadata) {
    const allCatalogValues =
      catalog &&
      Object.values(catalog).filter((item) =>
        item.sourceURLObj.hasOwnProperty("soundCloud")
      );
    const lastPlaylist =
      allCatalogValues &&
      allCatalogValues[allCatalogValues.length - 1].sourceURLObj;
    const output =
      catalog &&
      catalogMetadata &&
      catalogMetadata.hasOwnProperty("isDefaultPlaylist") &&
      catalog[catalogMetadata.isDefaultPlaylist[1]].hasOwnProperty(
        "sourceURLObj"
      )
        ? catalog[catalogMetadata.isDefaultPlaylist[1]].sourceURLObj
        : catalog &&
          catalogMetadata &&
          catalogMetadata.hasOwnProperty("isFeaturedPlaylist") &&
          catalog[catalogMetadata.isFeaturedPlaylist[1]].hasOwnProperty(
            "sourceURLObj"
          )
        ? catalog[catalogMetadata.isFeaturedPlaylist[1]].sourceURLObj
        : lastPlaylist;
    return output;
  }

  ////////////////////////////////////////
  /// Output
  ////////////////////////////////////////
  return (
    <div className={styles["page-wrap"]}>
      <div className={styles["welcome-section-container"]}>
        <div className={styles["angled-rectangle"]} ref={angledRectangleRef}>
          <div className={styles["background-video-wrap"]}>
            <video className={styles["background-video"]} autoPlay loop muted>
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          </div>
        </div>
        <Fragment>
          {props.notFound && (
            <CardTransparent>
              <ErrorBoundary>
                <div className={styles["not-found-wrap"]}>
                  <NotFound />
                </div>
              </ErrorBoundary>
            </CardTransparent>
          )}
        </Fragment>
        <Fragment>
          <CardTransparent styles={{ overflow: "hidden" }}>
            <ErrorBoundary>
              <div className={styles["main-music-player"]}>
                {defaultSourceURLObj && (
                  <div className={styles["main-music-player-wrap"]}>
                    <MusicPlayer
                      title="Featured Music"
                      passedStyles={{ boxShadow: "none" }}
                      sourceURLObj={defaultSourceURLObj}
                      fromHome={true}
                    />
                  </div>
                )}
              </div>
            </ErrorBoundary>
          </CardTransparent>
        </Fragment>
      </div>
      {checkIfContentSectionActive("noticeOne", content) && (
        <CardPrimary
          styles={{
            boxShadow:
              "inset 0 21px 30px -20px var(--ms1-color-accent), inset 0px -21px 20px -20px var(--ms1-color-accent)",
          }}
        >
          <ErrorBoundary>
            <NoticeOne />
          </ErrorBoundary>
        </CardPrimary>
      )}
      {!hideMusicCatalog && catalog && (
        <CardTransparent>
          <ErrorBoundary>
            <MusicCatalog
              catalogData={{ catalog: catalog }}
              hideServiceSelector={false}
              musicIsActive={props.musicIsActive}
            />
          </ErrorBoundary>
        </CardTransparent>
      )}
      {checkIfContentSectionActive("noticeTwo", content) && (
        <CardPrimary
          styles={{
            borderRadius: "0",
            boxShadow:
              "inset 0 21px 30px -20px var(--ms1-color-accent), inset 0px -21px 20px -20px var(--ms1-color-accent)",
          }}
        >
          <ErrorBoundary>
            <NoticeTwo />
          </ErrorBoundary>
        </CardPrimary>
      )}
      {props.aboutIsActive && (
        <CardTransparent>
          <ErrorBoundary>
            <About />
          </ErrorBoundary>
        </CardTransparent>
      )}
      {checkIfContentSectionActive("noticeThree", content) && (
        <CardPrimary
          styles={{
            boxShadow:
              "inset 0 21px 30px -20px var(--ms1-color-accent), inset 0px -21px 20px -20px var(--ms1-color-accent)",
          }}
        >
          <ErrorBoundary>
            <NoticeThree />
          </ErrorBoundary>
        </CardPrimary>
      )}

      <CardSecondary styles={{ margin: "0" }}>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </CardSecondary>
      <div className={styles["bottom-bar-wrap"]}>
        <BottomBar />
      </div>
    </div>
  );
};

export default Home;

// soundCloud:
// https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/522243030&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true
// appleMusic:
// https://embed.music.apple.com/us/album/prism/1365013619
// spotify:
// https://open.spotify.com/embed/album/19kAnpqFKi7AvGNDll1GVX?utm_source=generator
