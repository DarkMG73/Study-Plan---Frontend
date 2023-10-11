import React, { useLayoutEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Home.module.scss";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import CardTransparent from "../../UI/Cards/CardTransparent/CardTransparent";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import NotFound from "../../Components/NotFound/NotFound";
import Footer from "../../Components/Footer/Footer";
import StudyPlanItems from "../../Components/StudyPlanItems/StudyPlanItems";
import About from "../../Components/About/About";
import NoticeOne from "../../Components/NoticeOne/NoticeOne";
import NoticeTwo from "../../Components/NoticeTwo/NoticeTwo";
import NoticeThree from "../../Components/NoticeThree/NoticeThree";
import BottomBar from "../../Components/BottomBar/BottomBar";
import backgroundVideo from "../../assets/media/backgrounds/background-energy6.mp4";
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { scrollPositionActions } from "../../store/scrollPositionSlice";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import Stats from "../../Components/Stats/Stats";

const Home = (props) => {
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData
  );
  const { content } = useSelector((state) => state.contentData);
  // const [scrollToElm, setScrollToElm] = useState(false);
  // const [scrollToSessionResults, setScrollToSessionResults] = useState(false);
  // const [scrollToAnswer, setScrollToAnswer] = useState(false);
  const angledRectangleRef = useRef();
  const dispatch = useDispatch();
  const hideStudyPlan = false;

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
    if (contentData && Object.keys(contentData).length > 0) {
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

  ////////////////////////////////////////
  /// Output
  ////////////////////////////////////////
  return (
    <div className={styles["page-wrap"]}>
      <div className={styles["welcome-section-container"]}>
        <ErrorBoundary>
          <div className={styles["login-stats-container"]}>
            <div className={styles["login-outer-wrap"]}>
              {" "}
              <LoginStatus hideTitles={true} />
            </div>
            <div className={styles["stats-outer-wrap"]}>
              {" "}
              <Stats />
            </div>
          </div>
        </ErrorBoundary>
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
      </div>
      {checkIfContentSectionActive("noticeOne", content) && (
        <CardPrimary
          styles={{
            boxShadow:
              "inset 0 21px 30px -20px var(--spt-color-accent), inset 0px -21px 20px -20px var(--spt-color-accent)",
          }}
        >
          <ErrorBoundary>
            <NoticeOne />
          </ErrorBoundary>
        </CardPrimary>
      )}

      {!hideStudyPlan && studyPlan && (
        <CardPrimary>
          <ErrorBoundary>
            <StudyPlanItems
              key="studyPlan-goals"
              id="studyPlan-goals"
              dataObjForEdit={studyPlan}
              allStudyPlanItems={studyPlan}
              user={props.user}
              type={"goal"}
              noEditButton={true}
            />
          </ErrorBoundary>
        </CardPrimary>
      )}
      {!hideStudyPlan && studyPlan && (
        <CardPrimary>
          <ErrorBoundary>
            <StudyPlanItems
              key="studyPlan"
              id="studyPlan"
              dataObjForEdit={studyPlan}
              user={props.user}
              type={"step"}
              noEditButton={false}
            />
          </ErrorBoundary>
        </CardPrimary>
      )}
      {checkIfContentSectionActive("noticeTwo", content) && (
        <CardPrimary
          styles={{
            borderRadius: "0",
            boxShadow:
              "inset 0 21px 30px -20px var(--spt-color-accent), inset 0px -21px 20px -20px var(--spt-color-accent)",
          }}
        >
          <ErrorBoundary>
            <NoticeTwo />
          </ErrorBoundary>
        </CardPrimary>
      )}
      {props.aboutIsActive && (
        <CardPrimary>
          <ErrorBoundary>
            <About />
          </ErrorBoundary>
        </CardPrimary>
      )}
      {checkIfContentSectionActive("noticeThree", content) && (
        <CardPrimary
          styles={{
            boxShadow:
              "inset 0 21px 30px -20px var(--spt-color-accent), inset 0px -21px 20px -20px var(--spt-color-accent)",
          }}
        >
          <ErrorBoundary>
            <NoticeThree />
          </ErrorBoundary>
        </CardPrimary>
      )}

      <CardSecondary>
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
