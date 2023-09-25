import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Answer.module.css";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";
import CardTransparent from "../../UI/Cards/CardTransparent/CardTransparent";
import Card from "../../UI/Cards/Card/Card";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import useStudyTopicIdAddToStorage from "../../Hooks/useStudyTopicIdAddToStorage";

function Answer() {
  const { currentQuestionData, allQuestions } = useSelector(
    (state) => state.studyPlanData
  );
  const user = useSelector((state) => state.auth.user);
  const { questionHistory, currentFilters } = useSelector(
    (state) => state.studyPlanData
  );
  const [isAnswerCorrect, seIsAnswerCorrect] = useState(null);
  const dispatch = useDispatch();
  const studyTopicAddToStorage = useStudyTopicIdAddToStorage();
  const [noPulse, setNoPulse] = useState(false);

  useEffect(() => {
    if (isAnswerCorrect) {
      setNoPulse(true);
      dispatch(studyPlanDataActions.addToHistoryCorrect());
      dispatch(studyPlanDataActions.questionHistoryStorageNeedsUpdate(true));
    }

    if (isAnswerCorrect === false) {
      setNoPulse(true);
      dispatch(studyPlanDataActions.addToHistoryIncorrect());
      dispatch(studyPlanDataActions.questionHistoryStorageNeedsUpdate(true));
    }
  }, [isAnswerCorrect]);

  let correctSelected = "";
  let incorrectSelected = "";

  function answerCorrectBtnHandler() {
    seIsAnswerCorrect(true);
  }
  function answerNotCorrectBtnHandler() {
    seIsAnswerCorrect(false);
  }

  if (isAnswerCorrect) {
    correctSelected = "selected";
    incorrectSelected = "";
  }

  if (isAnswerCorrect === false) {
    correctSelected = "";
    incorrectSelected = "selected";
  }

  const studyTopicIDSubmitHandler = (e) => {
    e.preventDefault();
    let questionIdentifier = Object.keys(allQuestions).filter(
      (questionID) => allQuestions[questionID]._id == e.target.value
    );
    questionIdentifier = questionIdentifier.toString();

    if (questionIdentifier.length <= 0) {
      alert(
        "That question ID does not appear in the master list. Please make sure to copy and paste the full ID."
      );
    } else {
      studyTopicAddToStorage({ questionIdentifier })
        .then((res) => {
          if (!res.status) {
            alert(res.message);
          } else {
            alert("This question is now on the Study Topics list.");
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  return (
    <CardTransparent
      styles={{
        boxShadow:
          "inset 0 8px 15px -13px rgb(0 0 0 / 30%), 0 -8px 15px -16px white",
        paddingBottom: "2em",
        margin: "4em 0 1em",
      }}
    >
      <div className={styles["outer-wrap"]}>
        <h2 className="section-title">The Answer</h2>
        <div className={styles["answer-buttons-wrap"]}>
          <form
            name="is-answer-correct"
            className={styles["answer-button-container"]}
          >
            <p className={styles.subtitle}>Did you get it right?</p>
            <div
              className={
                styles["yes-no-button-wrap"] +
                " " +
                (noPulse && styles["no-pulse"])
              }
            >
              <PushButton
                label={false}
                colorType="secondary"
                size="large"
                InputOrButton="input"
                type="button"
                name="answer-correct"
                value="Yes"
                onClick={answerCorrectBtnHandler}
                styles={{
                  margin: "auto",
                  flexGrow: "1",
                  boxShadow:
                    "3px 3px 7px -5px white inset, -3px -3px 7px -5px rgba(0, 0, 0, 0.5) inset",
                }}
                selected={correctSelected}
              />
              <PushButton
                label={false}
                colorType="secondary"
                size="large"
                InputOrButton="input"
                type="button"
                name="answer-not-correct"
                value="No"
                onClick={answerNotCorrectBtnHandler}
                styles={{
                  margin: "auto",
                  flexGrow: "1",
                  boxShadow:
                    "3px 3px 7px -5px white inset, -3px -3px 7px -5px rgba(0, 0, 0, 0.5) inset",
                }}
                selected={incorrectSelected}
              />
            </div>
          </form>
          <div className={styles["button-container"]}>
            <p className={styles.subtitle}>Need to study it later?</p>
            <PushButton
              inputOrButton="button"
              type="button"
              id="study-topic-add-button"
              colorType="secondary"
              value={currentQuestionData._id}
              size="large"
              styles={{
                margin: "auto",
                borderRadius: "20px 50px 50px 20px",
                letterSpacing: "0.25em",
                fontVariant: "small-caps",
                flexGrow: 1,
                fontWight: "700 !important",
                boxShadow:
                  "3px 3px 7px -5px white inset, -3px -3px 7px -5px rgba(0, 0, 0, 0.5) inset",
              }}
              onClick={studyTopicIDSubmitHandler}
            >
              Add to Study List
            </PushButton>
          </div>
        </div>
        <div className={styles["inner-wrap"]}>
          <Card>
            <pre>
              <code className={styles.text}> {currentQuestionData.answer}</code>
            </pre>
            <a
              className={styles["more-about-this-link"]}
              href={`https://search.brave.com/search?q=${currentQuestionData.search}&source=web`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about this with a Brave Search &rarr;
            </a>
          </Card>
        </div>
      </div>
    </CardTransparent>
  );
}

export default Answer;
