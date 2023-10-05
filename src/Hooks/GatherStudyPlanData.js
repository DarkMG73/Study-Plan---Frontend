import { studyPlanData as studyPlanDataFunction } from "../storage/studyPlanDB.js";

export default async function GatherStudyPlanData(user) {
  const studyPlanData = {};
  studyPlanData.studyPlan = {};

  const studyPlanFromDB = await studyPlanDataFunction();

  if (studyPlanFromDB.length <= 0) {
    throw new Error(
      "There appears to be a problem reaching the servers. Please try again or contact the site admin if the problem continues."
    );
  }
  studyPlanFromDB.forEach((studyPlanItem) => {
    studyPlanData.studyPlan[studyPlanItem._id] = studyPlanItem;
    // studyPlanData.studyPlan[studyPlanItem._id].sourceURLObj = JSON.parse(
    //   studyPlanData.studyPlan[studyPlanItem._id].sourceURLObj
    // );
  });

  const ungroomedStudyPlanMetadata = gatherAllMetadata(studyPlanData.studyPlan);
  console.log(
    "%c --> %cline:21%cungroomedStudyPlanMetadata",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
    ungroomedStudyPlanMetadata
  );
  const groomedStudyPlanMetadata = {};
  for (const key in ungroomedStudyPlanMetadata) {
    const output = [];
    if (key === "tags") {
      const itmOutput = [];

      ungroomedStudyPlanMetadata[key].forEach((itm) => {
        if (itm.constructor === String) {
          itmOutput.push(...itm.split(","));
        }

        if (itm.constructor === Array) {
          itmOutput.push(...itm);
        }
      });

      const flattenedArrays = new Set(itmOutput.map((value) => value.trim()));
      const flattenedArraysOutput = Array.from(flattenedArrays);
      console.log(
        "%c --> %cline:39%cflattenedArraysOutput",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
        flattenedArraysOutput
      );
      output.push(flattenedArraysOutput.length, flattenedArraysOutput);
    } else {
      output.push(ungroomedStudyPlanMetadata[key].length);
      output.push(...ungroomedStudyPlanMetadata[key]);
    }
    groomedStudyPlanMetadata[key] = [...output];
  }

  //Add available services array
  const rawAvailableServices = [];
  for (const itemID in studyPlanData.studyPlan) {
    if (studyPlanData.studyPlan[itemID].hasOwnProperty("sourceURLObj")) {
      rawAvailableServices.push(
        ...Object.keys(studyPlanData.studyPlan[itemID].sourceURLObj)
      );
    }

    if (
      studyPlanData.studyPlan[itemID].hasOwnProperty("type") &&
      studyPlanData.studyPlan[itemID].type === "service"
    ) {
      rawAvailableServices.push(studyPlanData.studyPlan[itemID].slug);
    }

    const availableServicesSet = new Set(rawAvailableServices);
    groomedStudyPlanMetadata.availableServices = Array.from(
      availableServicesSet
    );
  }

  studyPlanData.studyPlanMetadata = groomedStudyPlanMetadata;
  studyPlanData.serviceEmbedJSXObj = { test: "one" };
  for (const studyPlanValue of Object.values(studyPlanData.studyPlan)) {
    if (
      studyPlanValue.hasOwnProperty("type") &&
      studyPlanValue.type === "service" &&
      studyPlanValue.hasOwnProperty("slug") &&
      studyPlanValue.hasOwnProperty("iframeCustomAttributes")
    ) {
      studyPlanData.serviceEmbedJSXObj[studyPlanValue.slug] =
        studyPlanValue.iframeCustomAttributes;
    }
  }

  return studyPlanData;
}

function gatherAllMetadata(dataObject) {
  const itemsToInclude = [
    "_id",
    "name",
    "slug",
    "type",
    "asup",
    "author",
    "des",
    "demonstratedskillsdesc",
    "demonstratedskillurl",
    "markcomplete",
    "markforreview",
    "lectureTime",
    "labTime",
    "method",
    "msup",
    "itemnotes",
    "platform",
    "priority",
    "progressbar",
    "status",
    "start",
    "acomp",
    "url",
    "identifier",
    "masterLibraryID",
    "createdAt",
    "updatedAt",
    "__v",
  ];
  const onlyCollectID = ["markcomplete", "markforreview"];
  const addTogether = ["lectureTime", "labTime"];
  const valuesToExclude = ["undefined", "", " "];
  const outputSet = objectExtractAllValuesPerKey(
    dataObject,
    itemsToInclude,
    onlyCollectID,
    addTogether,
    valuesToExclude
  );

  return outputSet;
}

