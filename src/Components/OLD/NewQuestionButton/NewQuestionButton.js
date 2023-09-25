import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { catalogDataActions } from "../../store/catalogDataSlice";
import { authActions } from "../../store/authSlice";
import { timerActions } from "../../store/timerSlice";
import styles from "./NewQuestionButton.module.css";
import storage from "../../storage/storage";
import { updateUserHistory } from "../../storage/userDB";
import PushButton from "../../UI/Buttons/PushButton/PushButton";

function NewQuestionButton(props) {
  const [questionComplete, setQuestionComplete] = useState(false);
  const { questionHistory, currentFilters, ...otherQuestionData } = useSelector(
    (state) => state.catalogData
  );
  const {
    questionHistoryStorageNeedsUpdate,
    currentQuestionData,
  } = otherQuestionData;
  const { user, recentLogin, recentLogout } = useSelector(
    (state) => state.auth
  );
  const timerRunning = useSelector((state) => state.timer.timerRunning);
  const dispatch = useDispatch();

  useEffect(() => {
    if (questionComplete) {
      dispatch(catalogDataActions.addToHistoryUnmarked());
      dispatch(catalogDataActions.questionHistoryStorageNeedsUpdate(true));
      setQuestionComplete(false);
    }
  }, [questionComplete, setQuestionComplete]);

  useEffect(() => {
    if (!currentQuestionData && timerRunning) {
      dispatch(timerActions.clearTimer());
    }
  }, [currentQuestionData, timerRunning]);

  useEffect(() => {
    if (questionHistoryStorageNeedsUpdate) {
      if (user === false || user === "not logged in") {
        storage("ADD", {
          questionHistory,
          currentFilters,
          ...otherQuestionData,
        });
      } else if (user) {
        updateUserHistory({ user, dataObj: questionHistory });
      }

      dispatch(catalogDataActions.questionHistoryStorageNeedsUpdate(false));
    }
  }, [questionHistoryStorageNeedsUpdate]);

  function newQuestionBtnHandler() {
    dispatch(timerActions.clearTimer());
    dispatch(timerActions.startTimer());
    dispatch(timerActions.initiateQuiz());

    dispatch(catalogDataActions.generateNewQuestion());
    if (props.scrollToElm)
      props.scrollToElm.current.scrollIntoView({ behavior: "smooth" });
  }

  function finishQuestionBtnHandler() {
    dispatch(timerActions.stopTimer());
    setQuestionComplete(true);
    props.scrollToAnswer.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={styles["new-question-button-wrap"]}>
      {!timerRunning && (
        <PushButton
          inputOrButton="button"
          id="new-question-button"
          colorType="primary"
          dataValue="New Question"
          data=""
          size="heading"
          onClick={newQuestionBtnHandler}
          styles={{
            boxShadow:
              "inset 4px 4px 14px -7px rgb(255 255 255),  inset -4px -4px 14px -7px rgb(0 0 0 / 50%)",
          }}
        >
          <h1 className="ms1-header">Grab a New Question</h1>
        </PushButton>
      )}
      {timerRunning && (
        <PushButton
          inputOrButton="button"
          id="finish-question-button"
          colorType="secondary"
          dataValue="New Question"
          data=""
          size="heading"
          onClick={finishQuestionBtnHandler}
          styles={{
            boxShadow:
              "inset 4px 4px 14px -7px rgb(255 255 255),  inset -4px -4px 14px -7px rgb(0 0 0 / 50%)",
          }}
        >
          <h1 className="ms1-header">Click When Finished</h1>
        </PushButton>
      )}
    </div>
  );
}

export default NewQuestionButton;
