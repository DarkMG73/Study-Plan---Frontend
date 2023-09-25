import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, Fragment } from "react";
import styles from "./StudyNotes.module.css";
import { catalogDataActions } from "../../store/catalogDataSlice";
import { updateStudyNotes } from "../../storage/userDB";
import storage from "../../storage/storage";
import useStudyTopicIdAddToStorage from "../../Hooks/useStudyTopicIdAddToStorage";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import NotePad from "./NotePad/NotePad";
import useViewport from "../../Hooks/useViewport";

const StudyNotes = () => {
  const dispatch = useDispatch();
  const { studyNotes, ...otherQuestionData } = useSelector(
    (state) => state.catalogData
  );
  const user = useSelector((state) => state.auth.user);
  const studyTopicAddToStorage = useStudyTopicIdAddToStorage();
  const allQuestions = useSelector((state) => state.catalogData.allQuestions);
  const studyTopicIdentifierElm = useRef();
  const [inputError, setInputError] = useState(false);

  const navigate = useNavigate();
  const [showAllQuestionPageLoader, setAllQuestionPageLoader] = useState(false);
  const [width, height] = useViewport();
  const breakpoint = 900;
  const [overBreakpoint, setOverBreakPoint] = useState(width > breakpoint);

  ////////////////////////////////
  /// Functionality
  ////////////////////////////////
  const openLoaderThenLaunch = (actionToLaunch, params) => {
    setAllQuestionPageLoader(true);
    setTimeout(() => {
      navigate(actionToLaunch, params);
      setAllQuestionPageLoader(false);
    }, 300);
  };

  ////////////////////////////////
  /// Handlers
  ////////////////////////////////
  const studyTopicsPageButtonHandler = (e) => {
    e.preventDefault();
    const targetID = e.target.value;
    if (targetID === "-FULL-PAGE-") {
      openLoaderThenLaunch(`../study-topics-tool`);
    } else {
      openLoaderThenLaunch(`../study-topics-tool/${targetID}`, {
        state: { _id: targetID },
      });
    }
  };

  const studyTopicIDSubmitHandler = (e) => {
    e.preventDefault();

    let questionIdentifier = Object.keys(allQuestions).filter(
      (questionID) =>
        allQuestions[questionID]._id == studyTopicIdentifierElm.current.value
    );
    questionIdentifier = questionIdentifier.toString();

    if (questionIdentifier.length <= 0) {
      setInputError(
        "That question ID does not appear in the master list. Please make sure to copy and paste the full ID."
      );
    } else {
      const IdAddedToStorage = studyTopicAddToStorage({ questionIdentifier });
      if (!IdAddedToStorage.status) setInputError(IdAddedToStorage.message);
    }
  };

  const clearListButtonHandler = (e) => {
    const confirm = window.confirm(
      "Are you sure you want to delete all study topics? This can not be undone."
    );
    if (confirm) {
      const newStudyNotes = { ...studyNotes };
      newStudyNotes.studyTopicsIDs = [];
      dispatch(catalogDataActions.clearStudyTopicsIDs());
      if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
      if (!user)
        storage("ADD", { studyNotes: newStudyNotes, ...otherQuestionData });
    }
  };

  function studyTopicDeleteButtonHandler(e) {
    const targetID = e.target.value;
    const newStudyNotes = { ...studyNotes };
    newStudyNotes.studyTopicsIDs = newStudyNotes.studyTopicsIDs.filter(
      (id) => id != targetID
    );
    const confirm = window.confirm(
      "Are you sure you want to remove this item from your study topics list?"
    );
    if (confirm) {
      dispatch(catalogDataActions.updateStudyNotes(newStudyNotes));
      if (user) updateStudyNotes({ user, dataObj: newStudyNotes });
      if (!user)
        storage("ADD", { studyNotes: newStudyNotes, ...otherQuestionData });
    }
  }

  ////////////////////////////////
  /// Effects
  ////////////////////////////////
  useEffect(() => {
    setOverBreakPoint(width > breakpoint);
  }, [width]);

  useEffect(() => {
    if (inputError) alert(inputError);
    setInputError(false);
  }, [inputError]);

  ////////////////////////////////
  /// Output
  ////////////////////////////////
  return (
    <div className={styles["study-notes-container"]}>
      <h2 className={"section-title " + styles["title"]}>Study Plan & Notes</h2>
      <div className={styles["study-topics-container"]}>
        <form className={styles["form"]} onSubmit={studyTopicIDSubmitHandler}>
          <h3 className={styles["title"]}>Question Topics to Study</h3>
          <div className={styles["list-full-launch"]}>
            <PushButton
              inputOrButton="button"
              id="study-topics-launch"
              colorType="primary"
              value="-FULL-PAGE-"
              href="./study-topics-tool"
              size="small"
              onClick={studyTopicsPageButtonHandler}
            >
              Launch Study Topics
              <span className={styles["right-arrow"]}>&#x2192;</span>
            </PushButton>
            <Link
              to="/study-topics-tool/"
              target="_blank"
              state={{ user: user }}
            >
              Pop Out Study Topics
              <span className={styles["up-arrow"]}>&#x2192;</span>
            </Link>
          </div>
          <p>
            If further study is needed on a specific question, use the "Add to
            Study List" button found with each answer in the Answer area and in
            the Session Results area. In additoin, you can copy and paste the
            question ID below and click to add it to the list.
          </p>
          <div className={styles["study-topics-input-container"]}>
            <input
              key={Math.random()}
              name="Question-ID"
              ref={studyTopicIdentifierElm}
              placeholder="Paste a question ID here..."
              type="text"
            />
            <PushButton
              inputOrButton="input"
              type="submit"
              id="study-topic-add-button"
              colorType="primary"
              value="Add the Question ID"
              size="medium"
              styles={{ margin: "0" }}
            />
          </div>
        </form>
        {studyNotes &&
          studyNotes.hasOwnProperty("studyTopicsIDs") &&
          studyNotes.studyTopicsIDs &&
          studyNotes.studyTopicsIDs.length > 0 && (
            <div className={styles["study-list-container"]}>
              <ul className={styles["study-list"]}>
                {studyNotes.studyTopicsIDs.map((identifier) => {
                  let output;
                  if (allQuestions.hasOwnProperty(identifier))
                    output = (
                      <li
                        key={"li" + identifier}
                        className={styles["study-list-item"]}
                      >
                        <div className={styles["list-item-launch"]} href="">
                          <PushButton
                            inputOrButton="button"
                            id="study-topics-tool-link"
                            colorType="primary"
                            value={identifier}
                            href="./study-topics-tool"
                            size="small"
                            onClick={studyTopicsPageButtonHandler}
                          >
                            {overBreakpoint && <Fragment>Open Topic </Fragment>}
                            <span className={styles["right-arrow"]}>
                              &#x2192;
                            </span>
                          </PushButton>
                        </div>
                        <div
                          className={
                            styles["study-list-item-inner-wrap"] +
                            " " +
                            styles["study-list-item-topic-title"]
                          }
                        >
                          <h4>{allQuestions[identifier].title}</h4>
                        </div>
                        <div
                          className={
                            styles["study-list-item-inner-wrap"] +
                            " " +
                            styles["study-list-item-support"]
                          }
                        >
                          <p>{allQuestions[identifier].topic}</p>

                          <div
                            className={
                              styles["topic-button-wrap"] +
                              " " +
                              styles["button-wrap"]
                            }
                            href=""
                          >
                            <div className={styles["list-item-delete"]}>
                              <PushButton
                                inputOrButton="button"
                                id="study-topic-delete-button"
                                colorType="secondary"
                                value={identifier}
                                size="small"
                                onClick={studyTopicDeleteButtonHandler}
                              >
                                X
                              </PushButton>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  return output;
                })}
              </ul>
              <div className={styles["list-item-clear-list"]}>
                <PushButton
                  inputOrButton="button"
                  id="study-topic-delete-button"
                  colorType="secondary"
                  value=" Clear Study Topics List"
                  size="small"
                  onClick={clearListButtonHandler}
                >
                  Clear Study List
                </PushButton>
              </div>
            </div>
          )}
      </div>
      {showAllQuestionPageLoader && (
        <div className={styles["loader-wrap"]}>
          <BarLoader />
        </div>
      )}
      <NotePad openLoaderThenLaunch={openLoaderThenLaunch} maxHeight="50em" />
    </div>
  );
};

export default StudyNotes;
