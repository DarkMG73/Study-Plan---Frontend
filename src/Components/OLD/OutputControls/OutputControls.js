import styles from "./OutputControls.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import useExportData, { formatAnObject } from "../../Hooks/useExportData";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";

function OutputControls(props) {
  let navigate = useNavigate();
  const exportData = useExportData({ type: "" });
  const [showAllQuestionPageLoader, setAllQuestionPageLoader] = useState(false);
  const { allQuestions, studyNotes, questionHistory } = useSelector(
    (state) => state.studyPlanData
  );
  const user = useSelector((state) => state.auth.user);

  function exportCSVButtonHandler() {
    if (Object.keys(questionHistory.incorrect).length <= 0) {
      alert(
        'There do not appear to be any questions marked as "Incorrect" in your session history. Either log in with a user account that has a history with incorrect answers, or add answers to the "Incorrect" list as you answer each question.'
      );
    } else {
      exportData({ type: "cvs" });
    }
  }
  function exportStudyTopicsCSVButtonHandler() {
    const userName = user ? user.userName : "No one is logged in";
    const headers = {
      score: userName,
      totalQuestions: studyNotes.studyTopicsIDs.length + " topics to study ",
      level: "Level",
      topic: "Topic",
      title: "Question",
      question: "Question Detail".replace(/,/g, ""), // remove commas to avoid errors
      answer: "Answer",
      time: "Time",
    };

    const dataObj = {};
    studyNotes.studyTopicsIDs.forEach((id) => {
      dataObj[id] = allQuestions[id];
    });
    exportData({
      type: "cvs",
      exportStudyTopics: true,
      headers: headers,
      dataObj: dataObj,
    });
  }

  function exportStudyNotePadCSVButtonHandler() {
    const userName = user ? user.name : "No one is logged in";
    const headers = {
      row: userName,
    };

    const dataObj = { studyNotePadText: studyNotes.notePad };
    exportData({
      type: "cvs",
      exportStudyNotePad: true,
      headers: headers,
      dataObj: dataObj,
    });
  }

  function exportJSONButtonHandler() {
    exportData({ type: "json" });
  }
  function exportAllToJSONButtonHandler() {
    exportData({ type: "json", exportAll: true });
  }
  function exportAllToJSONButtonHandler() {
    exportData({ type: "json", exportAll: true });
  }
  function listOfAllQuestionsButtonHandler() {
    setAllQuestionPageLoader(true);
    setTimeout(
      () => navigate("../list-of-all-questions", { replace: false }),
      200
    );
  }

  return (
    <div id="output-controls" className={styles.outerwrap}>
      <h2 className="section-title">OutputControls</h2>
      <div
        className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
      >
        {!props.hideExportIncorrectToCSVButton && (
          <PushButton
            inputOrButton="button"
            id="export-cvs-btn"
            colorType="secondary"
            value="export-cvs"
            data-value="export-cvs"
            size="medium"
            onClick={exportCSVButtonHandler}
          >
            Export Incorrect Questions to Cvs
          </PushButton>
        )}
        {props.showExportStudyTopicsToCSV && (
          <PushButton
            inputOrButton="button"
            id="export-cvs-btn"
            colorType="secondary"
            value="export-cvs"
            data-value="export-cvs"
            size="medium"
            onClick={exportStudyTopicsCSVButtonHandler}
          >
            Export Study Topics Questions to CSV
          </PushButton>
        )}
        {props.showExportStudyNotePadToCSV && (
          <PushButton
            inputOrButton="button"
            id="export-cvs-btn"
            colorType="secondary"
            value="export-cvs"
            data-value="export-cvs"
            size="medium"
            onClick={exportStudyNotePadCSVButtonHandler}
          >
            Export Study Note Pad to CSV
          </PushButton>
        )}

        {!props.hideExportSessionHistoryToJSONButton && (
          <PushButton
            inputOrButton="button"
            id="export-json-btn"
            colorType="secondary"
            value="export-json"
            data-value="export-json"
            size="medium"
            onClick={exportJSONButtonHandler}
          >
            Export Session History to JSON
          </PushButton>
        )}

        {!showAllQuestionPageLoader && !props.hideAllQuestionsListButton && (
          <PushButton
            inputOrButton="button"
            id="all-quest-link"
            colorType="secondary"
            value="all-questions-list"
            href="./list-of-all-questions"
            data-value="link-all-quests-page"
            size="medium"
            onClick={listOfAllQuestionsButtonHandler}
          >
            All Questions List
          </PushButton>
        )}
        {showAllQuestionPageLoader && (
          <div className={styles["loader-wrap"]}>
            <BarLoader />
          </div>
        )}
        {props.showExportAllQuestions && (
          <PushButton
            inputOrButton="button"
            id="all-quest-link"
            colorType="secondary"
            value="export-all-questions-json"
            href="./list-of-all-questions"
            data-value="link-all-quests-page"
            size="medium"
            onClick={exportAllToJSONButtonHandler}
          >
            Export All Questions to JSON
          </PushButton>
        )}
      </div>
    </div>
  );
}

export default OutputControls;
