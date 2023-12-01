import { contentData as contentDataFunction } from "../storage/contentDB.js";

export default async function GatherContentData() {
  const contentData = {};
  contentData.content = {};

  const contentFromDB = await contentDataFunction();

  if (contentFromDB.length <= 0) {
    throw new Error(
      "There appears to be a problem reaching the servers. Please try again or contact the site admin if the problem continues."
    );
  }
  contentFromDB.forEach((contentItem) => {
    contentData.content[contentItem._id] = contentItem;
  });

  const ungroomedContentMetadata = gatherAllMetadata(contentData.content);
  const groomedContentMetadata = {};
  for (const key in ungroomedContentMetadata) {
    const output = [];
    if (key === "tags") {
      const itmOutput = [];
      ungroomedContentMetadata[key].forEach((itm) => {
        if (itm.constructor === String) {
          itmOutput.push(...itm.split(","));
        }

        if (itm.constructor === Array) {
          itmOutput.push(...itm);
        }
      });

      const flattenedArrays = new Set(itmOutput.map((value) => value.trim()));

      const flattenedArraysOutput = Array.from(flattenedArrays);
      output.push(
        flattenedArraysOutput.length,
        flattenedArraysOutput.join(", ")
      );
    } else {
      output.push(ungroomedContentMetadata[key].length);
      output.push(...ungroomedContentMetadata[key]);
    }

    groomedContentMetadata[key] = [...output];
  }

  contentData.contentMetadata = groomedContentMetadata;

  //Add Social Connections array
  const rawSocialConnections = {};
  for (const itemID in contentData.content) {
    if (
      Object.hasOwn(contentData.content[itemID], "type") &&
      contentData.content[itemID].type.trim() === "socialConnection"
    ) {
      rawSocialConnections[itemID] = contentData.content[itemID];
    }

    contentData.socialConnections = rawSocialConnections;
  }

  return contentData;
}

function gatherAllMetadata(dataObject) {
  const itemsToInclude = [
    "topic",
    "title",
    "slug",
    "type",
    "text",
    "imageOneURL",
    "textTwo",
    "imageTwoURL",
    "textThree",
    "imageThreeURL",
    "textFour",
    "imageFourURL",
    "link",
    "tags",
    "notes",
    "identifier",
    "masterLibraryID",
  ];
  const valuesToExclude = ["undefined", "", " "];
  const stringsToArrays = [];
  const outputSet = objectExtractAllValuesPerKey(
    dataObject,
    itemsToInclude,
    valuesToExclude,
    stringsToArrays
  );

  return outputSet;
}

function objectExtractAllValuesPerKey(
  objectToLoop,
  itemsToInclude,
  valuesToExclude,
  stringsToArrays
) {
  const outputObject = {};
  // Grab each question
  for (const i in objectToLoop) {
    // Get each item withing that question (ID, topic, answer, etc)
    for (let key in objectToLoop[i]) {
      key = key.trim();
      // Check if we are meant to include that item & the value is valid
      if (
        itemsToInclude.includes(key) &&
        !valuesToExclude.includes(objectToLoop[i][key])
      ) {
        // If the value is a list, separate at the comma
        if (
          objectToLoop[i][key] &&
          objectToLoop[i][key].constructor === String &&
          stringsToArrays.includes(key) &&
          objectToLoop[i][key].indexOf(",") >= 0
        ) {
          const termArray = objectToLoop[i][key].split(",");
          // For each list item, put is in the Set (removes duplicates)

          termArray.forEach((term) => {
            const value = term.trim().toString();

            // Add to Set. If key Set does not exist, create it.
            if (Object.hasOwn(outputObject, key)) {
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
              if (Object.hasOwn(outputObject, key)) {
                outputObject[key].add(val);
              } else {
                outputObject[key] = new Set();
                outputObject[key].add(val);
              }
            });
          } else if (objectToLoop[i][key].constructor === Boolean) {
            const value =
              objectToLoop[i][key].toString().trim() +
              "-" +
              i.toString().trim();
            if (Object.hasOwn(outputObject, key)) {
              outputObject[key].add(value);
            } else {
              outputObject[key] = new Set();
              outputObject[key].add(value);
            }
          } else {
            const value = objectToLoop[i][key].toString().trim();
            if (Object.hasOwn(outputObject, key)) {
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
            if (objectToLoop[i][key][0].constructor === Object) {
              console.log("!!! ERROR WITH TAGS SUBMITTED !!! key:", key);
              console.log(
                "!!! ERROR WITH TAGS SUBMITTED !!! Tags object:",
                objectToLoop[i][key][0]
              );
            } else {
              let value = [...objectToLoop[i][key][0].split(",")];
              // Check if  the value is valid
              if (!valuesToExclude.includes(value)) {
                if (Object.hasOwn(outputObject, key)) {
                  outputObject[key].add(value);
                } else {
                  outputObject[key] = new Set();
                  outputObject[key].add(value);
                }
              }
            }
          } else {
            // If the above does not app;y, return a Set() if it si not already there.
            if (!Object.hasOwn(outputObject, key))
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
