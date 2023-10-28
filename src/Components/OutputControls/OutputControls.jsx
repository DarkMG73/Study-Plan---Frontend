import styles from "./OutputControls.module.scss";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import useExportData, { formatAnObject } from "../../Hooks/useExportData";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import { deleteAllStudyTopics } from "../../storage/studyPlanDB";
// import CSVReader from "./CSVReader/CSVReader";
import useCreateNewForm from "../../Hooks/useCreateNewForm";
import StudyPlanItemsList from "../StudyPlanItems/StudyPlanItemsList/StudyPlanItemsList";
import displayConditions from "../../data/displayConditionsObj.js";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import { formInputDataActions } from "../../store/formInputDataSlice";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";

function OutputControls(props) {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const exportData = useExportData({ type: "" });
  const [showAllStudyPlanItemPageLoader, setAllStudyPlanItemPageLoader] =
    useState(false);
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData
  );
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema
  );
  const user = useSelector((state) => state.auth.user);
  const [fileUploadArray, setFileUploadArray] = useState(false);
  const [uploadedJSONData, setUploadedJSONData] = useState(false);
  const [uploadedJSONJSX, setUploadedJSONJSX] = useState(false);
  const [errorData, setErrorData] = useState(false);
  const createNewForm = useCreateNewForm();
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
    console.log(
      "%c⚪️►►►► %cline:60%cerrorData",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
      errorData
    );
  }, [errorData]);

  useEffect(() => {
    if (uploadedJSONData) {
      console.log(
        "%c⚪️►►►► %cline:83%cuploadedJSONData",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
        uploadedJSONData
      );

      if (user) {
        console.log("SUCCESS! dataObj: ", uploadedJSONData);

        const outputJSX = (
          <StudyPlanItemsList
            key={"uploaded-json-list"}
            studyPlanItemsObj={uploadedJSONData}
            allStudyPlanItems={uploadedJSONData}
            parentKey={false}
            parentsParentKey={false}
            parentMasterID={false}
            displayConditions={displayConditions.jsonUpload}
            user={props.user}
            section={"uploadedJSON"}
            type={"uploadedJSON"}
            onlyList={true}
            noEditButton={props.noEditButton}
          />
        );
        setUploadedJSONJSX(outputJSX);
      } else {
        alert(
          'Please log in to add to your study plan. If you do not yet have a profile, click "Sign Up" at the top of the page to get started.'
        );
      }
    }
  }, [uploadedJSONData]);

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

  //////////////////////
  /// HANDLERS
  /////////////////////
  function exportCSVButtonHandler() {
    if (Object.keys(!studyPlan).length <= 0) {
      alert(
        "There does not appear to be a study plan to export. Either log in with a user account that has a study plan, or sign up to get started."
      );
    } else {
      exportData({ type: "cvs" });
    }
  }

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
  function listOfAllStudyPlanItemsButtonHandler() {
    setAllStudyPlanItemPageLoader(true);
    setTimeout(() => navigate("../study_plan_list", { replace: false }), 200);
  }

  function uploadJsonButtonHandler(e) {
    readFileOnUpload(e.target.files[0]);
  }

  function resetDatabaseButtonHandler() {
    const confirmation = window.confirm(
      "Are you sure you want to erase all of the items from your study plan? This can not be undone. It might be a good idea to backup your data using the CSV export. This will enable you to add everything back easily, if you need.",
      'Should we continue permanent erasing all items from your study plan? Clicking "Confirm" erases the study plan and clicking "Cancel" will not erase the study plan.'
    );
    if (confirmation)
      deleteAllStudyTopics(user)
        .then((res) => {
          if (res.status < 299) {
            window.location.reload();
          } else {
            console.log(
              "%c --> %cline:29%cThere was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: ",
              res.response.data
            );

            alert(
              "There was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: " +
                res.response.data.message
            );
          }
        })
        .catch((err) => {
          console.log(
            "%c --> %cline:47%cerr",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px",
            err
          );
          alert(
            "There was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: " +
              err.response.status +
              " | " +
              err.response.data
          );
        });
  }

  const submitFormButtonHandler = (e) => {
    e.preventDefault();

    const newUploadedJSONData = { ...uploadedJSONData };
    const _id = newUploadedJSONData._id;

    const groomedUploadedData = {};
    for (const [key, value] of Object.entries(newUploadedJSONData)) {
      groomedUploadedData[key] = {};

      for (const catName in studyPlanItemSchema) {
        if (["_id", "createdAt"].includes(catName)) continue;
        groomedUploadedData[key][catName] = Object.hasOwn(
          newUploadedJSONData[key],
          catName
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
        })
      );

      // dispatch(
      //   studyPlanDataActions.updateStudyPlanDB({
      //     itemWithNewEdits: newUploadedJSONData,
      //     user,
      //   })
      // );
      // updateAStudyPlanItem(dataObj, user);
    } else {
      alert("You must be logged in to be able to make changes.");
    }
  };

  return (
    <div id="output-controls" className={styles.outerwrap}>
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
      <br />
      <br></br>
      <br></br>

      <div
        className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
      >
        <h3 className={styles["section-title"]}>Study Plan Database</h3>
        <input
          className={styles["upload-json-input"]}
          type="file"
          onChange={uploadJsonButtonHandler}
        />
        {errorData && <p>{errorData}</p>}
        <PushButton
          inputOrButton="button"
          id="export-cvs-btn"
          colorType="secondary"
          value="session-record"
          data-value="export-cvs"
          size="medium"
          onClick={resetDatabaseButtonHandler}
        >
          Upload Study Plan JSON
        </PushButton>
      </div>

      <div
        className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
      >
        <PushButton
          inputOrButton="button"
          id="export-cvs-btn"
          colorType="secondary"
          value="session-record"
          data-value="export-cvs"
          size="medium"
          onClick={resetDatabaseButtonHandler}
        >
          Clear the Database (Reset)
        </PushButton>
        <br />
        <br></br>
        <br></br>
      </div>

      {uploadedJSONJSX && (
        <CardSecondary>
          <div className={styles["uploaded-json-container"]}>
            <CollapsibleElm
              id={"uploaded-json-collapsible-elm"}
              styles={{
                position: "relative",
              }}
              maxHeight={"10em"}
              s
              inputOrButton="button"
              buttonStyles={{
                margin: "auto",
                width: "98%",
                maxWidth: "100%",
                display: "flex",
                alignItems: "center",
                position: "relative",
                flexGrow: "1",
                minWidth: "min-content",
                height: "100%",
                maxHeight: "4em",
                textAlign: "center",
                transformOrigin: "center",
              }}
              colorType="secondary"
              data=""
              size="medium"
              buttonTextOpened={"Close Uploaded Items"}
              buttonTextClosed={"Open Uploaded Items"}
              open={false}
            >
              <ul className={styles["uploaded-json-wrap"]}>
                {uploadedJSONJSX}
              </ul>
              <PushButton
                inputOrButton="button"
                id="import-json-submit-btn"
                colorType="primary"
                value="uploadedJSON"
                data-value="uploadedJSON"
                size="large"
                onClick={submitFormButtonHandler}
              >
                Submit All New Items
              </PushButton>
              <br />
              <br />
              <br />
            </CollapsibleElm>{" "}
          </div>
        </CardSecondary>
      )}
    </div>
  );
}

function processExportCVS(props) {
  const { user, studyPlan, filter, cvsItemOrder, exportData } = props;
  const userName = user ? user.userName : "No one is logged in";
  const numberOfGoals = Object.values(studyPlan).filter(
    (value) => value.type === "goal"
  ).length;
  const numberOfSteps = Object.values(studyPlan).filter(
    (value) => value.type === "step"
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
