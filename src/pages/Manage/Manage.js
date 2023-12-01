import { useState, useEffect, useLayoutEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Manage.module.scss";
import CardTransparent from "../../UI/Cards/CardTransparent/CardTransparent";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import Footer from "../../Components/Footer/Footer";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import backgroundVideo from "../../assets/media/backgrounds/background-energy6.mp4";
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { scrollPositionActions } from "../../store/scrollPositionSlice";
import StudyPlanItems from "../../Components/StudyPlanItems/StudyPlanItems";
import StudyPlanItemsList from "../../Components/StudyPlanItems/StudyPlanItemsList/StudyPlanItemsList";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import { toTitleCase } from "../../Hooks/utility";

const Manage = (props) => {
  const user = useSelector((state) => state.auth.user);
  const contentData = useSelector((state) => state.contentData);
  const studyPlanData = useSelector((state) => state.studyPlanData);
  const [outputJSX, setOutputJSX] = useState(false);
  const [contentOutputJSX, setContentOutputJSX] = useState(false);
  const angledRectangleRef = useRef();
  const dispatch = useDispatch();
  const dataObj = studyPlanData;
  const jsxOutputInstructions = {
    itemsToList: ["studyPlanMetadata", "contentMetadata"],
    itemsToEdit: ["studyPlan", "services", "content"],
  };

  ////////////////////////////////////////////////////////////////////////
  /// Effects
  ////////////////////////////////////////////////////////////////////////
  useLayoutEffect(() => {
    const updateScrollPosition = () => {
      if (!angledRectangleRef.current) return;

      const welcomeScrollPosition =
        angledRectangleRef.current.getBoundingClientRect();

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
    const dataObjForEdit = {};
    const dataObjForList = {};

    for (const key in dataObj) {
      if (jsxOutputInstructions.itemsToEdit.includes(key))
        dataObjForEdit[key] = dataObj[key];
      if (jsxOutputInstructions.itemsToList.includes(key))
        dataObjForList[key] = dataObj[key];
    }

    const outputObj = [];

    if (dataObjForEdit) {
      for (const key in dataObjForEdit) {
        if (key && dataObjForEdit[key]) {
          const sortedDataObject = {};
          for (const i in dataObjForEdit[key]) {
            const type = dataObjForEdit[key][i].type;
            if (!Object.hasOwn(sortedDataObject, type))
              sortedDataObject[type] = {};
            sortedDataObject[type][i] = dataObjForEdit[key][i];
          }

          outputObj.push(
            <h1 key={key + "title"} className={styles["major-group-title"]}>
              The {key}
            </h1>
          );
          for (const typeName in sortedDataObject) {
            outputObj.push(
              <div
                key={key + typeName}
                className={styles["section"] + " " + styles[typeName]}
              >
                <StudyPlanItems
                  key={key + "catItems"}
                  id={key}
                  dataObjForEdit={sortedDataObject[typeName]}
                  user={user}
                  type={typeName}
                />
              </div>
            );
          }
        }
      }
    }
    if (dataObjForList) {
      for (const key in dataObjForList) {
        if (key && dataObjForList[key]) {
          outputObj.push(
            <Fragment key={key + "frag"}>
              <div
                key={key + "parentDIv"}
                className={styles.section + " " + styles["section-" + key]}
              >
                {" "}
                <h3
                  key={key + "h3Title"}
                  className={
                    styles["section-subtitle"] +
                    " " +
                    styles.section +
                    " " +
                    styles["section-" + key]
                  }
                >
                  {key}
                </h3>
                <CollapsibleElm
                  key={key + "-collapsible-elm"}
                  elmId={key + "-collapsible-elm"}
                  styles={{
                    position: "relative",
                  }}
                  maxHeight={"0em"}
                  s
                  inputOrButton="button"
                  buttonStyles={{
                    margin: "0 auto",
                    padding: "0.5em 2em",
                    letterSpacing: "0.25em",
                    fontVariant: "small-caps",
                    transform: "translateY(0%)",
                    transition: "0.7s all ease",
                    minWidth: "80%",
                    maxWidth: "80%",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "0 0 50px 50px",
                    fontFamily: "Arial",
                    boxShadow: "none",
                    border: "3px solid var(--spt-color-accent-dark)",
                  }}
                  colorType="primary"
                  data=""
                  size="small"
                  buttonTextOpened={"- Close " + toTitleCase(key) + " -"}
                  buttonTextClosed={"- Open " + toTitleCase(key) + " -"}
                  open={false}
                  showBottomGradient={false}
                >
                  <StudyPlanItemsList
                    key={key + "catItemList"}
                    studyPlanItemsObj={dataObjForList[key]}
                    parentKey={false}
                    parentsParentKey={false}
                    parentMasterID={false}
                    displayConditions={false}
                    onlyList={true}
                  />
                </CollapsibleElm>
              </div>
            </Fragment>
          );
        }
      }
    }

    setOutputJSX(outputObj);
  }, [dataObj]);

  useEffect(() => {
    const dataObjForEdit = {};
    const dataObjForList = {};

    for (const key in contentData) {
      if (jsxOutputInstructions.itemsToEdit.includes(key))
        dataObjForEdit[key] = contentData[key];
      if (jsxOutputInstructions.itemsToList.includes(key))
        dataObjForList[key] = contentData[key];
    }

    const outputObj = [];
    if (dataObjForEdit) {
      for (const key in dataObjForEdit) {
        if (key && dataObjForEdit[key]) {
          const sortedDataObject = {};
          for (const i in dataObjForEdit[key]) {
            const type = dataObjForEdit[key][i].type;
            if (!Object.hasOwn(sortedDataObject, type))
              sortedDataObject[type] = {};
            sortedDataObject[type][i] = dataObjForEdit[key][i];
          }

          outputObj.push(
            <h1 key={key + "h1"} className={styles["major-group-title"]}>
              The {key}
            </h1>
          );
          for (const typeName in sortedDataObject) {
            outputObj.push(
              <div
                key={key + typeName + "div"}
                className={styles["section"] + " " + styles[typeName]}
              >
                <StudyPlanItems
                  key={key + typeName + "list"}
                  id={key}
                  dataObjForEdit={sortedDataObject[typeName]}
                  user={user}
                  type={typeName}
                />
              </div>
            );
          }
        }
      }
    }

    if (dataObjForList) {
      for (const key in dataObjForList) {
        if (key && dataObjForList[key]) {
          outputObj.push(
            <Fragment key={key + "frag2"}>
              <div
                key={key + "parent"}
                className={styles.section + " " + styles["section-" + key]}
              >
                <h3
                  key={key + "h3"}
                  className={
                    styles["section-subtitle"] +
                    " " +
                    styles.section +
                    " " +
                    styles["section-" + key]
                  }
                >
                  {key}
                </h3>
                <CollapsibleElm
                  key={key + "collapseElm"}
                  elmId={key + "-collapsible-elm"}
                  styles={{
                    position: "relative",
                  }}
                  maxHeight={"0em"}
                  s
                  inputOrButton="button"
                  buttonStyles={{
                    margin: "0 auto",
                    padding: "0.5em 2em",
                    letterSpacing: "0.25em",
                    fontVariant: "small-caps",
                    transform: "translateY(0%)",
                    transition: "0.7s all ease",
                    minWidth: "80%",
                    maxWidth: "80%",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "0 0 50px 50px",
                    fontFamily: "Arial",
                    boxShadow: "none",
                    border: "3px solid var(--spt-color-accent-dark)",
                  }}
                  colorType="primary"
                  data=""
                  size="small"
                  buttonTextOpened={"- Close " + toTitleCase(key) + " -"}
                  buttonTextClosed={"- Open " + toTitleCase(key) + " -"}
                  open={false}
                  showBottomGradient={false}
                >
                  <StudyPlanItemsList
                    key={key + "catList"}
                    studyPlanItemsObj={dataObjForList[key]}
                    parentKey={false}
                    parentsParentKey={false}
                    parentMasterID={false}
                    displayConditions={false}
                    onlyList={true}
                  />
                </CollapsibleElm>
              </div>
            </Fragment>
          );
        }
      }
    }

    setContentOutputJSX(outputObj);
  }, [contentData]);

  ////////////////////////////////////////////////////////////////////////
  /// Functionality
  ////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////
  /// Handlers
  ////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////
  /// Output
  ////////////////////////////////////////////////////////////////////////
  /* eslint eqeqeq: 0 */
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
          <CardTransparent styles={{ overflow: "hidden" }}>
            <ErrorBoundary>
              <div className={styles["main-music-player"]}>
                <div className={styles["main-music-player-wrap"]}>
                  <LoginStatus user={props.user} />
                </div>
              </div>
            </ErrorBoundary>
          </CardTransparent>
        </Fragment>
      </div>
      <CardSecondary>
        {" "}
        <CardPrimary>
          {" "}
          <div className={styles["title-wrap"]}>
            <h1
              key="qwewertyuifgh"
              className={styles["spt-title"] + " " + styles["first-word"]}
            >
              Manage{" "}
            </h1>
            <h2
              key="qwewertyuifghjdvdfvd"
              className={styles["spt-title"] + " " + styles["first-word"]}
            >
              Ignite{" "}
              <span
                className={styles["spt-title"] + " " + styles["second-word"]}
              >
                {" "}
                &nbsp; Revolution
              </span>
            </h2>
            <h3 className={styles["spt-subtitle"]}>
              Unite in Rhythm | Elevate
            </h3>
          </div>{" "}
          {!user && (
            <h2 style={{ fontFamily: "Arial, sans-serif" }}>
              Alert: You need to be logged in with administrator privileges to
              be able to interact with the Management content. Please contact
              the site admin if you believe you should be an administrator and
              need to have an account set up.
            </h2>
          )}
          {user && user.isAdmin != true && (
            <h2 style={{ fontFamily: "Arial, sans-serif" }}>
              Alert: {user.userName} is logged in, but this user is not an
              administrator. Please contact the site admin if you believe this
              to be an error.
            </h2>
          )}
        </CardPrimary>
      </CardSecondary>
      {user && user.isAdmin == true && (
        <Fragment>
          <CardTransparent>
            <ErrorBoundary>
              <form>
                <ul
                  key="asdgsdsdgsdfgsdfg"
                  className={
                    styles["master-list-container"] +
                    " " +
                    styles["master-studyPlan"]
                  }
                >
                  {outputJSX}
                </ul>
              </form>
            </ErrorBoundary>
          </CardTransparent>
          <CardTransparent>
            <ErrorBoundary>
              <form>
                <ul
                  key="hkgyuytuktyukuy"
                  className={
                    styles["master-list-container"] +
                    " " +
                    styles["master-content"]
                  }
                >
                  {contentOutputJSX}
                </ul>
              </form>
            </ErrorBoundary>
          </CardTransparent>
        </Fragment>
      )}
      <CardSecondary styles={{ margin: "0" }}>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </CardSecondary>
    </div>
  );
};

export default Manage;
