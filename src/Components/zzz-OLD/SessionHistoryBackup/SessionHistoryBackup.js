import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SessionHistoryBackup.module.css";
import storage from "../../storage/storage";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";
import { toTitleCase } from "../../Hooks/utility";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";

function Score() {
  const questionHistory = useSelector(
    (state) => state.studyPlanData.questionHistory
  );
  const user = useSelector((state) => state.auth.user);
  const currentUserID = user ? user.identifier : "local";
  const dispatch = useDispatch();
  const backupLimit = 10;
  const historyBackup = storage(
    "GET",
    false,
    "interview-questions-history-backup"
  );
  const [refresh, setRefresh] = useState(1);

  useEffect(() => {
    const data = addStats(questionHistory);
    const newHistoryBackup = { ...historyBackup };
    // const dateStamp = new Date();
    const dateStamp = new Date().toLocaleDateString().replaceAll("/", "-");
    if (!newHistoryBackup.hasOwnProperty(currentUserID)) {
      newHistoryBackup[currentUserID] = {};
    }

    // If the app session results are reset, preserve
    // data un an alternative backup history record.
    if (
      newHistoryBackup.hasOwnProperty(currentUserID) &&
      newHistoryBackup[currentUserID].hasOwnProperty(dateStamp) &&
      data.stats.totalCompleted <= 0
    ) {
      // Avoid creating alternate version on first render & non-change renders
      const dataHasChanged = Object.keys(data.stats).filter(
        (key) =>
          data.stats[key] !=
          newHistoryBackup[currentUserID][dateStamp].stats[key]
      );

      if (dataHasChanged.length > 0)
        newHistoryBackup[currentUserID]["*" + dateStamp] = {
          ...newHistoryBackup[currentUserID][dateStamp],
        };
    }
    newHistoryBackup[currentUserID][dateStamp] = data;
    newHistoryBackup[currentUserID] = enforceBackupLimit(
      newHistoryBackup[currentUserID],
      backupLimit
    );

    storage("ADD", newHistoryBackup, "interview-questions-history-backup");
  }, [questionHistory, refresh]);

  const addStats = (questionHistoryObject) => {
    const newQuestionHistoryObject = {
      questionHistory: { ...questionHistoryObject },
    };
    const { correct, incorrect, unmarked } = questionHistoryObject;
    const correctAmount = tallyItemsInObject(correct);
    const incorrectAmount = tallyItemsInObject(incorrect);
    const unmarkedAmount = tallyItemsInObject(unmarked);
    const totalCompleted = correctAmount + incorrectAmount + unmarkedAmount;
    newQuestionHistoryObject.stats = {
      correctAmount,
      incorrectAmount,
      unmarkedAmount,
      totalCompleted,
    };

    return newQuestionHistoryObject;
  };

  function tallyItemsInObject(obj) {
    let output = 0;
    for (const i in obj) {
      output++;
    }
    return output;
  }

  const resetHistoryBackupButtonHandler = (e) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete your question history backup? This will remove all restore points.\n\nClick "OK" to delete the session history backup or "Cancel" to return WITHOUT erasing the back history.'
    );

    if (shouldDelete) {
      storage("DELETE", {}, "interview-questions-history-backup");
      setRefresh(refresh + 1);
    }
  };

  const restoreBackupButtonHandler = (e) => {
    const dateStamp = e.target.value;
    const data = historyBackup[currentUserID][dateStamp];
    const confirm = window.confirm(
      "Restoring the backup from " +
        dateStamp +
        " will replace your current question history as well as todays backup. Both will be replaced by the backup from " +
        dateStamp +
        '.\n\nYou will not be able to undo this and, with todays backup being replaced, this will not be restorable. \n\nAre you sure you want to restore this history? Click "OK" to RESTORE and "Cancel" to return WITHOUT restoring.'
    );

    if (confirm) {
      dispatch(
        studyPlanDataActions.updateQuestionHistory(data.questionHistory)
      );
      dispatch(studyPlanDataActions.questionHistoryStorageNeedsUpdate(true));
    }
  };

  const enforceBackupLimit = (dataObj, backupLimit) => {
    const keysArray = Object.keys(dataObj).sort((a, b) => {
      return new Date(b) - new Date(a);
    });

    while (keysArray.length > backupLimit) {
      keysArray.pop();
    }

    const output = {};
    keysArray.forEach((key) => {
      output[key] = dataObj[key];
    });
    return output;
  };

  // Prep output data
  let outputJSX = false;
  if (historyBackup && historyBackup[currentUserID]) {
    outputJSX = [];
    Object.keys(historyBackup[currentUserID]).forEach((key) => {
      const entry = historyBackup[currentUserID][key];
      const rowJSX = [];
      for (const groupKey in entry) {
        const groupJSX = [];
        if (groupKey === "stats") {
          const innerJSX = [];

          for (const key in entry[groupKey]) {
            innerJSX.push(
              <li
                key={key}
                className={
                  styles["stat-inner-wrap"] + " " + styles["stat-" + key]
                }
              >
                <h3>{toTitleCase(key, true).replace("Amount", "")}: </h3>
                <p>{entry[groupKey][key]}</p>
              </li>
            );
          }
          groupJSX.push(
            <ul key={groupKey + key} className={styles["stat-container"]}>
              <ul>{innerJSX.map((item) => item)}</ul>
              <li className={styles["restore-backup-button-wrap"]}>
                <PushButton
                  label={false}
                  colorType="secondary"
                  size="small"
                  inputOrButton="button"
                  type="button"
                  name="reset-btn"
                  value={key}
                  onClick={restoreBackupButtonHandler}
                >
                  Restore &rarr;
                </PushButton>
              </li>
            </ul>
          );
        } else {
          groupJSX.push(
            <div key={key} className={styles["date-wrap"]}>
              <h3>{key}</h3>
            </div>
          );
        }

        rowJSX.push(
          <div
            key={"row-container" + groupKey + key}
            className={styles["row-container"]}
          >
            {groupJSX.map((item) => item)}
          </div>
        );
      }
      outputJSX.push(
        <li key={"outer-container" + key} className={styles["outer-container"]}>
          {rowJSX.map((item) => item)}
        </li>
      );
    });
  }

  return (
    <div id="spt-history-backup" className={styles["spt-history-backup"]}>
      <h1 className={styles["subtitle"] + " section-title"}>
        Session History Backup
      </h1>
      <div
        key={"results" + refresh}
        id={"results-controls"}
        className={styles["inner-wrap"]}
      >
        {user && (
          <p className={styles["user-logged-in"]}>
            The data below is for <span>{user.userName}.</span>
          </p>
        )}
        {!user && (
          <p className={styles["user-not-logged-in"]}>
            The data below is for{" "}
            <span>
              Local User <i>(not logged in).</i>
            </span>
          </p>
        )}
        <CollapsibleElm
          key={"colapse-elm" + questionHistory.stats.usedIds.length}
          id="backupHistory"
          inputOrButton="button"
          maxHeight="7.1em"
          styles={{ maxWidth: "100%" }}
          buttonStyles={{
            margin: "0 auto",
            letterSpacing: "0.25em",
            fontVariant: "small-caps",
            transform: "translateY(-10%)",
            minWidth: "5em",
            textAlign: "center",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            borderRadius: "0 0 50px 50px",
            height: "100%",
            padding: "1em 0",
            marginBottom: "1em",
            boxShadow:
              "inset 7px 7px 10px rgb(255 255 255 / 25%), inset 1px -1px 1px rgb(0 0 0 / 15%), 3px 4px 10px -7px black",
          }}
          colorType="primary"
          data=""
          size="small"
        >
          <ul key={"list"} className={styles["history-list"]}>
            {outputJSX ? (
              outputJSX.map((item) => item)
            ) : (
              <p>
                There are no history backup entries. These will populate as you
                answer questions.
              </p>
            )}
          </ul>{" "}
        </CollapsibleElm>
        <p className={styles["special-note"]}>
          <i>
            Note: An asterisk * denotes a special backup made when clearing the
            Session Results.
          </i>
        </p>
        <div className={styles["reset-history-button-wrap"]}>
          <PushButton
            label={false}
            colorType="secondary"
            size="small"
            InputOrButton="input"
            type="button"
            name="reset-btn"
            value="Reset Session History Backup"
            onClick={resetHistoryBackupButtonHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default Score;
