import { useRef, useEffect } from "react";
import styles from "./Question.module.css";
import { useSelector } from "react-redux";
import Card from "../../UI/Cards/Card/Card";
import OptionsPanel from "../../Components/OptionsPanel/OptionsPanel";

function Question(props) {
  const currentQuestionData = useSelector(
    (state) => state.catalogData.currentQuestionData
  );

  const questionBox = useRef();
  const setScrollToElm = props.setScrollToElm;
  useEffect(() => {
    setScrollToElm(questionBox);
  }, [setScrollToElm]);

  const welcomeMessage = (
    <p>
      Using this is pretty simple. Click the "New Question" button and you will
      begin receiving questions from all difficulty levels and topics. If you
      wish to filter these, select your desired difficulty level, either "Basic"
      or "Advanced", then choose any combination of topics: "HTML", "CSS" or
      JavaScript", etc. Whatever combination of levels and topics you select
      will be used to limit the questions to only match that criteria.
      <br />
      <br />
      When you are finished answering the question, click the "Finished" button
      and the timer will stop. Use the buttons that appear to mark whether you
      got the question "Correct" or "Incorrect". This will record the question
      so you can review it later, if desired.
      <br />
      <br />
      If you need help along the way, you can click the "About this Question"
      button or view the answer by clicking the "Peek at the Answer" button. The
      timer will not stop for either of these actions.
      <br />
      <br />
      There are many features, like the ability to add questions to a study
      list, a general notepad plus individual notepads for each question in your
      Session History. Look around for more features and tools do make the most
      out of this tool.
      <br />
      <br />
      <i>
        Note: If you do not mark the question "correct" or "Incorrect" it will
        still be recorded, but will show up on this list as "Unmarked", which
        will not be helpful for you, so make sure to mark each question. Once
        you move on to a new question you will not be able to change the
        "Correct", "Incorrect" or "Unmarked" status. You can click on the button
        to remove that question from your history. Once removed, it will be
        added back in with the unused questions and will be asked again at a
        later point. You will then be able to mark it "Correct", etc, at that
        point.
        <br />
        <br />
      </i>
      The work you do here is important. This kind of practice makes a
      tremendous difference. Run through these questions over, and over, and
      over again until you feel extremely comfortable with absolutely everything
      here.
      <br />
      <br />
      <b>
        <i>Now, get going and good luck with the job search!</i>
      </b>
    </p>
  );

  let questionText = null;
  if (currentQuestionData) questionText = currentQuestionData.title;

  return (
    <div id="question" className={styles.outerwrap} ref={questionBox}>
      <h2 className={"section-title" + " " + styles["question-section-title"]}>
        Question
      </h2>
      <Card>
        {!questionText && (
          <div>
            <div id="question-wrap" className="inner-wrap">
              <h2 className="question-title">How to Use this Tool</h2>
              <div id="help" className={styles["help"]}>
                {welcomeMessage}
              </div>
            </div>
          </div>
        )}

        {questionText && (
          <div name="question-text" className={styles["question-text-wrap"]}>
            <h3 className={styles["question-title"]}>{questionText}</h3>
            {currentQuestionData.question && (
              <pre className={styles["question-text"]}>
                <code className={styles.code}>
                  {currentQuestionData.question}
                </code>
              </pre>
            )}
          </div>
        )}
      </Card>
      <OptionsPanel
        scrollToSessionResults={props.scrollToSessionResults}
        scrollToAnswer={props.scrollToAnswer}
      />
    </div>
  );
}

export default Question;
