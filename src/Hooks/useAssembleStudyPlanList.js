const useAssembleStudyPlanList = () => {
  const outputFunction = (props) => {
    const {
      typeArray,
      keysToUseArray,
      dataObjForEdit,
      allStudyPlanItems,
    } = props;

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

      // Gather items to list based on typeArray.
      for (const itemID in dataObjForEdit) {
        if (
          !dataObjForEdit[itemID].hasOwnProperty("type") ||
          !typeArray.includes(dataObjForEdit[itemID].type)
        )
          continue;
        output[itemID] = {};

        for (const catName of keysToUseArray) {
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

      // TODO: confirm direction here.
      // if ((typeArray.lenght = 1 && typeArray.includes("goal"))) {
        if (true) {
        for (const [key, value] of Object.entries(output)) {
          // if (value.type !== "goal") continue;
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


      return { groomedOutput, groomedAllItemOutput };
    } else {
      return false;
    }
  };
  return outputFunction;
};

export default useAssembleStudyPlanList;
