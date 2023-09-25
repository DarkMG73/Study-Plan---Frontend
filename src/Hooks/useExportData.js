import { useSelector } from "react-redux";

const useExportData = (props) => {
  const { allQuestions, questionHistory, filteredQuestionsIds } = useSelector(
    (state) => state.catalogData
  );
  if (!filteredQuestionsIds) return null;
  const totalQuestions = filteredQuestionsIds.length;
  const { correct, incorrect, unmarked } = questionHistory;
  const correctAmount = tallyItemsInObject(correct);
  const incorrectAmount = tallyItemsInObject(incorrect);
  const unmarkedAmount = tallyItemsInObject(unmarked);
  const totalCompleted = correctAmount + incorrectAmount + unmarkedAmount;
  const score =
    ((correctAmount / totalCompleted) * 100).toFixed(1) + "% Correct";
  function tallyItemsInObject(obj) {
    let output = 0;
    for (const i in obj) {
      output++;
    }
    return output;
  }

  const generateExport = function (props) {
    if (props.type === "json") {
      if (props.exportAll) {
        exportAllQuestionsJSON(allQuestions);
      } else {
        exportSessionHistoryJSON(questionHistory, score, totalQuestions);
      }
    } else {
      const headers = props.headers
        ? props.headers
        : {
            score: score,
            totalQuestions:
              totalCompleted + " answered of " + totalQuestions + "questions.",
            level: "Level",
            topic: "Topic",
            title: "Question",
            question: "Question Detail".replace(/,/g, ""), // remove commas to avoid errors
            answer: "Answer",
            time: "Time",
          };

      const dataObj = props.dataObj
        ? props.dataObj
        : questionHistory["incorrect"];

      const itemsReadyForCVS = props.exportStudyNotePad
        ? studyNotePadFormatAnObject(dataObj)
        : formatAnObject(dataObj);

      const fileName = prompt(
        "Would you like to name the file?\nClicking CANCEL will save the files with a stock name\n"
      );
      let exportFileName = fileName || "interview_questions_list.json";
      exportCSVFile(headers, itemsReadyForCVS, exportFileName); // call the exportCSVFile() function to process the JSON and trigger the download
    }
  };

  return generateExport;
};

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

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

const exportSessionHistoryJSON = function (
  questionHistory,
  score,
  totalQuestions
) {
  const fileName = prompt("What would you like to name the file?");
  const newQuestRecord = {
    ...questionHistory,
  };
  newQuestRecord.stats = {
    score: score,
    totalQuestions: totalQuestions,
  };
  let dataStr = JSON.stringify(newQuestRecord);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileName = fileName || "interview_questions_list.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileName);
  linkElement.click();
};

const exportAllQuestionsJSON = function (questionSet) {
  const newQuestRecord = {
    ...questionSet,
  };
  const fileName = prompt("What would you like to name the file?");
  let dataStr = JSON.stringify(newQuestRecord);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileName = fileName || "interview_questions_list.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileName);
  linkElement.click();
};

// format the data
function formatAnObject(obj) {
  var itemsFormatted = [];
  let count = 1;
  for (const key in obj) {
    const item = obj[key];
    itemsFormatted.push({
      score: count,
      totalQuestions: key,
      level: JSON.stringify(item.level || "-"),
      topic: JSON.stringify(item.topic || "-"),
      title: JSON.stringify(item.title) || "-",
      question: JSON.stringify(item.question.replace(/,/g, "") || "-"), // remove commas to avoid errors,
      answer: JSON.stringify(item.answer.replace(/,/g, "")) || "-",
      time: JSON.stringify(item.time),
    });
    count++;
  }

  return itemsFormatted;
}

function studyNotePadFormatAnObject(obj) {
  var output = [
    {
      score: "|",
      Notes: JSON.stringify(
        obj || "*** Nothing is written in your notepad ***"
      ).replace(/\n/g, "~"),
    },
  ];
  let newDataObj = JSON.stringify(obj.studyNotePadText);
  newDataObj = newDataObj.replace(/\\n/g, "~");
  newDataObj = JSON.parse(newDataObj);
  const studyNotesSeparatedAtLineBreaks = [];
  let cntr = 0;
  for (const letter of newDataObj) {
    if (studyNotesSeparatedAtLineBreaks.length <= 0) {
      studyNotesSeparatedAtLineBreaks[cntr] = letter;
    } else if (letter === "~") {
      cntr++;
      studyNotesSeparatedAtLineBreaks[cntr] = "";
    } else {
      studyNotesSeparatedAtLineBreaks[cntr] =
        studyNotesSeparatedAtLineBreaks[cntr] + letter;
    }
  }

  const itemsFormatted = [];
  let count = 1;
  for (const value of studyNotesSeparatedAtLineBreaks) {
    itemsFormatted.push({
      row: value,
    });
    count++;
  }

  return itemsFormatted;
}
export default useExportData;
