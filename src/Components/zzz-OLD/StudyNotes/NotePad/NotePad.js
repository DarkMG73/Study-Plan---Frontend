import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, Fragment } from "react";
import styles from "./NotePad.module.css";
import { studyPlanDataActions } from "../../../store/studyPlanDataSlice";
import { updateStudyNotes } from "../../../storage/userDB";
import storage from "../../../storage/storage";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import BarLoader from "../../../UI/Loaders/BarLoader/BarLoader";

const NotePad = (props) => {
  const dispatch = useDispatch();
  const { studyNotes, ...otherQuestionData } = useSelector(
    (state) => state.studyPlanData
  );
  const { user, recentLogin, recentLogout } = useSelector(
    (state) => state.auth
  );
  const loadingStatus = useSelector(
    (state) => state.loadingRequests.pendingLoadRequests
  );
  const notePadElm = useRef();
  const [inputError, setInputError] = useState(false);
  const [currentStudyNotesText, setCurrentStudyNotesText] = useState(
    studyNotes.notePad
  );
  const [studyNoteElmHeight, setStudyNoteElmHeight] = useState("30em");

  ////////////////////////////////
  /// Handlers
  ////////////////////////////////
  const studyNotesPageButtonHandler = () => {
    props.openLoaderThenLaunch(`../study-notes-page`);
  };
  const studyNotesSubmitHandler = (e) => {
    e.preventDefault();
    const newStudyNotes = { ...studyNotes };
    newStudyNotes.notePad = notePadElm.current.value;
    dispatch(studyPlanDataActions.updateStudyNotes(newStudyNotes));
    if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
    if (!user)
      storage("ADD", { studyNotes: newStudyNotes, ...otherQuestionData });
  };
  const studyNotesOnChangeHandler = (e) => {
    setCurrentStudyNotesText(notePadElm.current.value);
  };
  const clearNotesButtonHandler = (e) => {
    const confirm = window.confirm(
      "Are you sure you want to delete all study topics? This can not be undone."
    );
    if (confirm) {
      const newStudyNotes = { ...studyNotes };
      newStudyNotes.notePad = "Notes\n\n";
      dispatch(studyPlanDataActions.updateStudyNotes(newStudyNotes));
      setCurrentStudyNotesText(newStudyNotes.notePad);
      if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
      if (!user) storage("ADD", { newStudyNotes, ...otherQuestionData });
    }
  };

  ////////////////////////////////
  /// Effects
  ////////////////////////////////
  useEffect(() => {
    if (inputError) alert(inputError);
    setInputError(false);
  }, [inputError]);

  useEffect(() => {
    setCurrentStudyNotesText(studyNotes.notePad);
  }, [studyNotes.notePad]);

  useEffect(() => {
    const interval = setInterval(() => {
      textAreaAdjust();
    }, 500);
    setTimeout(() => {
      clearInterval(interval);
    }, 3000);
  }, [user]);

  useEffect(() => {
    // Use to start at full height.
    notePadElm.current.style.height = "1px";
    notePadElm.current.style.height =
      25 + notePadElm.current.scrollHeight + "px";
  }, [notePadElm.current]);

  function textAreaAdjust() {
    notePadElm.current.style.height = "1px";
    notePadElm.current.style.height =
      25 + notePadElm.current.scrollHeight + "px";
    // setStudyNoteElmHeight(25 + notePadElm.current.scrollHeight);
  }

  ////////////////////////////////
  /// Output
  ////////////////////////////////
  return (
    <div className={styles["study-notepad-container"]}>
      <form
        className={styles["form"]}
        onSubmit={studyNotesSubmitHandler}
        onChange={studyNotesOnChangeHandler}
      >
        <h3 className={styles["title"]}>Notepad</h3>
        {!props.doNotShowLaunchButtons && (
          <div className={styles["list-full-launch"]}>
            <PushButton
              inputOrButton="button"
              id="notpad-launch-full-page"
              colorType="primary"
              value="Open Notepad"
              size="small"
              onClick={studyNotesPageButtonHandler}
            >
              Open Notepad
              <span className={styles["right-arrow"]}>&#x2192;</span>
            </PushButton>
            <Link
              to="/study-notes-page/"
              target="_blank"
              state={{ user: user }}
            >
              Pop Out Notepad
              <span className={styles["up-arrow"]}>&#x2192;</span>
            </Link>
          </div>
        )}
        <p>
          Jot down quick thoughts on a question or subject, or even outline
          ideas for a new study approach, projects ideas, etc. Anything that
          that helps the learning process.
        </p>
        {currentStudyNotesText == studyNotes.notePad && (
          <input
            type="submit"
            value=""
            className={styles["notes-are-saved-button"]}
            disabled
          />
        )}
        {currentStudyNotesText != studyNotes.notePad && (
          <input
            type="submit"
            value="Save Notes"
            className={styles["notes-not-saved-button"]}
          />
        )}{" "}
        {currentStudyNotesText != studyNotes.notePad &&
          loadingStatus === 0 &&
          !recentLogin &&
          !recentLogout && (
            <div className={styles["notes-not-saved-frame"]}>
              <div className={styles["not-saved-frame-text"]}>
                <p>Notes Are NOT Saved</p>
              </div>{" "}
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
          key={currentStudyNotesText[0]}
          className={styles.paper}
          style={{ maxHeight: props.maxHeight }}
        >
          <div className={styles["paper-content"]}>
            <textarea
              onChange={textAreaAdjust}
              value={currentStudyNotesText}
              ref={notePadElm}
              className={styles["note-pad-textarea"]}
              style={{ heights: studyNoteElmHeight + "px" }}
            />
          </div>
        </div>
        {currentStudyNotesText != studyNotes.notePad && (
          <input
            type="submit"
            value="Save Notes"
            className={
              styles["notes-not-saved-button"] + " " + styles["bottom-button"]
            }
          />
        )}
        <div className={styles["clear-notes-button-wrap"]}>
          <PushButton
            inputOrButton="button"
            id="study-topic-delete-button"
            colorType="secondary"
            value="Clear Study Notes"
            size="small"
            onClick={clearNotesButtonHandler}
          >
            Clear Study Notes
          </PushButton>
        </div>
      </form>
    </div>
  );
};

export default NotePad;
