const useInitStudyPlanItems = () => {
  const outputFunction = (props) => {
    const {
      id,
      typeArray,
      sortMethod,
      dataObjForEdit,
      getSchemaForStudyPlanItem,
      getSchemaForContentItem,
      allStudyPlanItems,
      setAllStudyPlanItems,
      setFormInputData,
    } = props;

    console.log(
      "%c --> %cline:14%ctypeArray",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
      typeArray
    );
    const findDependencies = (objectIdentifier, masterListObj) => {
      const output = [];
      for (const value of Object.values(masterListObj)) {
        if (value.hasOwnProperty("msup") && value.msup === objectIdentifier)
          output.push(value.identifier);
      }
      return output;
    };

    if (dataObjForEdit) {
      const output = {};
      // const groomedSchema = {}
      // // Organize Schema
      // orderOfOutputArray.forEach(topic=>{
      //   groomedSchema[topic] = data.tree[topic]
      // })

      // Gather items to list based on typeArray.
      for (const itemID in dataObjForEdit) {
        if (
          !dataObjForEdit[itemID].hasOwnProperty("type") ||
          !typeArray.includes(dataObjForEdit[itemID].type)
        )
          continue;
        output[itemID] = {};

        for (const catName of Object.keys(data.tree)) {
          output[itemID][catName] = dataObjForEdit[itemID].hasOwnProperty(
            catName
          )
            ? dataObjForEdit[itemID][catName]
            : "";
        }
      }

      const groomedOutput = { ...output };
      const groomedAllItemOutput = {};
      if (allStudyPlanItems) {
        for (const [key, value] of Object.entries(allStudyPlanItems)) {
          groomedAllItemOutput[key] = {};
          for (const [innerKey, innerValue] of Object.entries(value)) {
            groomedAllItemOutput[key][innerKey] = innerValue;
          }
        }
      }

      if (typeArray.includes("goal")) {
        for (const [key, value] of Object.entries(output)) {
          groomedOutput[key].dependencies = findDependencies(
            value.identifier,
            dataObjForEdit
          );
        }
        if (allStudyPlanItems) {
          for (const [key, value] of Object.entries(allStudyPlanItems)) {
            groomedAllItemOutput[key].dependencies = findDependencies(
              value.identifier,
              allStudyPlanItems
            );
          }
        }
      }

      ////////////////////////////////////////////////////////////////////////
      /// Sort groomedOutput
      ////////////////////////////////////////////////////////////////////////
      const sortBy = Object.keys(data.tree).includes(
        sortMethod.replace("-reverse", "")
      )
        ? sortMethod
        : "priority";

      const sortNumbers = (fieldName, direction) => {
        console.log("--------------");
        console.log("----NUMBER---");
        console.log("----" + direction + "---");
        console.log("--------------");
        const outputObj = {};
        let sortedArray = [];
        const name = fieldName.replace("-reverse", "");
        if (direction === "reverse") {
          sortedArray = Object.values(groomedOutput).sort(
            (v1, v2) => v1[name] + v2[name]
          );
        } else {
          sortedArray = Object.values(groomedOutput).sort(
            (v1, v2) => v1[name] - v2[name]
          );
        }
        sortedArray.forEach((item) => {
          outputObj[item._id] = item;
        });
        return outputObj;
      };

      const sortWords = (fieldName, direction) => {
        console.log("--------------");
        console.log("----WORD---");
        console.log("----" + direction + "---");
        console.log("--------------");
        const outputObj = {};
        let sortedArray = [];
        const name = fieldName.replace("-reverse", "");
        if (direction === "reverse") {
          sortedArray = Object.values(groomedOutput).sort((v1, v2) => {
            const name = sortBy.replace("-reverse", "");

            if (v1[name] < v2[name]) {
              return 1;
            }
            if (v1[name] > v2[name]) {
              return -1;
            }
            return 0;
          });
        } else {
          console.log(
            "%c --> %cline:119%cname",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
            name
          );
          sortedArray = Object.values(groomedOutput).sort((v1, v2) => {
            if (v1[name] < v2[name]) {
              console.log(
                "%c --> %cline:149%cv1[name] < v2[name]",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
                v1[name]
              );
              console.log(
                "%c --> %cline:149%cv1[name] < v2[name]",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
                v2[name]
              );
              return -1;
            }
            if (v1[name] > v2[name]) {
              console.log(
                "%c --> %cline:153%cv1[name] > v2[name]",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
                v1[name] > v2[name]
              );
              return 1;
            }
            return 0;
          });
        }
        sortedArray.forEach((item) => {
          outputObj[item._id] = item;
        });
        console.log(
          "%c --> %cline:150%coutputObj",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
          outputObj
        );
        return outputObj;
      };

      const forNumberSort = [
        "priority",
        "status",
        "progressbar",
        "lectureTime",
        "labTime",
      ];

      const direction = sortBy.includes("-reverse") ? "reverse" : "forward";
      let sortedGroomedOutput = {};

      if (forNumberSort.includes(sortBy.replace("-reverse", ""))) {
        sortedGroomedOutput = sortNumbers(sortBy, direction);
      } else {
        sortedGroomedOutput = sortWords(sortBy, direction);
      }

      setAllStudyPlanItems(groomedAllItemOutput);
      setFormInputData(sortedGroomedOutput);
    } else {
      getSchemaForStudyPlanItem()
        .then((data) => {
          setFormInputData((prevState) => {
            const existingState = { ...prevState };
            existingState.studyPlan = data.tree;
            return existingState;
          });
        })
        .catch((err) => {
          console.log("ERROR->", err);
        });
    }
  };
  return outputFunction;
};

export default useInitStudyPlanItems;
