import { useSelector } from "react-redux";

const useExportData = () => {
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData
  );
  if (!studyPlan || Object.keys(studyPlan).length <= 0) return null;
  const totalStudyPlanItems =
    Object.hasOwn(studyPlanMetadata, "_id") && studyPlanMetadata._id.length;
  const totalCompleted = studyPlanMetadata.markcomplete
    ? studyPlanMetadata.markcomplete
    : ["0"];
  const status = (totalCompleted.length / totalStudyPlanItems) * 100;
  const allSteps = {};
  for (const [key, value] of Object.entries(studyPlan)) {
    if (value.type === "step") allSteps[key] = value;
  }

  const generateExport = function (props) {
    ////////////////////////////////////////////////////////////////
    // Export to JSON
    ////////////////////////////////////////////////////////////////
    if (props.type === "json") {
      if (props.exportStepsOnly) {
        exportStepsOnlyJSON(allSteps, status, totalStudyPlanItems);
      } else {
        exportAllStudyPlanItemsJSON(studyPlan);
      }
    } else {
      ////////////////////////////////////////////////////////////////
      // Export to CVS
      ////////////////////////////////////////////////////////////////
      const headers = props.headers
        ? props.headers
        : {
            status: status + "% completed",
            totalStudyPlanItems: totalStudyPlanItems + "studyPlanItems.",
            totalLabTime: "Lab Time",
            totalLectureTime: "Lecture Time",
            name: "Study Plan",
            description: "StudyPlanItem Detail",
          };

      const dataObj = props.dataObj ? props.dataObj : studyPlan;

      const itemsReadyForCVS = formatAnObject(dataObj, headers);

      const fileName = prompt(
        "Would you like to name the file?\nClicking CANCEL will save the files with a stock name\n"
      );
      let exportFileName = fileName || "study_plan_items_list.json";
      exportCSVFile(headers, itemsReadyForCVS, exportFileName); // call the exportCSVFile() function to process the JSON and trigger the download
    }
  };

  return generateExport;
};

////////////////////////////////////////////////////////////////////////
/// Support Functions
////////////////////////////////////////////////////////////////////////
const exportAllStudyPlanItemsJSON = function (studyPlanItemSet) {
  const newStudyPlanItemsObj = {
    ...studyPlanItemSet,
  };
  const fileName = prompt(
    'What would you like to name the file?\n\nNote: Clicking "CANCEL" will save the file as the default name'
  );
  let dataStr = JSON.stringify(newStudyPlanItemsObj);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileName = fileName || "study_plan_item_list.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileName);
  linkElement.click();
};

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilename = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

const exportStepsOnlyJSON = function (
  studyPlanSteps,
  status,
  totalStudyPlanItems
) {
  const fileName = prompt("What would you like to name the file?");
  const newStudyPlanSteps = {
    ...studyPlanSteps,
  };
  newStudyPlanSteps.status = {
    status: status + "% completed.",
    totalStudyPlanItems: totalStudyPlanItems,
  };
  let dataStr = JSON.stringify(newStudyPlanSteps);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileName = fileName || "study_plan_items_list.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileName);
  linkElement.click();
};

// format the data
function formatAnObject(obj, headers) {
  var itemsFormatted = [];
  let count = 1;
  for (const key in obj) {
    const item = obj[key];
    const newObj = {
      number: count,
      name: headers && Object.hasOwn(headers, "name") ? headers.name : "name",
    };
    for (const [key, value] of Object.entries(item)) {
      // remove commas to avoid errors
      const newValue =
        value.constructor === String ? value.replace(/,/g, "") : value;
      newObj[key] = JSON.stringify(newValue || "-");
    }
    itemsFormatted.push(newObj);
    count++;
  }

  return itemsFormatted;
}

export default useExportData;
