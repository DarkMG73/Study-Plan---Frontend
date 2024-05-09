const useStudyPlanListElmProperties = () => {
  const outputFunction = (props) => {
    const {
      section,
      key,
      studyPlanItemsObj,
      styles,
      parentMasterType,
      subListLevel,
      parentKey,
      parentsParentKey,
      parentMasterID,
      unlockProtectedVisible,
      onlyList,
      displayConditions,
      refresh,
      dependenciesObj,
      allStudyPlanItems,
      emptyForm,
      setFormType,
      expandedItems,
      updateExistingFormState,
    } = props;

    return {
      ul1: {
        "data-section": section,
        key: section + key,
        id: key == 0 ? studyPlanItemsObj[key]._id : key,
        type: props.type ? props.type : studyPlanItemsObj[key].type,
        "data-parentmastertype": parentMasterType
          ? parentMasterType
          : studyPlanItemsObj[key].type,
        "data-maingoal":
          "" +
          (Object.hasOwn(studyPlanItemsObj[key], "msup") &&
            studyPlanItemsObj[key].msup.trim() === ""),
        "data-forreview":
          "" +
          (Object.hasOwn(studyPlanItemsObj[key], "markforreview") &&
            studyPlanItemsObj[key].markforreview &&
            studyPlanItemsObj[key].markforreview !== "false"),
        "data-markedcomplete":
          "" +
          (Object.hasOwn(studyPlanItemsObj[key], "markcomplete") &&
            studyPlanItemsObj[key].markcomplete &&
            studyPlanItemsObj[key].marcomplete !== "false"),
        className:
          (subListLevel > 0 &&
            styles.subgroup +
              " " +
              styles[!!parentKey && !parentsParentKey && "subgroup-set"] +
              " " +
              styles[!!parentKey && "subgroup-set-child"] +
              " " +
              styles["subgroup-" + key] +
              " " +
              styles["sub-level-" + subListLevel]) +
          " " +
          ((!subListLevel || subListLevel <= 0) &&
            styles["master-parent-group"]) +
          " " +
          styles[key] +
          " " +
          styles[parentKey] +
          " " +
          styles[parentMasterID] +
          " " +
          (unlockProtectedVisible.includes(key) && styles["edited-list"]) +
          " " +
          (props.inModal && styles["in-modal"]),
      },
      ul2: {
        "data-section": section,
        key:
          key +
          section +
          parentKey +
          parentMasterType +
          subListLevel +
          onlyList +
          (props.type ? props.type : studyPlanItemsObj[key].type + "-sub--2"),

        id: key != 0 ? key : studyPlanItemsObj[key]._id,
        type: props.type ? props.type : studyPlanItemsObj[key].type,
        "data-parentmastertype": parentMasterType
          ? parentMasterType
          : studyPlanItemsObj[key].type,

        "data-maingoal":
          "" +
          (Object.hasOwn(studyPlanItemsObj[key], "msup") &&
            studyPlanItemsObj[key].msup.trim() === ""),

        "data-forreview":
          "" +
          (Object.hasOwn(studyPlanItemsObj[key], "markforreview") &&
            studyPlanItemsObj[key].markforreview &&
            studyPlanItemsObj[key].markforreview !== "false"),

        "data-markedcomplete":
          "" +
          (Object.hasOwn(studyPlanItemsObj[key], "markcomplete") &&
            studyPlanItemsObj[key].markcomplete &&
            studyPlanItemsObj[key].marcomplete !== "false"),

        className:
          (subListLevel > 0 &&
            styles.subgroup +
              " " +
              styles[!!parentKey && !parentsParentKey && "subgroup-set"] +
              " " +
              styles[!!parentKey && "subgroup-set-child"] +
              " " +
              styles["subgroup-" + key] +
              " " +
              styles["sub-level-" + subListLevel]) +
          " " +
          ((!subListLevel || subListLevel <= 0) &&
            styles["master-parent-group"]) +
          " " +
          styles[key] +
          " " +
          styles[parentKey] +
          " " +
          styles[parentMasterID] +
          " " +
          (unlockProtectedVisible.includes(key) && styles["edited-list"]) +
          " " +
          (props.inModal && styles["in-modal"]),
      },
      pushButton1: {
        margin: "0 auto",
        padding: "0.5em 2em",
        transition: "0.7s all ease",
        maxWidth: "80%",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        borderRadius: "0 0 50px 0",
        fontFamily: "Arial",
        border: "none",
        position: "absolute",
        top: "0",
        left: "0",
        flexGrow: "1",
        minWidth: "4.5em",
        boxShadow:
          "inset 3px 3px 5px 0px #ffffffe0, inset -3px -3px 5px 0px #00000038",
        fontSize: "1.2rem",
        fontVariant: "all-small-caps",
        letterSpacing: "0.2em",
        cursor: "pointer",
        height: "100%",
        maxHeight: "4em",
        transformOrigin: "left",
        zIndex: "1",
      },
      pushButton2: {
        margin: "0 auto",
        padding: "0.5em 2em",
        transition: "0.7s all ease",
        maxWidth: "80%",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        borderRadius: "0 0 50px 0",
        fontFamily: "Arial",
        border: "none",
        position: "absolute",
        top: "0",
        left: "0",
        flexGrow: "1",
        minWidth: "4.5em",
        boxShadow:
          "inset 3px 3px 5px 0px #ffffffe0, inset -3px -3px 5px 0px #00000038",
        fontSize: "1.2rem",
        fontVariant: "all-small-caps",
        letterSpacing: "0.2em",
        cursor: "pointer",
        height: "100%",
        maxHeight: "4em",
        transformOrigin: "left",
        zIndex: "1",
      },
      studyPlanItemsSubList: {
        studyPlanItemsObj: studyPlanItemsObj[key],
        allStudyPlanItems: props.allStudyPlanItems,
        parentKey: key,
        parentsParentKey: parentKey,
        parentMasterID: parentMasterID
          ? parentMasterID
          : studyPlanItemsObj[key]._id,
        section: section,
        displayConditions: displayConditions,
        subListLevel: subListLevel,

        refresh: refresh,
        onlyList: onlyList,
        emptyForm: props.emptyForm,
        setFormType: props.setFormType,
      },
      studyPlanItemsSubList2: {
        studyPlanItemsObj: dependenciesObj,
        allStudyPlanItems: allStudyPlanItems,
        parentKey: key,
        parentsParentKey: parentKey,
        parentMasterID: parentMasterID
          ? parentMasterID
          : studyPlanItemsObj[key]._id,
        section: section,
        displayConditions: displayConditions,
        subListLevel: subListLevel,

        refresh: refresh,
        onlyList: onlyList,
        emptyForm: emptyForm,
        setFormType: setFormType,
      },
      studyPlanItemsSubList3: {
        studyPlanItemsObj: studyPlanItemsObj[key],
        allStudyPlanItems: allStudyPlanItems,
        parentKey: key,
        parentsParentKey: parentKey,
        parentMasterID: parentMasterID
          ? parentMasterID
          : studyPlanItemsObj[key]._id,
        section: section,
        displayConditions: displayConditions,
        subListLevel: subListLevel,

        refresh: refresh,
        onlyList: onlyList,
        emptyForm: emptyForm,
        setFormType: setFormType,
      },
      StudyPlanItem: {
        studyPlanItemsObj: props,
        expandedItems: expandedItems,
        section: section,
        passedKey: key,
        parentKey: parentKey,
        parentsParentKey: parentsParentKey,
        parentMasterID: parentMasterID,
        parentMasterType: parentMasterType
          ? parentMasterType
          : studyPlanItemsObj[key] &&
              Object.hasOwn(studyPlanItemsObj[key], "type")
            ? studyPlanItemsObj[key].type
            : "",
        displayConditions: displayConditions,

        refresh: refresh,
        setExistingFormInputValuesObj: updateExistingFormState,
        emptyForm: emptyForm,
        onlyList: onlyList,
        setFormType: setFormType,
        formType: props.formType,
      },
    };
  };

  return outputFunction;
};

export default useStudyPlanListElmProperties;

//  const section = Object.hasOwn(props, "section") ? props.section : "";
//  const key = Object.hasOwn(props, "key") ? props.key : "";
//  const studyPlanItemsObj = Object.hasOwn(props, "studyPlanItemsObj")
//    ? props.studyPlanItemsObj
//    : "";
//  const styles = Object.hasOwn(props, "styles") ? props.styles : "";
//  const parentMasterType = Object.hasOwn(props, "parentMasterType")
//    ? props.parentMasterType
//    : "";
//  const subListLevel = Object.hasOwn(props, "subListLevel")
//    ? props.subListLevel
//    : "";
//  const parentKey = Object.hasOwn(props, "parentKey") ? props.parentKey : "";
//  const parentsParentKey = Object.hasOwn(props, "parentsParentKey")
//    ? props.parentsParentKey
//    : "";
//  const parentMasterID = Object.hasOwn(props, "parentMasterID")
//    ? props.parentMasterID
//    : "";
//  const unlockProtectedVisible = Object.hasOwn(props, "unlockProtectedVisible")
//    ? props.unlockProtectedVisible
//    : "";
