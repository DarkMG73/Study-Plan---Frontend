import { useState, useEffect, useLayoutEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Demo.module.scss";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import CardTransparent from "../../UI/Cards/CardTransparent/CardTransparent";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import NotFound from "../../Components/NotFound/NotFound";
import OutputControls from "../../Components/OutputControls/OutputControls";
import Footer from "../../Components/Footer/Footer";
import StudyPlanItems from "../../Components/StudyPlanItems/StudyPlanItems";
import About from "../../Components/About/About";
import NoticeOne from "../../Components/NoticeOne/NoticeOne";
import NoticeTwo from "../../Components/NoticeTwo/NoticeTwo";
import NoticeThree from "../../Components/NoticeThree/NoticeThree";
import BottomBar from "../../Components/BottomBar/BottomBar";
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { scrollPositionActions } from "../../store/scrollPositionSlice";
import { authActions } from "../../store/authSlice";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import Stats from "../../Components/Stats/Stats";
import demoData from "../../data/demoData.json";
import GatherContentData from "../../Hooks/GatherContentData";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";

const Demo = (props) => {
  const dispatch = useDispatch();
  const [studyPlan, setStudyPlan] = useState(false);

  console.log(
    "%c⚪️►►►► %cline:34%cstudyPlan",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
    studyPlan,
  );
  const { content } = useSelector((state) => state.contentData);
  const user = {
    name: "Demo User",
    email: "demouser@glassinteractive.com",
  };
  const angledRectangleRef = useRef();

  const hideStudyPlan = false;

  ////////////////////////////////////////
  /// Effects
  ////////////////////////////////////////
  useEffect(() => {
    // dispatch(loadingRequestsActions.addToLoadRequest());
    dispatch(authActions.logIn(user));
    GatherContentData(user, studyPlan).then((data) => {
      console.log(
        "%c⚪️►►►► %cline:51%cdata",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
        data,
      );
      dispatch(studyPlanDataActions.initState(data));
      setStudyPlan(demoData);
    });
  }, []);
  useLayoutEffect(() => {
    const updateScrollPosition = () => {
      if (!angledRectangleRef.current) return;

      const welcomeScrollPosition =
        angledRectangleRef.current.getBoundingClientRect();

      dispatch(
        scrollPositionActions.updateWelcomeScrollPosition(
          JSON.parse(JSON.stringify(welcomeScrollPosition)),
        ),
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
          Object.hasOwn(contentData[key], "type") &&
          contentData[key].type === targetSectionName &&
          Object.hasOwn(contentData[key], "active") &&
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
      <h1> Demo</h1>
      <div className={styles["welcome-section-container"]}>
        <ErrorBoundary>
          <div className={styles["login-stats-container"]}>
            <div className={styles["login-outer-wrap"]}>
              <LoginStatus hideTitles={true} />
            </div>
            <div className={styles["stats-outer-wrap"]}>
              <Stats />
            </div>
          </div>
        </ErrorBoundary>
        <div className={styles["angled-rectangle"]} ref={angledRectangleRef}>
          <div className={styles["background-video-wrap"]}>
            <div className={styles["bubble"]}></div>
            <div className={styles["bubble"]}></div>
            <div className={styles["bubble"]}></div>
            <div className={styles["bubble"]}></div>
            <div className={styles["bubble"]}></div>
            <div className={styles["bubble"]}></div>
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
              maxCollapsableElmHeight={"none"}
              noEditButton={false}
            />
          </ErrorBoundary>
        </CardPrimary>
      )}
      {!hideStudyPlan && studyPlan && (
        <CardPrimary>
          <ErrorBoundary>
            {props.userInitComplete && (
              <StudyPlanItems
                key="studyPlan"
                id="studyPlan"
                dataObjForEdit={studyPlan}
                user={props.user}
                type={"step"}
                maxCollapsableElmHeight={"28em"}
                noEditButton={false}
              />
            )}
          </ErrorBoundary>
        </CardPrimary>
      )}
      {!hideStudyPlan && studyPlan && (
        <CardPrimary>
          <ErrorBoundary>
            {props.userInitComplete && (
              <StudyPlanItems
                key="hold"
                id="hold"
                subText='If you want to add a book, corse or similar item, but are not yet sure where it fits in the path to achieving the main goal, simply mark the Type as "hold" when filling out the new item form. All items on hold will appear in this section until you edit the item and change the Type to either "goal" or "step"'
                dataObjForEdit={studyPlan}
                user={props.user}
                type={"hold"}
                maxCollapsableElmHeight={"0"}
                noEditButton={false}
                hideAddToButton={true}
                hideShowAllButton={true}
              />
            )}
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
      {user && (
        <CardPrimary
          styles={{
            boxShadow:
              "inset 0 21px 30px -20px var(--spt-color-accent), inset 0px -21px 20px -20px var(--spt-color-accent)",
          }}
        >
          <ErrorBoundary>
            <OutputControls />
          </ErrorBoundary>
        </CardPrimary>
      )}
      <CardSecondary>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </CardSecondary>
      <div className={styles["bottom-bar-wrap"]}>
        <BottomBar showLogin={true} />
      </div>
    </div>
  );
};

export default Demo;
