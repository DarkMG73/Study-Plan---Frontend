const useAssembleStudyPlanList = () => {
  const outputFunction = (props) => {
    const { typeArray, keysToUseArray, dataObjForEdit, allStudyPlanItems } =
      props;

    const findDependencies = (objectIdentifier, masterListObj) => {
      const output = [];
      for (const value of Object.values(masterListObj)) {
        if (Object.hasOwn(value, "msup") && value.msup === objectIdentifier)
          output.push(value.identifier);
        console.log(
          "%c⚪️►►►► %cline:9%cobjectIdentifier",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
          objectIdentifier,
        );
        console.log(
          "%c⚪️►►►► %cline:9%cvalue.msup",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
          value.msup,
        );
      }
      return output;
    };

    if (dataObjForEdit) {
      const output = {};

      // Gather items to list based on typeArray.
      for (const itemID in dataObjForEdit) {
        if (
          !Object.hasOwn(dataObjForEdit[itemID], "type") ||
          !typeArray.includes(dataObjForEdit[itemID].type)
        )
          continue;
        output[itemID] = {};

        for (const catName of keysToUseArray) {
          output[itemID][catName] = Object.hasOwn(
            dataObjForEdit[itemID],
            catName,
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

      for (const [key, value] of Object.entries(output)) {
        // if (value.type !== "goal") continue;
        groomedOutput[key].dependencies = findDependencies(
          value.identifier,
          dataObjForEdit,
        );
      }
      if (allStudyPlanItems) {
        for (const [key, value] of Object.entries(allStudyPlanItems)) {
          groomedAllItemOutput[key].dependencies = findDependencies(
            value.identifier,
            allStudyPlanItems,
          );
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
