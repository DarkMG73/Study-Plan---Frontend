import styles from "./AllQuestions.module.css";
import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import SessionResultsRows from "../../Components/SessionResultsRows/SessionResultsRows";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import OutputControls from "../../Components/OutputControls/OutputControls";
import AddAQuestion from "../../Components/AddAQuestion/AddAQuestion";
import Footer from "../../Components/Footer/Footer";
import BottomBar from "../../Components/BottomBar/BottomBar";

function AllQuestions(props) {
  const { allQuestions, questionMetadata } = useSelector(
    (state) => state.studyPlanData
  );
  const noDBErrors = props.noDBErrors;

  let navigate = useNavigate();

  const allQuestionsSet = { questions: {} };
  const groupSize = 10000;
  let count = 0;
  for (const key in allQuestions) {
    allQuestionsSet.questions[key] = { ...allQuestions[key] };
    count++;
    if (count >= groupSize) break;
  }
  const returnHomeButtonHandler = () => {
    navigate("../", { replace: false });
  };

  return (
    <div>
      <div id="all-questions-page" className={styles.outerwrap}>
        {!noDBErrors.status && (
          <CardSecondary>
            <p className={styles["db-error-message"]}>{noDBErrors.message}</p>
          </CardSecondary>
        )}
        <PushButton
          inputOrButton="button"
          id="export-json-btn"
          colorType="primary"
          value="session-record"
          data-value="export-json"
          size="large"
          onClick={returnHomeButtonHandler}
          styles={{
            top: 0,
            position: "sticky",
            zIndex: 90,
            minWidth: "33%",
            borderRadius: "50px",
            maxWidth: "max-content",
            margin: "0 auto",
          }}
        >
          &larr; Return to Interview Mode
        </PushButton>
        {noDBErrors.status && (
          <Fragment>
            <AddAQuestion />
            <h2 className="section-title">List of All of the Questions</h2>
            <div className={styles["list-outer-wrap"]}>
              <div id="all-questions">
                <SessionResultsRows
                  questionHistory={allQuestionsSet}
                  hideSectionTitles={true}
                  showLoader={true}
                />
              </div>
            </div>
          </Fragment>
        )}
      </div>
      {noDBErrors.status && (
        <CardPrimary>
          <OutputControls
            hideExportIncorrectToCSVButton={true}
            hideExportSessionHistoryToJSONButton={true}
            hideAllQuestionsListButton={true}
            showExportAllQuestions={true}
          />
        </CardPrimary>
      )}
      <BottomBar />
      <CardSecondary>
        <Footer />
      </CardSecondary>
    </div>
  );
}

export default AllQuestions;
