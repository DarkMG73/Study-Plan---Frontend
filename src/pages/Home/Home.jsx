import { useEffect, useLayoutEffect, Fragment, useRef } from "react";
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
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { scrollPositionActions } from "../../store/scrollPositionSlice";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";
import { formInputDataActions } from "../../store/formInputDataSlice";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import Stats from "../../Components/Stats/Stats";
import { saveManyStudyPlanItems } from "../../storage/studyPlanDB";
import {
  saveManyContentItems,
  getSchemaForContentItem,
} from "../../storage/contentDB";
import useProcessAllFormInputData from "../../Hooks/useProcessAllFormInputData";
import useProcessUploadedFormInputData from "../../Hooks/useProcessUploadedFormInputData";

const Home = (props) => {
  const { studyPlan } = useSelector((state) => state.studyPlanData);
  const { content } = useSelector((state) => state.contentData);
  const user = useSelector((state) => state.auth.user);
  const angledRectangleRef = useRef();
  const dispatch = useDispatch();
  const hideStudyPlan = false;
  const allFormInputData = useSelector((state) => state.formInputData);
  const processAllFormInputData = useProcessAllFormInputData();
  const processUploadedFormInputData = useProcessUploadedFormInputData();
  let saveManyItems = saveManyStudyPlanItems;

  ////////////////////////////////////////
  /// Effects
  ////////////////////////////////////////
  useEffect(() => {
    dispatch(loadingRequestsActions.addToLoadRequest());
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

  useEffect(() => {
    if (
      !user ||
      !allFormInputData ||
      (!allFormInputData.uploadedForms && !allFormInputData.allNewForms)
    )
      return;

    let data = {};
    if (allFormInputData.uploadedForms) {
      data = processUploadedFormInputData({
        user,
        dispatch,
        dataForSendingToDB: allFormInputData.uploadedForms,
        saveManyStudyPlanItems,
        getSchemaForContentItem,
        saveManyContentItems,
      });
    } else if (allFormInputData.allNewForms) {
      data = processAllFormInputData({
        user,
        dispatch,
        allFormInputData,
        saveManyStudyPlanItems,
        getSchemaForContentItem,
        saveManyContentItems,
      });
    }

    if (!data || Object.keys(data).length <= 0) {
      alert(
        "There seems to have been a problem trying process items before saving them. We are sorry for the trouble. Please check the data and try again. If the problem continues, let the web admin know you received this error.",
      );
      return;
    }
    dispatch(loadingRequestsActions.addToLoadRequest());

    saveManyItems({ user, outputDataArray: data })
      .then((res) => {
        dispatch(loadingRequestsActions.removeFromLoadRequest());

        if (res.status >= 400) {
          alert("There was an error: " + res.response.data.message);

          // updateAStudyPlanItem(dataObj, user);
        } else if (res.status >= 200) {
          alert("Success! You have added to your study plan!");
          dispatch(studyPlanDataActions.reGatherStudyPlan(true));
          if (allFormInputData.uploadedForms)
            dispatch(formInputDataActions.resetSubmitUploadedForm());
          if (allFormInputData.allNewForms)
            dispatch(formInputDataActions.resetSubmitAllNewForms());
        } else {
          dispatch(loadingRequestsActions.removeFromLoadRequest());
          if (!Object.hasOwn(res, "response")) {
            alert(
              "There was an error. Try again or contact the web admin to alert of the issue. ",
            );
            return;
          }

          const data =
            Object.hasOwn(res.response, "data") &&
            Object.hasOwn(res.response.data, "err")
              ? res.response.data
              : false;
          const err = data && Object.hasOwn(data, "err") ? data.err : false;
          const message = Object.hasOwn(data, "message") ? data.message : "";

          const code = err && Object.hasOwn(err, "code") ? err.code : 0;
          const writeErrors =
            err && Object.hasOwn(err, "writeErrors")
              ? err.writeErrors
              : [{ code: err, errmsg: "" }];

          // Handle duplicate entries specifically
          if (code === 11000) {
            const newAllNewFormsObj = { ...allFormInputData.allNewForms };
            const filteredAllNewFormsObj = {};
            const namesWithIssuesArray = [];
            writeErrors.forEach((group) =>
              namesWithIssuesArray.push(group.op.name),
            );

            for (const [key, value] of Object.entries(newAllNewFormsObj)) {
              // new-form
              filteredAllNewFormsObj[key] = {};

              // StudyPlan
              for (const l1Key in value) {
                // The base form

                if (namesWithIssuesArray.includes(value[l1Key].name)) {
                  filteredAllNewFormsObj[key][l1Key] = value[l1Key];
                }
              }
            }

            dispatch(
              formInputDataActions.setNewFormInputDataObj(
                filteredAllNewFormsObj,
              ),
            );
            alert(
              "It looks like you might have tried to add a field that must be unique and already exists. " +
                message +
                "\n\nThe following items already exist. please change each item before submitting the form. " +
                writeErrors.map(
                  (errObj) =>
                    "\n   " + errObj.errmsg.split("{")[1].replace("}", ""),
                ) +
                "\n\nCode: " +
                code,
            );
          } else {
            alert(
              "There was an error: " +
                message +
                "\nError Detail " +
                "\nCode: " +
                code +
                "\nitem(s) with issues: " +
                writeErrors.map((errObj) => "\n   Error:" + errObj.errmsg),
            );
          }
        }
      })
      .catch((err) => {
        console.log(
          "%cERROR:",
          "color:#f0f0ef;background:#ff0000;padding:10px;border-radius:0 25px 25px 0",
          err,
        );

        dispatch(loadingRequestsActions.removeFromLoadRequest());
        alert("There was an error. Please try your request again alter", err);
      });
  }, [allFormInputData.allNewForms, allFormInputData.uploadedForms]);

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
            {props.userInitComplete && (
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
                subText="The Syllabus is the list of steps to complete in towards achieving the main goal or one of the sub-goals that support the main goal."
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

export default Home;
