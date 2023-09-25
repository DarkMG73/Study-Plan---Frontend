import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SessionResults.module.css";
import Score from "../../Components/Score/Score";
import SessionResultsRows from "../../Components/SessionResultsRows/SessionResultsRows";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import { ReactComponent as BrainLogo } from "../../assets/images/brain-logo.svg";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";

function SessionResults(props) {
  const dispatch = useDispatch();
  const { allQuestions } = useSelector((state) => state.studyPlanData);

  const questionHistory = useSelector(
    (state) => state.studyPlanData.questionHistory
  );
  const sessionResultsBox = useRef();

  const clearAllQuestionPersonalNotesButtonHandler = (e) => {
    const confirm = window.confirm(
      "Are you sure you want to delete all of your notes on the questions in your Session History? This can not be undone.You might want to consider deleting notes individually.\n\nThis will not affect the questions themselves. This will only remove any notes you have added directly to questions in your Session History."
    );
    if (confirm) {
      const newQuestionHistory = { ...questionHistory };
      newQuestionHistory.questionPersonalNotes = {
        ...newQuestionHistory.questionPersonalNotes,
      };
      newQuestionHistory.questionPersonalNotes = {};
      dispatch(studyPlanDataActions.updateQuestionHistory(newQuestionHistory));
      dispatch(studyPlanDataActions.questionHistoryStorageNeedsUpdate(true));
    }
  };

  useEffect(() => {
    props.setScrollToSessionResults(sessionResultsBox);
  }, []);

  if (
    Object.keys(allQuestions).length <= 0 ||
    Object.keys(allQuestions).includes("errorGettingDataFromDatabase")
  )
    return (
      <CardPrimary>
        {" "}
        <div className={styles["logo-wrap"]}>
          <BrainLogo />{" "}
        </div>
      </CardPrimary>
    );
  return (
    <div
      id="session-results"
      className={styles.outerwrap}
      ref={sessionResultsBox}
    >
      <h2 className="section-title">Session Results</h2>
      <Score
        title={false}
        showResetBtn={true}
        showCorrect={true}
        showIncorrect={true}
        showUnmarked={true}
        showCount={true}
      />
      <div className={styles["list-item-clear-list"]}>
        <PushButton
          inputOrButton="button"
          id="study-topic-delete-button"
          colorType="primary"
          value="Clear Study Notes"
          size="small"
          styles={{ borderRadius: "10px", margin: "0 auto" }}
          onClick={clearAllQuestionPersonalNotesButtonHandler}
        >
          Clear All Study Notes
        </PushButton>
      </div>

      <ErrorBoundary>
        <SessionResultsRows
          questionHistory={questionHistory}
          showLoader={props.showLoader}
        />
      </ErrorBoundary>
    </div>
  );
}

export default SessionResults;