function objectExtractAllValuesPerKey(
  objectToLoop,
  itemsToInclude,
  onlyCollectID,
  addTogether,
  valuesToExclude
) {
  const outputObject = {};
  // Grab each item
  for (const i in objectToLoop) {
    // Get each item withing that question (ID, topic, answer, etc)
    for (let key in objectToLoop[i]) {
      key = key.trim();

      // Check if we are meant to include that item & the value is valid
      if (
        itemsToInclude.includes(key) &&
        !valuesToExclude.includes(objectToLoop[i][key])
      ) {
        // Handle items that need to be added together
        if (addTogether.includes(key)) {
          if (objectToLoop[i].type.toLowerCase() === "goal") continue;
          if (!outputObject.hasOwnProperty(key)) outputObject[key] = [0];
          if (objectToLoop[i][key]) {
            outputObject[key][0] += objectToLoop[i][key] * 1;
          }
        }
        // Handle some items by only gathering the _id
        else if (onlyCollectID.includes(key)) {
          if (!outputObject.hasOwnProperty(key)) outputObject[key] = new Set();
          if (objectToLoop[i][key] && objectToLoop[i][key] != false) {
            outputObject[key].add(objectToLoop[i]._id);
          }
        }
        // If the value is a list, separate at the comma
        else if (
          objectToLoop[i][key] &&
          objectToLoop[i][key].constructor === String &&
          objectToLoop[i][key].indexOf(",") >= 0
        ) {
          const termArray = objectToLoop[i][key].split(",");

          // For each list item, put is in the Set (removes duplicates)

          termArray.forEach((term) => {
            const value = term.trim().toString();

            // Add to Set. If key Set does not exist, create it.
            if (outputObject.hasOwnProperty(key)) {
              outputObject[key].add(value);
            } else {
              outputObject[key] = new Set();
              outputObject[key].add(value);
            }
          });
        } // Since the value is not a string list, if the value is not an array, just add it as-is to the key Set
        else if (
          objectToLoop[i][key] &&
          objectToLoop[i][key].constructor !== Array
        ) {
          if (objectToLoop[i][key].constructor === Object) {
            Object.values(objectToLoop[i][key]).forEach((val) => {
              if (outputObject.hasOwnProperty(key)) {
                outputObject[key].add(val);
              } else {
                outputObject[key] = new Set();
                outputObject[key].add(val);
              }
            });
          } else if (objectToLoop[i][key].constructor === Boolean) {
            const value = i.toString().trim();
            if (outputObject.hasOwnProperty(key)) {
              outputObject[key].add(value);
            } else {
              outputObject[key] = new Set();
              outputObject[key].add(value);
            }
          } else {
            const value = objectToLoop[i][key].toString().trim();
            if (outputObject.hasOwnProperty(key)) {
              outputObject[key].add(value);
            } else {
              outputObject[key] = new Set();
              outputObject[key].add(value);
            }
          }
        } // Since the value is an array, loop to add it
        else if (
          objectToLoop[i][key] &&
          objectToLoop[i][key].constructor === Array
        ) {
          if (
            objectToLoop[i][key].length > 0 ||
            objectToLoop[i][key].size > 0
          ) {
            objectToLoop[i][key].forEach((rawValue) => {
              const value = rawValue[0]
                ? rawValue[0].replaceAll(" ", "").toString()
                : "";

              // Check if the value is valid
              if (!valuesToExclude.includes(value)) {
                if (outputObject.hasOwnProperty(key)) {
                  outputObject[key].add(value);
                } else {
                  outputObject[key] = new Set();
                  outputObject[key].add(value);
                }
              }
            });
          } else {
            // If the above does not app;y, return a Set() if it si not already there.
            if (!outputObject.hasOwnProperty(key))
              outputObject[key] = new Set();
          }
        }
      }
    }
  }

  for (const i in outputObject) {
    outputObject[i] = Array.from(outputObject[i]);
  }

  return outputObject;
}

// function stringToArray(tagString) {
//   if (tagString == "undefined") return [];
//   return tagString.replaceAll(" ", "").split(",");
// }
