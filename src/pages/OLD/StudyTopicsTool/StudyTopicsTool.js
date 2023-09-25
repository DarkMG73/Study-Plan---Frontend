import styles from "./StudyTopicsTool.module.css";
import { statusUpdateActions } from "../../store/statusUpdateSlice";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";
import axios from "axios";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import SessionResultsRows from "../../Components/SessionResultsRows/SessionResultsRows";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import OutputControls from "../../Components/OutputControls/OutputControls";
import Footer from "../../Components/Footer/Footer";
import BottomBar from "../../Components/BottomBar/BottomBar";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";
import { updateStudyNotes } from "../../storage/userDB";
import storage from "../../storage/storage";

function StudyTopicsTool() {
  const { studyNotes, ...otherQuestionData } = useSelector(
    (state) => state.studyPlanData
  );
  const { allQuestions, questionMetadata } = otherQuestionData;
  const user = useSelector((state) => state.auth.user);
  const [noDBErrors, setNoDBErrors] = useState(true);
  const [dBErrorMessage, setDbErrorMessage] = useState(false);
  const params = new URLSearchParams(window.location.pathname);
  const location = useLocation();
  let targetIDToScrollTo = location.state;
  let navigate = useNavigate();
  const dispatch = useDispatch();

  if (targetIDToScrollTo && targetIDToScrollTo.hasOwnProperty("_id"))
    targetIDToScrollTo = targetIDToScrollTo._id;
  const scrollToElm = useRef();

  useEffect(() => {
    if (questionMetadata.identifier.includes("errorGettingDataFromDatabase")) {
      setNoDBErrors(false);
      setDbErrorMessage(allQuestions.errorGettingDataFromDatabase.question);
    }
  }, [allQuestions]);

  const allQuestionsSet = { questions: {} };
  const groupSize = 10000;
  let count = 0;
  for (const id of studyNotes.studyTopicsIDs) {
    allQuestionsSet.questions[id] = { ...allQuestions[id] };
    count++;
    if (count >= groupSize) break;
  }
  const returnHomeButtonHandler = () => {
    navigate("../", { replace: false });
  };

  useEffect(() => {
    if (scrollToElm.current)
      scrollToElm.current.scrollIntoView({ behavior: "smooth" });
  }, [scrollToElm.current]);

  function studyTopicDeleteButtonHandler(e) {
    const targetID = e.target.value;
    const newStudyNotes = { ...studyNotes };
    newStudyNotes.studyTopicsIDs = newStudyNotes.studyTopicsIDs.filter(
      (id) => id != targetID
    );
    const confirm = window.confirm(
      "Are you sure you want to remove this item from your study topics list?"
    );
    if (confirm) {
      dispatch(studyPlanDataActions.updateStudyNotes(newStudyNotes));
      if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
      if (!user)
        storage("ADD", { studyNotes: newStudyNotes, ...otherQuestionData });
    }
  }

  const rowDeleteButtonJSKFunction = (identifier) => {
    return (
      <div className={styles["list-item-delete"]}>
        <PushButton
          inputOrButton="button"
          id="study-topic-delete-button"
          colorType="secondary"
          value={identifier}
          size="medium"
          onClick={studyTopicDeleteButtonHandler}
          styles={{
            borderRadius: "50px",
            background: "transparent",
            boxShadow: "none",
            opacity: "0.9",
            margin: "0.5em auto",
          }}
        >
          X
        </PushButton>
      </div>
    );
  };

  return (
    <div>
      <CardSecondary>
        <div id="study-topics-page" className={styles.outerwrap}>
          {!noDBErrors && (
            <CardSecondary>
              <p className={styles["db-error-message"]}>{dBErrorMessage}</p>
            </CardSecondary>
          )}
          {!studyNotes ||
            (studyNotes.studyTopicsIDs.length <= 0 && (
              <Fragment>
                <br />
                <h2 className="section-title">
                  There are no Study Topics for this user.{" "}
                </h2>
                <p>
                  Either login with another account or return to the interview
                  tool to add Study Topics for this user.
                </p>
              </Fragment>
            ))}
          <PushButton
            inputOrButton="button"
            id="export-json-btn"
            colorType="primary"
            value="session-record"
            data-value="export-json"
            size="large"
            onClick={returnHomeButtonHandler}
            styles={{ top: 0, position: "sticky", zIndex: 90, minWidth: "33%" }}
          >
            &larr; Return to Interview Mode
          </PushButton>
          <LoginStatus />

          {studyNotes && studyNotes.studyTopicsIDs.length > 0 && noDBErrors && (
            <Fragment>
              <h2 className="section-title">Study Topics You Have Selected</h2>

              <div id="study-question-rows">
                <SessionResultsRows
                  questionHistory={allQuestionsSet}
                  hideSectionTitles={true}
                  showLoader={true}
                  refToPass={scrollToElm}
                  scrollToID={targetIDToScrollTo}
                  hideStockRowButtons={true}
                  customButtonJSKFunction={rowDeleteButtonJSKFunction}
                  hideCollapsibleElm={true}
                />
              </div>
            </Fragment>
          )}
        </div>
        <Fragment>
          <OutputControls
            hideExportIncorrectToCSVButton={true}
            hideExportSessionHistoryToJSONButton={true}
            hideAllQuestionsListButton={true}
            showExportStudyTopicsToCSV={true}
          />
        </Fragment>
      </CardSecondary>
      <CardSecondary>
        <Footer />
      </CardSecondary>
      <BottomBar />
    </div>
  );
}

export default StudyTopicsTool;
