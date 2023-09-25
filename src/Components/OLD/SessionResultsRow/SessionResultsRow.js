import styles from "./SessionResultsRow.module.css";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { isValidHttpUrl } from "../../Hooks/utility";
import Card from "../../UI/Cards/Card/Card";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import {
  updateACatalogItem,
  deleteDocFromDb,
} from "../../storage/interviewQuestionsDB";
import useStudyTopicIdAddToStorage from "../../Hooks/useStudyTopicIdAddToStorage";

import { catalogDataActions } from "../../store/catalogDataSlice";
import { updateUserHistory } from "../../storage/userDB";
import storage from "../../storage/storage";
import SessionRowNotes from "./SessionRowNotes/SessionRowNotes";

function SessionResultsRow(props) {
  const dispatch = useDispatch();
  const [inEditMode, setInEditMode] = useState(false);
  const [
    showQuestionPersonalNotepad,
    setShowQuestionPersonalNotepad,
  ] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const editedQuestions = useRef({ edits: {} });
  const { allQuestions, currentFilters, ...otherQuestionData } = useSelector(
    (state) => state.catalogData
  );
  const refToScrollTo = useRef();
  const studyTopicAddToStorage = useStudyTopicIdAddToStorage();
  const shouldBeOpen = inEditMode ? inEditMode : props.open;
  const questionHistory = props.questionHistory;
  const key = props.keyTwo;
  const k = props.keyOne;
  // editButtonDirection to be used with future edit mode visual manipulations
  const editButtonDirection = inEditMode ? "" : "";
  const editButtonWidth = inEditMode ? "max-content" : "5em";
  const user = useSelector((state) => state.auth.user);
  const overBreakpoint = props.overBreakpoint;
  const allowedFields = [
    "_id",
    "question",
    "answer",
    "level",
    "topic",
    "title",
    "credit",
    "link",
    "search",
    "identifier",
    "createdAt",
    "updatedAt",
    "tags",
  ];
  ///////////////////////////////
  ///      Handlers
  //////////////////////////////
  const rowEditButtonHandler = (e, setElmOpen) => {
    setInEditMode(!inEditMode);
  };

  const onClickCallbackHandler = () => {
    setParentOpen(!parentOpen);
  };

  const rowRemoveButtonHandler = (e) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to remove this question from your question history? If you do, this will remove it from your Session results list and put it back in the unused questions. This will not affect the question database."
    );

    if (shouldDelete) {
      const newQuestionHistory = { ...questionHistory };
      for (const groupKey in newQuestionHistory) {
        newQuestionHistory[groupKey] = {
          ...newQuestionHistory[groupKey],
        };
        if (groupKey === "stats") {
          newQuestionHistory[groupKey].usedIds = newQuestionHistory[
            groupKey
          ].usedIds.filter((usedId) => usedId !== key);
        } else {
          delete newQuestionHistory[groupKey][key];
        }
      }
      dispatch(catalogDataActions.updateQuestionHistory(newQuestionHistory));
      dispatch(catalogDataActions.questionHistoryStorageNeedsUpdate(true));
    }
  };

  const rowSaveButtonHandler = (e) => {
    // Use tempKey instead of key when in dev
    // const tempKey = "TESTTEST";
    // updateACatalogItem(key, editedQuestions.current.edits[key], user);

    const newEdits = { ...editedQuestions.current.edits[key] };
    if (newEdits.hasOwnProperty("tags")) {
      newEdits.tags = newEdits.tags.split(",");
      newEdits.tags = newEdits.tags.map((tag) =>
        tag.trim().replaceAll(" ", "_")
      );
    }
    if (user && user.isAdmin == true) {
      updateACatalogItem(
        questionHistory[k][key].identifier,
        newEdits,
        user
      ).then((res) => {
        const status = res.status ? res.status : res.response.status;
        if (status >= 400) {
          alert("There was an error: " + res.response.data.message);
        } else if (status >= 200) {
          alert("Success! The item has been updated.");
          setInEditMode(false);
        } else {
          alert("there was an error: " + +res.message);
        }
      });
    } else {
      const sendEmail = window.confirm(
        'Thank you for contributing. All contributions must be reviewed before becoming public. Click "OK" to send this via email for review and, if approved, to be included. Click "Cancel" to cancel this and not send an email.'
      );
      if (sendEmail) {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject =
          "A Question Edit Request for the Interview Questions Tool";
        const body = `A question edit is being recommended: ${JSON.stringify(
          editedQuestions.current.edits
        )}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${encodeURIComponent(
            body
          )}`
        );
      }
    }
  };

  const deleteQuestionButtonHandler = (e) => {
    // Use tempKey instead of key when in dev
    // const tempKey = "TESTTEST";

    if (user && user.isAdmin == true) {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this question (ID: " + key + ")"
      );
      if (shouldDelete) {
        // Remove from question history
        const newQuestionHistory = {};

        Object.keys(questionHistory).forEach((categoryKey) => {
          newQuestionHistory[categoryKey] = { ...questionHistory[categoryKey] };
        });

        delete newQuestionHistory[k][key];

        updateUserHistory({
          user,
          dataObj: newQuestionHistory,
          currentFiltersObj: currentFilters,
        });

        // remove fro the DB
        deleteDocFromDb(questionHistory[k][key].identifier, user);
        setDeleted(true);
      }
    } else {
      const sendEmail = window.confirm(
        'Thank you for your suggestion to remove this question. All contributions must be reviewed before becoming public. Click "OK" to send this via email for review and, if approved, to be deleted. Click "Cancel" to cancel this and not send an email.'
      );
      if (sendEmail) {
        // Remove from question history
        const newQuestionHistory = {};
        Object.keys(questionHistory).forEach((categoryKey) => {
          newQuestionHistory[categoryKey] = { ...questionHistory[categoryKey] };
        });
        delete newQuestionHistory[k][key];
        storage("ADD", {
          questionHistory,
          currentFilters,
          ...otherQuestionData,
        });

        // Send delete request
        const questionAdminEmail = "general@glassinteractive.com";
        const subject =
          "A Recommendation to Remove a Question from the Interview Questions Tool";
        const body = `It is recommended that this question be removed: ${JSON.stringify(
          key
        )}\n\n\n\n\nUse the space below to briefly describe why this question should be removed.`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}&body=${encodeURIComponent(
            body
          )}`
        );
      }
    }
  };

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
      const IdAddedToStorage = studyTopicAddToStorage({ questionIdentifier })
        .then((res) => {
          if (res.message) {
            alert(res.message);
          }
        })
        .catch((err) => {
          alert(
            "There was an error trying to add this ID. Please try again and contact the site admin if the problem continues."
          );
        });
    }
  };

  const showQuestPersNotepadButtonHandler = () => {
    setShowQuestionPersonalNotepad(!showQuestionPersonalNotepad);
  };

  ///////////////////////////////
  ///      Functionality
  //////////////////////////////
  function AssembleInnerRow(questionHistory, k, key, elmOpen, setElmOpen) {
    let rowHTML = [];

    function onTextChangeHandler(e, key, itemKey) {
      if (!editedQuestions.current.edits.hasOwnProperty(key))
        editedQuestions.current.edits[key] = {};

      editedQuestions.current.edits[key][itemKey] = e.target.innerText;
    }

    for (const itemKey in questionHistory[k][key]) {
      let value = allQuestions[key]
        ? allQuestions[key][itemKey]
        : questionHistory[k][key][itemKey];
      let itemTitle = itemKey;

      // Skip if not allowed
      if (!allowedFields.includes(itemTitle)) continue;
      // Skip if not allowed or no value and not editing
      if (!inEditMode && (value == undefined || value === "" || value === " "))
        continue;

      // If link, add <a> tag
      const isValidLink = isValidHttpUrl(value);
      if (isValidLink && !inEditMode) {
        value = (
          <a href={value} alt={itemKey} target="_blank">
            {itemKey} &rarr;
          </a>
        );
      }

      if (itemKey === "tags") {
        value = value.join(", ").replaceAll("_", " ");
      }

      if (itemKey === "search") {
        if (!inEditMode) {
          value = (
            <a
              className={styles["more-about-this-link"]}
              href={`https://search.brave.com/search?q=${value}&source=web`}
              target="_blank"
            >
              Learn more about this with a Brave Search &rarr;
            </a>
          );
        }
      }

      if (itemKey === "createdAt" || itemKey === "updatedAt") {
        value = new Date(value).toLocaleString();
      }

      // Wrap the Answer to handle code-based answers
      if (itemKey === "answer" || itemKey === "question") {
        value = (
          <Fragment>
            {!inEditMode && (
              <CollapsibleElm
                id={key + "-" + itemKey + "-see-more-btn"}
                maxHeight="7em"
                inputOrButton="button"
                buttonStyles={{
                  margin: "0 auto",
                  letterSpacing: "0.25em",
                  fontVariant: "small-caps",
                  transform: "translateY(100%)",
                  minWidth: "5em",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                }}
                colorType="primary"
                data=""
                size="small"
                open={props.open}
              >
                <pre>
                  <code contentEditable={inEditMode}>{value}</code>
                </pre>
              </CollapsibleElm>
            )}
            {inEditMode && (
              <pre>
                <code contentEditable={inEditMode}>{value}</code>
              </pre>
            )}
          </Fragment>
        );
      }

      // Change "question" as the title
      if (itemKey === "question") {
        itemTitle = "Details";
      }

      // Create the row
      if (
        itemKey === "identifier" ||
        itemKey === "createdAt" ||
        itemKey === "updatedAt" ||
        itemKey === "_id"
      ) {
        if (inEditMode) {
          rowHTML.push(
            <div
              key={key + "-" + itemKey}
              id={key + "-" + itemKey}
              className={styles[itemKey] + " " + styles["grid-item"]}
            >
              <div
                className={`${styles[itemKey]} ${styles[itemKey + "-title"]}
               ${styles["grid-item-title"]} 
               ${styles["grid-item-child"]}`}
              >
                {itemTitle}
              </div>

              {itemTitle !== "identifier" ? (
                <div
                  className={`${styles[itemKey]} ${styles[itemKey + "-text"]}
${styles["grid-item-text"]} 
${styles["grid-item-child"]}`}
                  ref={(elm) => {
                    //  Moving this out of processing to handle after elements added.
                    setTimeout(() => {
                      if (editedQuestions.current.edits[itemKey])
                        editedQuestions.current.edits[itemKey] = elm.innerText;
                    }, 0);
                  }}
                  onBlur={(e) => {
                    onTextChangeHandler(e, key, itemKey);
                  }}
                >
                  {value}
                </div>
              ) : (
                <div
                  className={`${styles[itemKey]} ${styles[itemKey + "-text"]}
            ${styles["grid-item-text"]} 
            ${styles["grid-item-child"]}`}
                  contentEditable={inEditMode}
                  ref={(elm) => {
                    //  Moving this out of processing to handle after elements added.
                    setTimeout(() => {
                      if (editedQuestions.current.edits[itemKey])
                        editedQuestions.current.edits[itemKey] = elm.innerText;
                    }, 0);
                  }}
                  onBlur={(e) => {
                    onTextChangeHandler(e, key, itemKey);
                  }}
                >
                  {value}
                </div>
              )}
            </div>
          );
        }
      } else {
        rowHTML.push(
          <div
            key={key + "-" + itemKey}
            id={key + "-" + itemKey}
            className={styles[itemKey] + " " + styles["grid-item"]}
          >
            <div
              className={`${styles[itemKey]} ${styles[itemKey + "-title"]}
               ${styles["grid-item-title"]} 
               ${styles["grid-item-child"]}`}
            >
              {itemTitle}
            </div>
            <div
              className={`${styles[itemKey]} ${styles[itemKey + "-text"]}
            ${styles["grid-item-text"]} 
            ${styles["grid-item-child"]}`}
              contentEditable={inEditMode}
              ref={(elm) => {
                //  Moving this out of processing to handle after elements added.
                setTimeout(() => {
                  if (editedQuestions.current.edits[itemKey])
                    editedQuestions.current.edits[itemKey] = elm.innerText;
                }, 0);
              }}
              onBlur={(e) => {
                onTextChangeHandler(e, key, itemKey);
              }}
            >
              {value}
            </div>
          </div>
        );
      }
    }

    return rowHTML;
  }

  // Add the edit button
  const output = (
    <div
      key={key}
      id={key}
      className={
        styles["question-result-container"] +
        " " +
        styles["parent-open-" + parentOpen]
      }
      ref={refToScrollTo}
    >
      <Card>
        <CollapsibleElm
          id={key + "-collapsible-elm"}
          styles={{
            position: "relative",
          }}
          maxHeight={overBreakpoint ? "4em" : "7em"}
          inputOrButton="button"
          buttonStyles={{
            margin: "0 auto",
            padding: "0.5em 2em",
            letterSpacing: "0.25em",
            fontVariant: "small-caps",
            transform: "translateY(100%)",
            transition: "0.7s all ease",
            minWidth: "5em",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            borderRadius: "50px 50px 0 0",
          }}
          colorType="primary"
          data=""
          size="small"
          open={shouldBeOpen}
          onClickCallback={onClickCallbackHandler}
        >
          {AssembleInnerRow(questionHistory, k, key)}
          <div className={styles["button-container"]}>
            {!props.hideStockRowButtons && (
              <Fragment>
                <PushButton
                  inputOrButton="button"
                  type="button"
                  id="study-topic-add-button"
                  colorType="primary"
                  value={questionHistory[k][key]._id}
                  size="medium"
                  styles={{
                    margin: "auto",
                    width: "max-content",
                    borderRadius: "50px",
                    boxShadow:
                      "3px 3px 7px -5px white inset, -3px -3px 7px -5px rgba(0, 0, 0, 0.5) inset",
                  }}
                  onClick={studyTopicIDSubmitHandler}
                >
                  Add to Study List
                </PushButton>
                <PushButton
                  inputOrButton="button"
                  styles={{
                    background: "transparent",
                    boxShadow: "none",
                    textTransformation: "uppercase",
                    transform: editButtonDirection,
                    minWidth: editButtonWidth,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    margin: "auto",
                    padding: "0.75em",
                  }}
                  id={key + "edit-button"}
                  colorType="secondary"
                  value="remove"
                  data=""
                  size="small"
                  onClick={rowRemoveButtonHandler}
                >
                  Remove from Results
                </PushButton>
                <PushButton
                  inputOrButton="button"
                  styles={{
                    background: "transparent",
                    boxShadow: "none",
                    letterSpacing: "0.25em",
                    fontVariant: "small-caps",
                    transform: editButtonDirection,
                    minWidth: editButtonWidth,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    margin: "auto",
                    padding: "0.75em",
                  }}
                  id={key + "edit-button"}
                  colorType="secondary"
                  value="edit"
                  data=""
                  size="small"
                  onClick={rowEditButtonHandler}
                >
                  {inEditMode ? "Cancel Edit" : "Edit"}
                </PushButton>{" "}
              </Fragment>
            )}

            {inEditMode && (
              <Fragment>
                <PushButton
                  inputOrButton="input"
                  styles={{
                    type: "submit",
                    gridArea: "edit",
                    boxShadow: "none",
                    letterSpacing: "0.25em",
                    fontVariant: "small-caps",
                    minWidth: "fit-content",
                    margin: "auto",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    fontSize: "110%",
                  }}
                  id={key + "submit-button"}
                  colorType="primary"
                  value="Save Changes"
                  data=""
                  size="small"
                  onClick={rowSaveButtonHandler}
                >
                  Save Changes
                </PushButton>
                <PushButton
                  inputOrButton="input"
                  styles={{
                    type: "submit",
                    gridArea: "edit",
                    boxShadow: "none",
                    letterSpacing: "0.25em",
                    fontVariant: "small-caps",
                    minWidth: "fit-content",
                    margin: "auto",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    fontSize: "80%",
                  }}
                  id={key + "delete-button"}
                  colorType="secondary"
                  value="Delete Question"
                  data=""
                  size="small"
                  onClick={deleteQuestionButtonHandler}
                >
                  Delete Question
                </PushButton>
              </Fragment>
            )}

            {props.customButtonJSKFunction &&
              props.customButtonJSKFunction(questionHistory[k][key].identifier)}
          </div>{" "}
          <div className={styles["notes-container"]}>
            <PushButton
              inputOrButton="button"
              styles={{
                letterSpacing: "0.25em",
                margin: "0 auto",
                width: "100%",
              }}
              id={key + "show-notepad"}
              colorType="primary"
              value="Show Notepad"
              data=""
              size="medium"
              onClick={showQuestPersNotepadButtonHandler}
            >
              {!showQuestionPersonalNotepad && (
                <span> &darr; Show Notepad &darr;</span>
              )}

              {showQuestionPersonalNotepad && (
                <span> &uarr; Hide Notepad &uarr;</span>
              )}
            </PushButton>
            {showQuestionPersonalNotepad && (
              <SessionRowNotes rowKey={questionHistory[k][key].identifier} />
            )}
          </div>
        </CollapsibleElm>
      </Card>
    </div>
  );

  if (!deleted) {
    return output;
  } else {
    return (
      <div className={styles.deleted}>
        <h3>This question was deleted (ID: {key})</h3>
      </div>
    );
  }
}

export default SessionResultsRow;
