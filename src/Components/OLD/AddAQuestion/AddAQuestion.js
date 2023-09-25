import { useState } from "react";

import styles from "./AddAQuestion.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAQuestionForm from "./AddAQuestionForm";
import LoginStatus from "../User/LoginStatus/LoginStatus";

function AddAQuestion(props) {
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);

  function showNewQuestionFormButtonHandler() {
    setShowAddQuestionForm(!showAddQuestionForm);
  }

  return (
    <div id="add-a-question-controls" className={styles.outerwrap}>
      <LoginStatus />
      <div id="add-quest-wrap" className={styles["add-quest-wrap"]}>
        <h2 className="section-title">Add Questions Here</h2>
        <p>
          To add questions to this tool, simply click the{" "}
          <i>Create an Entry Form</i> button and fill out the small form. Feel
          free to click the same button to create as many forms as needed to add
          multiple question at once. When they are all ready, click the{" "}
          <i>Submit</i> button. If you are logged in with the appropriate level
          the question will be immediately added. If not, the question will be
          submitted for review first before being added.
        </p>
        <p>Thanks for contributing!</p>
        <div
          id="add-question-container"
          className={`${styles["inner-wrap"]}  ${styles["add-question-container"]}`}
        >
          <div className={styles["button-container"]}>
            <PushButton
              inputOrButton="button"
              id="create-entry-btn"
              colorType="primary"
              value="Add a Question"
              data=""
              size="small"
              onClick={showNewQuestionFormButtonHandler}
            >
              {showAddQuestionForm && (
                <span>
                  <b>Cancel</b> the Question Entry Form
                </span>
              )}
              {!showAddQuestionForm && (
                <span>Show the Question Entry Form</span>
              )}
            </PushButton>
          </div>
          {showAddQuestionForm && <AddAQuestionForm />}
        </div>
      </div>
    </div>
  );
}

export default AddAQuestion;
