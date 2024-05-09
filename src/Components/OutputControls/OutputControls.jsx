import styles from "./OutputControls.module.scss";
import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import useExportData from "../../Hooks/useExportData";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import { deleteAllStudyTopics } from "../../storage/studyPlanDB";
// import CSVReader from "./CSVReader/CSVReader";
import StudyPlanItemsList from "../StudyPlanItems/StudyPlanItemsList/StudyPlanItemsList";
import displayConditions from "../../data/displayConditionsObj.js";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
// import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import { formInputDataActions } from "../../store/formInputDataSlice";
import useDemoCheck from "../../Hooks/useDemoCheck";

function OutputControls(props) {
  const dispatch = useDispatch();
  const exportData = useExportData({ type: "" });
  const [showAllStudyPlanItemPageLoader] = useState(false);
  const { studyPlan } = useSelector((state) => state.studyPlanData);
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema,
  );
  const { uploadedForms } = useSelector((state) => state.formInputData);
  const user = useSelector((state) => state.auth.user);
  const [uploadedJSONData, setUploadedJSONData] = useState(false);
  const [uploadedJSONJSX, setUploadedJSONJSX] = useState(false);
  const [showUploadInputData, setShowUploadInputData] = useState(false);
  const [errorData, setErrorData] = useState(false);
  const demoCheck = useDemoCheck();
  const isDemo = demoCheck();
  const cvsItemOrder = [
    "name",
    "type",
    "priority",
    "markcomplete",
    "markforreview",
    "status",
    "lectureTime",
    "labTime",
    "method",
    "platform",
    "author",
    "des",
    "msup",
    "asup",
    "start",
    "acomp",
    "url",
    "tags",
    "itemnotes",
    "demonstratedskillsdesc",
    "demonstratedskillurl",
    "createdAt",
    "updatedAt",
    "progressbar",
    "id",
    "identifier",
    "masterLibraryID",
  ];

  //////////////////////
  /// EFFECTS
  /////////////////////

  useEffect(() => {
    if (uploadedJSONData) {
      if (user) {
        console.log("SUCCESS! dataObj: ", uploadedJSONData);
        const idArray = [];
        idArray.length = 200;
        const outputJSX = (
          <div className={styles["edited-list"]}>
            <StudyPlanItemsList
              key={"uploaded-json-list"}
              studyPlanItemsObj={uploadedJSONData}
              allStudyPlanItems={uploadedJSONData}
              parentKey={false}
              parentsParentKey={false}
              parentMasterID={false}
              displayConditions={displayConditions.formWithPreFilledData}
              user={props.user}
              section={"uploadedJSON"}
              type={false}
              onlyList={true}
              noEditButton={props.noEditButton}
            />
          </div>
        );
        setUploadedJSONJSX(outputJSX);
      } else {
        alert(
          'Please log in to add to your study plan. If you do not yet have a profile, click "Sign Up" at the top of the page to get started.',
        );
      }
    }
  }, [uploadedJSONData]);

  useEffect(() => {
    if (!uploadedForms) {
      setUploadedJSONJSX(false);
    }
  }, [uploadedForms]);

  //////////////////////
  /// FUNCTIONS
  /////////////////////
  const readFileOnUpload = (uploadedFile) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        setUploadedJSONData(JSON.parse(fileReader.result));
        setErrorData(null);
      } catch (e) {
        setErrorData("*** Unfortunately, this is not a valid JSON file. ***");
      }
    };

    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
  };

  function requiredFunction(msg, requiredText) {
    const answer = prompt(msg);
    let output = false;

    if (typeof answer === "string") {
      if (answer.trim() === requiredText.trim()) {
        output = true;
      } else {
        return requiredFunction(msg, requiredText);
      }
    }

    return output;
  }

  //////////////////////
  /// HANDLERS
  /////////////////////
  // function exportCSVButtonHandler() {
  //   if (Object.keys(!studyPlan).length <= 0) {
  //     alert(
  //       "There does not appear to be a study plan to export. Either log in with a user account that has a study plan, or sign up to get started."
  //     );
  //   } else {
  //     exportData({ type: "cvs" });
  //   }
  // }

  function exportAllToCSVButtonHandler() {
    processExportCVS({
      user,
      studyPlan,
      filter: false,
      cvsItemOrder,
      exportData,
    });
  }

  function exportStepsCSVButtonHandler() {
    processExportCVS({
      user,
      studyPlan,
      filter: { type: "step" },
      cvsItemOrder,
      exportData,
    });
  }

  function exportJSONButtonHandler() {
    exportData({ type: "json" });
  }
  function exportAllToJSONButtonHandler() {
    exportData({ type: "json", exportAll: true });
  }

  // function exportAllToJSONButtonHandler() {
  //   exportData({ type: "json", exportAll: true });
  // }

  // function listOfAllStudyPlanItemsButtonHandler() {
  //   setAllStudyPlanItemPageLoader(true);
  //   setTimeout(() => navigate("../study_plan_list", { replace: false }), 200);
  // }

  function uploadJsonButtonHandler(e) {
    if (isDemo) {
      alert(isDemo);
      return;
    }

    readFileOnUpload(e.target.files[0]);
    setShowUploadInputData(true);
  }

  function resetDatabaseButtonHandler() {
    if (isDemo) {
      alert(isDemo);
      return;
    }
    const confirmation = window.confirm(
      "Are you sure you want to erase all of the items from your study plan? This can not be undone. It might be a good idea to backup your data using the JSON export button (above). This will enable you to add everything back easily, if you need.",
      'Should we continue permanent erasing all items from your study plan? Clicking "Confirm" erases the study plan and clicking "Cancel" will not erase the study plan.',
    );
    if (confirmation) {
      const msg =
        'If you are sure you want to permanently delete all items in your study plan, type this exactly as it is (including both *) into the box below:\n\n*reset*\n\nNext click "OK" and everything will be deleted. If you click cancel here, nothing will be removed.';
      const requiredText = "*reset*";

      const prompt = requiredFunction(msg, requiredText);

      if (!prompt) return;
      if (prompt)
        deleteAllStudyTopics(user)
          .then((res) => {
            if (res.status < 299) {
              window.location.reload();
            } else {
              console.log(
                "%c --> %cline:29%cThere was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: ",
                res.response.data,
              );

              alert(
                "There was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: " +
                  res.response.data.message,
              );
            }
          })
          .catch((err) => {
            console.log(
              "%c --> %cline:47%cerr",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px",
              err,
            );
            alert(
              "There was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: " +
                err.response.status +
                " | " +
                err.response.data,
            );
          });
    }
  }

  const submitFormButtonHandler = (e) => {
    e.preventDefault();

    if (isDemo) {
      alert(isDemo);
      return;
    }

    const newUploadedJSONData = { ...uploadedJSONData };
    const _id = newUploadedJSONData._id;

    const groomedUploadedData = {};
    for (const [key] of Object.entries(newUploadedJSONData)) {
      groomedUploadedData[key] = {};

      for (const catName in studyPlanItemSchema) {
        if (["_id", "createdAt"].includes(catName)) continue;
        groomedUploadedData[key][catName] = Object.hasOwn(
          newUploadedJSONData[key],
          catName,
        )
          ? newUploadedJSONData[key][catName]
          : "";
      }
    }
    if (user) {
      dispatch(
        formInputDataActions.submitUploadedForm({
          _id: _id,
          item: newUploadedJSONData,
        }),
      );
    } else {
      alert("You must be logged in to be able to make changes.");
    }
  };

  return (
    <div id="output-controls" className={styles.outerwrap}>
      <a name="section-controls" className={styles['"section-anchor"']}></a>
      <h2 className="section-title">Controls & Output</h2>

      {studyPlan && Object.keys(studyPlan).length > 0 && (
        <div
          className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
        >
          {" "}
          <h3 className={styles["section-title"]}>Database Output</h3>
          {!props.hideExportAllToCSVButton && (
            <PushButton
              inputOrButton="button"
              id="export-cvs-btn"
              colorType="secondary"
              value="export-cvs"
              data-value="export-cvs"
              size="medium"
              onClick={exportAllToCSVButtonHandler}
            >
              Export Study Plan to Cvs
            </PushButton>
          )}
          {!props.hideExportStepsOnlyToCSV && (
            <PushButton
              inputOrButton="button"
              id="export-cvs-btn"
              colorType="secondary"
              value="export-cvs"
              data-value="export-cvs"
              size="medium"
              onClick={exportStepsCSVButtonHandler}
            >
              Export Only Steps to CSV
            </PushButton>
          )}
          {!props.hideExportStudyPlanToJSONButton && (
            <PushButton
              inputOrButton="button"
              id="export-json-btn"
              colorType="secondary"
              value="export-json"
              data-value="export-json"
              size="medium"
              onClick={exportJSONButtonHandler}
            >
              Export Study Plan to JSON
            </PushButton>
          )}
          {showAllStudyPlanItemPageLoader && (
            <div className={styles["loader-wrap"]}>
              <BarLoader />
            </div>
          )}
          {props.showExportAllStudyPlanItems && (
            <PushButton
              inputOrButton="button"
              id="all-quest-link"
              colorType="secondary"
              value="export-all-questions-json"
              href="./list-of-all-questions"
              data-value="link-all-quests-page"
              size="medium"
              onClick={exportAllToJSONButtonHandler}
            >
              Export All StudyPlanItems to JSON
            </PushButton>
          )}
        </div>
      )}

      <div
        className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} 
      ${styles["json-upload-wrap"]} 
      `}
      >
        <h3 className={styles["section-title"]}>Study Plan Database</h3>
        <input
          className={
            styles["upload-json-input"] +
            " " +
            styles["show-input-data-" + showUploadInputData]
          }
          type="file"
          onChange={uploadJsonButtonHandler}
        />
        {errorData && <p>{errorData}</p>}
        {uploadedJSONJSX && (
          <CardSecondary>
            <div
              className={
                styles["uploaded-json-container"] + " " + styles["edited-list"]
              }
            >
              <div className={styles["uploaded-json-message"]}>
                <h4>New Items for Upload</h4>
                <p>
                  Look over the data and make sure it is as you want. If changes
                  need to be made before saving to the database, make those
                  changes in the JSON file and re-upload the JSON file. All
                  other changes can be made in the Syllabus section after saving
                  to the database and refreshing the page.
                </p>
              </div>
              <PushButton
                inputOrButton="button"
                id="import-json-submit-btn"
                colorType="secondary"
                value="uploadedJSON"
                data-value="uploadedJSON"
                size="large"
                styles={{
                  background: "var(--spt-color-background-contrast)",
                  margin: "auto",
                  minWidth: "min-content",
                  font: "var(--spt--font-heading-2)",
                  fontVariant: "small-caps",
                  letterSpacing: "var(--spt-spacing-heading)",
                  position: "sticky",
                  top: "var(--spt-navbar-height)",
                  zIndex: "3",
                  width: "90%",
                }}
                onClick={submitFormButtonHandler}
              >
                Submit All New Items
              </PushButton>
              {uploadedJSONJSX}
            </div>
          </CardSecondary>
        )}
        {studyPlan && Object.keys(studyPlan).length > 0 && (
          <Fragment>
            <p>
              Use caution when clearing the database. This will permanently
              erase every goal, step ans item on hold. Consider exporting the
              database as a JSON (above) to save a backup. If you ever want to
              restore this version of your study plan, you can load the study
              plan JSON above.
            </p>
            <PushButton
              inputOrButton="button"
              id="export-cvs-btn"
              colorType="secondary"
              value="session-record"
              data-value="export-cvs"
              size="medium"
              onClick={resetDatabaseButtonHandler}
              styles={{ margin: "0 auto" }}
            >
              Clear the Database (Reset)
            </PushButton>
          </Fragment>
        )}
      </div>
    </div>
  );
}

function processExportCVS(props) {
  const { user, studyPlan, filter, cvsItemOrder, exportData } = props;
  const userName = user ? user.userName : "No one is logged in";
  const numberOfGoals = Object.values(studyPlan).filter(
    (value) => value.type === "goal",
  ).length;
  const numberOfSteps = Object.values(studyPlan).filter(
    (value) => value.type === "step",
  ).length;
  const headers = {
    number: userName,
    name: numberOfGoals + " Goals & " + numberOfSteps + " Steps.",
  };
  cvsItemOrder.forEach((title) => {
    if (title === "name") return;
    headers[title] = title;
  });

  const dataObj = {};
  Object.keys(studyPlan).forEach((key) => {
    /// Apply Filter
    const filterKey = filter ? Object.keys(filter)[0] : false;
    const filterValue = filter ? Object.values(filter)[0] : false;

    if (
      filterKey &&
      Object.hasOwn(studyPlan[key], filterKey) &&
      studyPlan[key][filterKey] !== filterValue
    )
      return;

    // Groom data
    dataObj[key] = {};
    cvsItemOrder.forEach((cat) => {
      if (!Object.hasOwn(studyPlan[key], cat)) {
        dataObj[key][cat] = "";
      } else if (studyPlan[key][cat].constructor === Boolean) {
        dataObj[key][cat] = studyPlan[key][cat] ? "true" : "false";
      } else {
        dataObj[key][cat] = studyPlan[key][cat];
      }
    });
  });

  exportData({
    type: "cvs",
    headers: headers,

    dataObj: dataObj,
  });
}
export default OutputControls;
