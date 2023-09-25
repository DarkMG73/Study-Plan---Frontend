import styles from "./StudyNotesPage.module.css";
import { statusUpdateActions } from "../../store/statusUpdateSlice";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";
import axios from "axios";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import SessionResultsRows from "../../Components/SessionResultsRows/SessionResultsRows";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import OutputControls from "../../Components/OutputControls/OutputControls";
import Footer from "../../Components/Footer/Footer";
import BottomBar from "../../Components/BottomBar/BottomBar";
import LoginStatus from "../../Components/User/LoginStatus/LoginStatus";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";
import { authActions } from "../../store/authSlice";
import { updateStudyNotes } from "../../storage/userDB";
import storage from "../../storage/storage";
import NotePad from "../../Components/StudyNotes/NotePad/NotePad";

function StudyNotesPage(props) {
  const studyNotesElm = useRef();
  const dispatch = useDispatch();
  const location = useLocation();
  const { studyNotes, ...otherQuestionData } = useSelector(
    (state) => state.studyPlanData
  );
  const [currentStudyNotesText, setCurrentStudyNotesText] = useState(
    studyNotes.notePad
  );
  const [studyNoteElmHeight, setStudyNoteElmHeight] = useState("30em");
  const user = useSelector((state) => state.auth.user);
  const [noDBErrors, setNoDBErrors] = useState(true);
  const dBErrorMessage = props.dBErrorMessage;
  const setDbErrorMessage = props.setDbErrorMessage;
  const params = new URLSearchParams(window.location.pathname);

  let targetIDToScrollTo = location.state;

  const scrollToElm = useRef();
  let navigate = useNavigate();

  if (targetIDToScrollTo && targetIDToScrollTo.hasOwnProperty("_id"))
    targetIDToScrollTo = targetIDToScrollTo._id;

  const returnHomeButtonHandler = () => {
    navigate("../", { replace: false });
  };

  const studyNotesSubmitHandler = (e) => {
    e.preventDefault();
    const newStudyNotes = { ...studyNotes };
    newStudyNotes.notePad = studyNotesElm.current.value;
    dispatch(studyPlanDataActions.updateStudyNotes(newStudyNotes));
    if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
    if (!user)
      storage("ADD", { studyNotes: newStudyNotes, ...otherQuestionData });
  };

  const studyNotesOnChangeHandler = (e) => {
    setCurrentStudyNotesText(studyNotesElm.current.value);
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

  useEffect(() => {
    setCurrentStudyNotesText(studyNotes.notePad);
  }, [studyNotes.notePad]);

  useEffect(() => {
    textAreaAdjust();
  }, [currentStudyNotesText]);

  useEffect(() => {
    // Use to start at full height.
    if (studyNotesElm.current) {
      studyNotesElm.current.style.height = "1px";
      studyNotesElm.current.style.height =
        25 + studyNotesElm.current.scrollHeight + "px";
    }
  }, [studyNotesElm.current]);

  function textAreaAdjust() {
    if (studyNotesElm.current) {
      studyNotesElm.current.style.height = "1px";
      studyNotesElm.current.style.height =
        25 + studyNotesElm.current.scrollHeight + "px";
      // setStudyNoteElmHeight(25 + studyNotesElm.current.scrollHeight);
    }
  }

  return (
    <div>
      <CardSecondary>
        <div id="study-notes-page" className={styles["study-notes-page"]}>
          {!noDBErrors && (
            <CardSecondary>
              <p className={styles["db-error-message"]}>{dBErrorMessage}</p>
            </CardSecondary>
          )}
          {!studyNotes ||
            (!studyNotes.hasOwnProperty("notePad") && (
              <Fragment>
                <br />
                <h2 className="section-title">
                  There are no Study Notes for this user.
                </h2>
                <p>
                  Either login with another account or return to the interview
                  tool to add Study Notes for this user.
                </p>
              </Fragment>
            ))}
          <PushButton
            inputOrButton="button"
            id="export-json-btn"
            colorType="primary"
            value="session-record"
            data-value="export-json"
            size="large"
            onClick={returnHomeButtonHandler}
            styles={{ top: 0, position: "sticky", zIndex: 90, minWidth: "33%" }}
          >
            &larr; Return to Interview Mode
          </PushButton>
          <LoginStatus />

          {studyNotes && studyNotes.hasOwnProperty("notePad") && noDBErrors && (
            <NotePad
              openLoaderThenLaunch={false}
              doNotShowLaunchButtons={true}
            />
          )}
        </div>
        <Fragment>
          <OutputControls
            hideExportIncorrectToCSVButton={true}
            hideExportSessionHistoryToJSONButton={true}
            hideAllQuestionsListButton={true}
            showExportStudyNotePadToCSV={true}
          />
        </Fragment>
      </CardSecondary>
      <CardSecondary>
        <Footer />
      </CardSecondary>
      <BottomBar />
    </div>
  );
}

export default StudyNotesPage;
