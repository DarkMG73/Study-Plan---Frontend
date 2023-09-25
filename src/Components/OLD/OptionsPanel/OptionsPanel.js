import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./OptionsPanel.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import Card from "../../UI/Cards/Card/Card";
import { timerActions } from "../../store/timerSlice";

function OptionsPanel(props) {
  const { answer, search } = useSelector(
    (state) => state.catalogData.currentQuestionData
  );
  const dispatch = useDispatch();
  const { timerRunning, peekTimer } = useSelector((state) => state.timer);
  const [answerPeek, setAnswerPeek] = useState(false);

  useEffect(() => {
    let timer = null;
    if (answerPeek && peekTimer > 0) {
      timer = setInterval(() => {
        dispatch(timerActions.peekTimerDecrease());
      }, 1000);
    } else {
      clearInterval(timer);
      dispatch(timerActions.clearPeekTimer());
      setAnswerPeek(false);
    }
    return () => clearInterval(timer);
  }, [answerPeek, peekTimer, dispatch]);

  function peakAtAnswerBtnHandler(e) {
    setAnswerPeek(!answerPeek);
  }

  function aboutQuestionBtnHandler(e) {
    const searchSubString = search
      .toString()
      .replace(",", "+")
      .replace(" ", "");
    const searchString = `https://search.brave.com/search?q=${searchSubString}&source=web`;
    window.open(searchString, "_blank");
  }

  function goToAnswerWorkspaceBtnHandler() {
    props.scrollToAnswer.current.scrollIntoView({ behavior: "smooth" });
  }

  function viewSessionRecordBtnHandler(e) {
    if (props.scrollToSessionResults)
      props.scrollToSessionResults.current.scrollIntoView({
        behavior: "smooth",
      });
  }

  return (
    <div id="options-panel" className={styles["inner-wrap"]}>
      {answer && (
        <PushButton
          inputOrButton="button"
          id="answer"
          colorType="secondary"
          value="answer"
          data=""
          size="small"
          onClick={peakAtAnswerBtnHandler}
        >
          {answerPeek ? (
            <span>Close the Peek Window</span>
          ) : (
            <span>Peek at the Answer</span>
          )}
        </PushButton>
      )}
      {timerRunning && (
        <PushButton
          inputOrButton="button"
          id="answer-workspace"
          colorType="secondary"
          value="Answer Workspace"
          data=""
          size="large"
          onClick={goToAnswerWorkspaceBtnHandler}
        >
          Jump to Answer Workspace
        </PushButton>
      )}
      {search && (
        <PushButton
          inputOrButton="button"
          id="learn-question"
          colorType="secondary"
          value="learn-question"
          data=""
          size="small"
          onClick={aboutQuestionBtnHandler}
        >
          About this Question
        </PushButton>
      )}
      {!timerRunning && (
        <PushButton
          inputOrButton="button"
          id="session-record-btn"
          colorType="secondary"
          value="session-record"
          data=""
          size="small"
          onClick={viewSessionRecordBtnHandler}
        >
          View Session Record
        </PushButton>
      )}

      {answerPeek && (
        <div className={styles.answer}>
          <br />
          <Card>
            <h3>Peek at the Answer</h3>
            <p>
              Below are bits and pieces of the answer to help jog your memory.
              It is not intended for memorizing, copy & paste, etc. If you find
              yourself stuck even after this little sneak peek, it is best to
              end the question, mark it as "Incorrect" and use the asnwer in the
              Session Results" section to launch further study.
            </p>

            <p>
              <span>Peek time left: </span>
              {peekTimer}
            </p>

            <pre>
              <code className={styles.code}>{answer}</code>
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
}

export default OptionsPanel;
