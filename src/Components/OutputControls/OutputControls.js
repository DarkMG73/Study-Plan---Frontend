import styles from "./OutputControls.module.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import useExportData, { formatAnObject } from "../../Hooks/useExportData";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import { deleteAllStudyTopics } from "../../storage/studyPlanDB";
// import CSVReader from "./CSVReader/CSVReader";
import useCreateNewForm from "../../Hooks/useCreateNewForm";

function OutputControls(props) {
  let navigate = useNavigate();
  const exportData = useExportData({ type: "" });
  const [showAllStudyPlanItemPageLoader, setAllStudyPlanItemPageLoader] =
    useState(false);
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData
  );
  const user = useSelector((state) => state.auth.user);
  const [fileUploadArray, setFileUploadArray] = useState(false);
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

  //////////////////////
  /// FUNCTIONS
  /////////////////////
  const readFileOnUpload = (uploadedFile) => {
    const fileReader = new FileReader();
    let output = false;
    fileReader.onloadend = () => {
      try {
        output = JSON.parse(fileReader.result);
        setErrorData(null);
      } catch (e) {
        setErrorData("*** Unfortunately, this is not a valid JSON file. ***");
      }
    };
    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
    return output;
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
    const dataObj = readFileOnUpload(e.target.files[0]);
    if (!dataObj)
      alert(
        "Something went wrong trying to retrieve the data from teh JSON. Please check the data and try again."
      );

    if (user) {
      console.log();
    } else {
      alert(
        'Please log in to add to your study plan. If you do not yet have a profile, click "Sign Up" at the top of the page to get started.'
      );
    }
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

  return (
    <div id="output-controls" className={styles.outerwrap}>
      <h2 className="section-title">Controls & Output</h2>
      <h3 className={styles["section-title"]}>Database Output</h3>

      <div
        className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
      >
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
      <br />
      <br></br>
      <br></br>
      <h3 className={styles["section-title"]}>Study Plan Database</h3>
      <div
        className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
      >
        <input type="file" onChange={uploadJsonButtonHandler} />
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
