import useSortList from "./useSortList";

const useInitStudyPlanItems = () => {
  const sortList = useSortList();
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
      let getSchema = getSchemaForStudyPlanItem;
      if (id === "content") {
        getSchema = getSchemaForContentItem;
      }

      getSchema()
        .then((data) => {
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

          const sortedGroomedOutput = sortList({
            sortMethod: sortBy,
            objectToBeSorted: groomedOutput,
          });
          setAllStudyPlanItems(groomedAllItemOutput);
          setFormInputData(sortedGroomedOutput);
        })
        .catch((err) => {
          console.log("ERROR->", err);
        });
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
