import React, { useEffect, useLayoutEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Home.module.scss";
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
import backgroundVideo from "../../assets/media/backgrounds/background-energy6.mp4";
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { scrollPositionActions } from "../../store/scrollPositionSlice";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import Stats from "../../Components/Stats/Stats";
import { saveManyStudyPlanItems } from "../../storage/studyPlanDB";
import {
  saveManyContentItems,
  getSchemaForContentItem,
} from "../../storage/contentDB";
import useProcessAllFormInputData from "../../Hooks/useProcessAllFormInputData";



const Home = (props) => {
  const { studyPlan } = useSelector((state) => state.studyPlanData);
  const { content } = useSelector((state) => state.contentData);
  const user = useSelector((state) => state.auth.user);
  // const [scrollToElm, setScrollToElm] = useState(false);
  // const [scrollToSessionResults, setScrollToSessionResults] = useState(false);
  // const [scrollToAnswer, setScrollToAnswer] = useState(false);
  const angledRectangleRef = useRef();
  const dispatch = useDispatch();
  const hideStudyPlan = false;
  const allFormInputData = useSelector((state) => state.formInputData);
  const processAllFormInputData = useProcessAllFormInputData();
  let saveManyItems = saveManyStudyPlanItems;
  
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

  useEffect(() => {
    if( allFormInputData.allNewForms && 
      user && 
      allFormInputData )
{   

  const data = processAllFormInputData({
      user,
      dispatch,
      allFormInputData,
      saveManyStudyPlanItems,
      getSchemaForContentItem,
      saveManyContentItems,
    });

    console.log('%c⚪️►►►► %cline:69%cdata', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px', data)
  
    saveManyItems({ user, outputDataArray: data }).then((res) => {
 
      if (res.status >= 400) {
        alert("There was an error: " + res.response.data.message);
      } else if (res.status >= 200) {
        alert("Success! An item has been updated in your study plan.");
        console.log("Success! An item has been updated in your study plan.");
      } else {
        alert("there was an error: " + +res.message);
      }
    }); 
} 
  }, [
    allFormInputData.allNewForms,
  
  ]);
  ////////////////////////////////////////
  /// Functionality
  ////////////////////////////////////////
  const checkIfContentSectionActive = (targetSectionName, contentData) => {
    if (contentData && Object.keys(contentData).length > 0) {
      for (const key in contentData) {
        if (
          Object.hasOwn(contentData[key],"type") &&
          contentData[key].type === targetSectionName &&
          Object.hasOwn(contentData[key],"active") &&
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
            {props.userInitComplete && (
              <StudyPlanItems
                key="studyPlan-goals"
                id="studyPlan-goals"
                dataObjForEdit={studyPlan}
                allStudyPlanItems={studyPlan}
                user={props.user}
                type={"goal"}
                maxCollapsableElmHeight={'none'}
                noEditButton={true}
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
                key="studyPlan"
                id="studyPlan"
                dataObjForEdit={studyPlan}
                user={props.user}
                type={"step"}
                maxCollapsableElmHeight={'28em'}
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
                 maxCollapsableElmHeight={'0'}
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
{studyPlan &&  Object.keys(studyPlan).length > 0 &&   <CardPrimary
          styles={{
            boxShadow:
              "inset 0 21px 30px -20px var(--spt-color-accent), inset 0px -21px 20px -20px var(--spt-color-accent)",
          }}
        >
          <ErrorBoundary>
            <OutputControls />
          </ErrorBoundary>
        </CardPrimary>}
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
