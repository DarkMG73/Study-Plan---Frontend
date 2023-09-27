import styles from "./AddAQuestionFormElms.module.css";
import { useState, Fragment } from "react";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";

function AddAQuestionFormElms() {
  const [formOpen, setFormOpen] = useState(true);
  function cancelQuestionFormButtonHandler() {
    const close = window.confirm(
      "Are you sure you want to cancel this specific question? Any data input for this question will be lost (other questions in this Question Entry Form will not be affected)? "
    );
    if (close) setFormOpen(false);
  }
  return (
    <Fragment>
      {formOpen && (
        <CardPrimary styles={{ position: "relative" }}>
          <div id="question-89702" className={styles["form-group-wrap"]}>
            <div id="topic-wrap-89702">
              <label id="label-topic-89702" className="input topic-label">
                Topic
              </label>
              <select
                element="select"
                id="topic-89702"
                data-key="topic"
                data-group-id="question-89702"
                type="select"
                name="topic"
                className="input topic"
                selectoptions="[object Object]"
              >
                <option id="optionOne-opt-topic-89702" value="html">
                  HTML
                </option>
                <option id="optionTwo-opt-topic-89702" value="css">
                  CSS
                </option>
                <option id="optionThree-opt-topic-89702" value="javascript">
                  JavaScript
                </option>
                <option id="optionFour-opt-topic-89702" value="algorithms">
                  Algorithms &amp; Data Structures
                </option>
                <option id="optionFive-opt-topic-89702" value="noncoding">
                  Non-Coding
                </option>
              </select>
            </div>
            <div id="level-wrap-89702">
              <label id="label-level-89702" className="input level-label">
                Level
              </label>
              <select
                element="select"
                id="level-89702"
                data-key="level"
                data-group-id="question-89702"
                type="select"
                name="level"
                className="input level"
                selectoptions="[object Object]"
              >
                <option id="optionOne-opt-level-89702" value="basic">
                  Basic
                </option>
                <option id="optionTwo-opt-level-89702" value="advanced">
                  Advanced
                </option>
              </select>
            </div>
            <div id="title-wrap-89702">
              <label
                id="label-title-89702"
                className="input form-quest-title-label"
              >
                Title
              </label>
              <input
                element="input"
                id="title-89702"
                data-key="title"
                data-group-id="question-89702"
                type="text"
                name="title"
                placeholder="...a one-sentence question..."
                className="input form-quest-title"
                required="true"
              />
            </div>
            <div
              id="question-wrap-89702"
              className={styles["form-question-container"]}
            >
              <label
                id="label-question-89702"
                className="input form-quest-title-label"
              >
                question
              </label>
              <textarea
                element="textarea"
                id="question-89702"
                data-key="question"
                data-group-id="question-89702"
                name="question"
                className="input form-quest-title"
                placeholder="...the question detail..."
              ></textarea>
            </div>
            <div
              id="answer-wrap-89702"
              className={styles["form-answer-container"]}
            >
              <label id="label-answer-89702" className="input form-answer-label">
                Answer
              </label>
              <textarea
                element="textarea"
                id="answer-89702"
                data-key="answer"
                data-group-id="question-89702"
                name="answer"
                className="input form-answer"
                placeholder="...the answer..."
                required="true"
              ></textarea>
            </div>
            <div id="search-wrap-89702">
              <label id="label-search-89702" className="input form-search-label">
                Search Terms
              </label>
              <input
                element="input"
                id="search-89702"
                data-key="search"
                data-group-id="question-89702"
                type="text"
                name="search"
                className="input form-searchterms"
                placeholder="...seperate each with a comma..."
              />
            </div>
            <div id="link-wrap-89702">
              <label id="label-link-89702" className="input form-link-label">
                Link
              </label>
              <input
                element="input"
                id="link-89702"
                data-key="link"
                data-group-id="question-89702"
                type="url"
                name="link"
                className="input form-link"
                placeholder="...url..."
              />
            </div>
            <div id="credit-wrap-89702">
              <label id="label-credit-89702" className="input form-credit-label">
                Credit
              </label>
              <textarea
                element="textarea"
                id="credit-89702"
                data-key="credit"
                data-group-id="question-89702"
                name="credit"
                className="input form-credit"
                placeholder="...url..."
              ></textarea>
            </div>
            <div id="tags-wrap-89702">
              <label id="label-tags-89702" className="input form-tags-label">
                Tags
              </label>
              <input
                element="input"
                id="tags-89702"
                data-key="tags"
                data-group-id="question-89702"
                type="text"
                name="tags"
                className="input form-tags"
                placeholder="...separate each with a comma..."
              />
            </div>
            <button
              className={styles["close-question-form-button"]}
              onClick={cancelQuestionFormButtonHandler}
            >
              X
            </button>
          </div>
        </CardPrimary>
      )}
    </Fragment>
  );
}

export default AddAQuestionFormElms;
