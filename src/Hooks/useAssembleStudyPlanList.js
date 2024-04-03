const useAssembleStudyPlanList = () => {
  const outputFunction = (props) => {
    const { typeArray, keysToUseArray, dataObjForEdit, allStudyPlanItems } =
      props;

    // const findDependencies = (objectIdentifier, masterListObj) => {
    //   if (objectIdentifier <= "")
    //     console.log(
    //       "%c⚪️►►►► %cline:6%cobjectIdentifier",
    //       "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    //       "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    //       "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
    //     );
    //   return masterListObj;
    // console.log(
    //   "%c⚪️►►►► %cline:6%cobjectIdentifier",
    //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    //   "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
    //   objectIdentifier,
    // );

    // const output = [];
    // for (const value of Object.values(masterListObj)) {
    //   if (Object.hasOwn(value, "msup") && value.msup === objectIdentifier) {
    //     if (value.type === "goal") {
    //       console.log(
    //         "%c⚪️►►►► %cline:8%cvalue",
    //         "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    //         "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    //         "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
    //         value,
    //       );
    //     }
    //   }

    //   if (Object.hasOwn(value, "msup") && value.msup === objectIdentifier)
    //     output.push(value.identifier);
    // }
    // return output;
    // };

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

      // for (const [key, value] of Object.entries(output)) {
      // if (value.type !== "goal") continue;
      // groomedOutput[key].dependencies = findDependencies(
      //   value.identifier,
      //   dataObjForEdit,
      // );
      // if (value.type === "goal") {
      //   console.log(
      //     "%c⚪️►►►► %cline:76%ckey",
      //     "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      //     "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      //     "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
      //     key,
      //   );
      //   console.log(
      //     "%c⚪️►►►► %cline:92%c groomedOutput[key]",
      //     "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      //     "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      //     "color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px",
      //     groomedOutput[key],
      //   );
      // }
      // }
      // allStudyPlanItems is only supplied in situations where dataObjForEdit is not.
      if (allStudyPlanItems) {
        // console.log(
        //   "%c⚪️►►►► %cline:90%callStudyPlanItems__________",
        //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        //   "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
        //   allStudyPlanItems,
        // );
        // for (const [key, value] of Object.entries(allStudyPlanItems)) {
        //   groomedAllItemOutput[key].dependencies = findDependencies(
        //     value.identifier,
        //     allStudyPlanItems,
        //   );
        // }
      }
      for (const value of Object.values(groomedOutput)) {
        if (value.type === "goal") {
          console.log(
            "%c⚪️►►►► %cline:112%cgroomedOutput",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
            groomedOutput,
          );
          console.log(
            "%c⚪️►►►► %cline:113%cvalue",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
            value,
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
