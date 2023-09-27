import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, Fragment } from "react";
import styles from "./SessionRowNotes.module.css";
import { studyPlanDataActions } from "../../../store/studyPlanDataSlice";
import { updateUserHistory } from "../../../storage/userDB";
import storage from "../../../storage/storage";
import { updateStudyNotes } from "../../../storage/userDB";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";

const SessionRowNotes = (props) => {
  const rowNotesElm = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { studyNotes, ...otherQuestionData } = useSelector(
    (state) => state.studyPlanData
  );
  const { questionHistory } = otherQuestionData;
  const [currentRowNotesText, setCurrentRowNotesText] = useState();
  const placeholderText = "";
  const [studyNoteElmHeight, setStudyNoteElmHeight] = useState("30em");
  const rowKey = props.rowKey;

  const rowNotesSubmitHandler = (e) => {
    e.preventDefault();
    const newQuestionHistory = { ...questionHistory };
    newQuestionHistory.questionPersonalNotes = {
      ...newQuestionHistory.questionPersonalNotes,
    };
    if (!newQuestionHistory.hasOwnProperty("questionPersonalNotes")) {
      newQuestionHistory.questionPersonalNotes = {
        [rowKey]: rowNotesElm.current.value,
      };
    } else {
      newQuestionHistory.questionPersonalNotes[rowKey] =
        rowNotesElm.current.value;
    }

    dispatch(studyPlanDataActions.updateQuestionHistory(newQuestionHistory));
    dispatch(studyPlanDataActions.questionHistoryStorageNeedsUpdate(true));
  };

  const rowNotesOnChangeHandler = (e) => {
    setCurrentRowNotesText(rowNotesElm.current.value);
  };

  const clearNotesButtonHandler = (e) => {
    const confirm = window.confirm(
      "Are you sure you want to delete your notes on this question? This can not be undone.\n\nThis will not affect any other notes on other questions."
    );
    if (confirm) {
      const newQuestionHistory = { ...questionHistory };
      setCurrentRowNotesText("");
      newQuestionHistory.questionPersonalNotes = {
        ...newQuestionHistory.questionPersonalNotes,
      };
      delete newQuestionHistory.questionPersonalNotes[rowKey];
      dispatch(studyPlanDataActions.updateQuestionHistory(newQuestionHistory));
      dispatch(studyPlanDataActions.questionHistoryStorageNeedsUpdate(true));
    }
  };

  useEffect(() => {
    // Use to start at full height.
    if (rowNotesElm.current) {
      rowNotesElm.current.style.height = "1px";
      rowNotesElm.current.style.height =
        25 + rowNotesElm.current.scrollHeight + "px";
    }
  }, [rowNotesElm.current]);

  useEffect(() => {
    if (questionHistory.questionPersonalNotes[rowKey]) {
      setCurrentRowNotesText(questionHistory.questionPersonalNotes[rowKey]);
    } else {
      setCurrentRowNotesText(placeholderText);
    }
  }, [questionHistory.questionPersonalNotes[rowKey]]);

  function textAreaAdjust() {
    if (rowNotesElm.current) {
      rowNotesElm.current.style.height = "1px";
      rowNotesElm.current.style.height =
        25 + rowNotesElm.current.scrollHeight + "px";
    }
    // setStudyNoteElmHeight(25 + rowNotesElm.current.scrollHeight);
  }

  return (
    <Fragment>
      {" "}
      {currentRowNotesText !== questionHistory.questionPersonalNotes[rowKey] &&
        currentRowNotesText !== placeholderText && (
          <div className={styles["notes-not-saved-frame"]}>
            <div className={styles["not-saved-frame-text"]}>
              <p>Notes Are NOT Saved</p>
            </div>
            <div
              className={
                styles["not-saved-frame-text"] + " " + styles["right-side"]
              }
            >
              <p>Notes Are NOT Saved</p>
            </div>
          </div>
        )}
      <div
        className={`${styles[rowKey]} ${styles[rowKey + "-title"]}
    ${styles["grid-item"]}
    ${styles["study-notepad-container"]}`}
      >
        {" "}
        <form
          className={styles["form"]}
          onSubmit={rowNotesSubmitHandler}
          onChange={rowNotesOnChangeHandler}
        >
          <h3
            className={`${styles[rowKey]} ${styles[rowKey + "-title"]}
        ${styles["grid-item-title"]} 
        ${styles["grid-item-child"]}`}
          >
            Note Pad
          </h3>
          <br />
          {(currentRowNotesText ===
            questionHistory.questionPersonalNotes[rowKey] ||
            currentRowNotesText === placeholderText) && (
            <Fragment>
              <p>
                This can help you remember thoughts on the question, and
                approach to the answer or even the actual answer code you came
                up with. These notes will stay with the question in your Session
                Results. They will remain with the question even if you remove
                the question and add it back later. These will only be deleted
                if you click "Clear Notes" below or use the "Clear All Notes"
                button.
              </p>
              <br />
            </Fragment>
          )}
          {currentRowNotesText !==
            questionHistory.questionPersonalNotes[rowKey] &&
            currentRowNotesText !== placeholderText && (
              <input
                type="submit"
                value="Save Notes"
                className={styles["notes-not-saved-button"]}
              />
            )}
          <div className={styles.paper}>
            <div className={styles["paper-content"]}>
              <textarea
                onChange={textAreaAdjust}
                value={currentRowNotesText}
                ref={rowNotesElm}
                className={styles["note-pad-textarea"]}
                placeholder="Notes..."
                style={{ heights: studyNoteElmHeight + "px" }}
              />
            </div>
          </div>
          <div className={styles["list-item-clear-list"]}>
            <PushButton
              inputOrButton="button"
              id="study-topic-delete-button"
              colorType="primary"
              value="Clear Study Notes"
              size="small"
              styles={{ borderRadius: "0 0 10px 10px", margin: "0 auto" }}
              onClick={clearNotesButtonHandler}
            >
              Clear Study Notes
            </PushButton>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default SessionRowNotes;
