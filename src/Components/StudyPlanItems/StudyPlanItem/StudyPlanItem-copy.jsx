import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./StudyPlanItem.module.scss";
import { formInputDataActions } from "../../../store/formInputDataSlice";

import { studyPlanDataActions } from "../../../store/studyPlanDataSlice";
import StudyPlanDisplayElm from "./StudyPlanDisplayElm/StudyPlanDisplayElm";
const StudyPlanItem = (props) => {
  const studyPlanItemsObj = props.studyPlanItemsObj.studyPlanItemsObj;
  const user = useSelector((state) => state.auth.user);
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData,
  );
  const showProtectedHidden = props.showProtectedHidden;
  const unlockProtectedVisible = props.unlockProtectedVisible;
  const displayConditions = props.displayConditions;
  const onlyList = props.onlyList;
  // const key = studyPlanItemsObj._id;
  const key = props.passedKey;
  // const setExistingFormInputValuesObj = props.setExistingFormInputValuesObj;
  const parentKey = props.parentKey;
  const parentsParentKey = props.parentsParentKey;
  const parentMasterID = props.parentMasterID;
  const parentMasterType = props.parentMasterType;
  const emptyForm = props.emptyForm;
  const [editedField, setEditedField] = useState(false);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(studyPlanItemsObj[key] != false);
  const elementTypeNeeded = findElementType(key);
  const setFormType = props.setFormType;
  // Delays functions until after typing
  let typingTimer = null;

  // Clears delay of functions until after typing

  ////////////////////////////////
  /// Effects
  ////////////////////////////////
  useEffect(() => {
    return () => {
      clearTimeout(typingTimer);
    };
  }, []);

  ////////////////////////////////
  /// Handlers
  ////////////////////////////////
  const slideButtonHandler = (e) => {
    e.preventDefault();

    const itemWithNewEdits = { ...studyPlanItemsObj };

    const _id = itemWithNewEdits._id;

    itemWithNewEdits[key] = !studyPlanItemsObj[key];

    if (user) {
      setChecked(!checked);

      dispatch(
        studyPlanDataActions.updateStudyPlanDB({ itemWithNewEdits, user }),
      );
      // updateAStudyPlanItem(dataObj, user);
    } else {
      alert("You must be logged in to be able to make changes.");
    }
  };

  const addInputData = (e) => {
    e.preventDefault();
    const target = e.target;
    const outputValue = target.value;
    // Allows the form show only inputs needed by each type
    const parentMasterID = target.getAttribute("data-parentmasterid");
    let title = target.getAttribute("title");

    if (title === "type")
      document
        .getElementById(parentMasterID)
        .setAttribute("newFormType", outputValue);

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      if (outputValue) {
        groomAndAddInputData(target, parentMasterID, outputValue);
      }
    }, 2000);
  };

  ////////////////////////////////
  /// Functionality
  ////////////////////////////////
  function findElementType(itemKey) {
    const parentsParentKey = props.parentsParentKey;
    const checkIfNameInDisplayCond = (name, condition) => {
      if (Object.hasOwn(displayConditions, condition)) {
        if (Array.isArray(displayConditions[condition])) {
          return (
            Object.hasOwn(displayConditions, condition) &&
            displayConditions[condition].includes(name)
          );
        } else {
          return Object.keys(displayConditions[condition]).includes(name);
        }
      } else return false;
    };

    let output = "textarea";

    if (itemKey === "_id" || itemKey === "progressbar") {
      // ID & Progress Bar
      output = itemKey;
    } else {
      // Date
      if (checkIfNameInDisplayCond(key, "isDate")) output = "isDate";

      // Boolean
      if (checkIfNameInDisplayCond(key, "isBoolean")) output = "isBoolean";

      // Slide Button
      if (checkIfNameInDisplayCond(key, "forSlideButton"))
        output = "forSlideButton";

      // URL
      if (checkIfNameInDisplayCond(key, "isURL")) output = "isURL";

      // Number
      if (checkIfNameInDisplayCond(key, "isNumber")) output = "isNumber";

      // Lists
      if (checkIfNameInDisplayCond(key, "isList")) output = "isList";
      if (checkIfNameInDisplayCond(key, "isSuggestionsList"))
        output = "isSuggestionsList";
      if (checkIfNameInDisplayCond(key, "isLimitedList"))
        output = "isLimitedList";
      if (checkIfNameInDisplayCond(key, "isFixedCompiledList"))
        output = "isFixedCompiledList";
      if (checkIfNameInDisplayCond(key, "isOtherKeyFixedCompiledList"))
        output = "isOtherKeyFixedCompiledList";
    }

    return output;
  }

  let defaultDateValue = new Date("yyyy-MM-ddThh:mm");
  if (elementTypeNeeded === "isDate") {
    try {
      defaultDateValue =
        studyPlanItemsObj[key] &&
        new Date(
          new Date(studyPlanItemsObj[key]).getTime() -
            new Date().getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, 19);
    } catch (err) {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:10px;border-radius:0 25px 25px 0",
        err,
      );
    }
  }

  const optionsList = [];
  if (elementTypeNeeded === "isOtherKeyFixedCompiledList") {
    // Create array of objects without parent
    const fullOptionsArray = Object.values(studyPlan).filter((value) => {
      // Get rid of parent item from list
      if (studyPlanItemsObj.name === value.name) return false;
      return true;
    });

    // Determine data needed
    const keyToDisplay =
      displayConditions.isOtherKeyFixedCompiledList[key].keyToDisplay;
    const keyForOptionValue =
      displayConditions.isOtherKeyFixedCompiledList[key].keyToSave;

    // Alpha sort ascending then by type descending (Goals first)
    const sortedFullOptionsArray = fullOptionsArray
      .sort((a, b) => {
        if (!Object.hasOwn(a, "name") || !Object.hasOwn(b, "name")) return 0;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        return 0;
      })
      .sort((a, b) => {
        if (!Object.hasOwn(a, "type") || !Object.hasOwn(b, "type")) return 0;
        if (a.type.toLowerCase() > b.type.toLowerCase()) return 1;
        if (a.type.toLowerCase() < b.type.toLowerCase()) return -1;
        return 0;
      });

    // Create the JSX
    sortedFullOptionsArray.forEach((optionObj) => {
      if (!Object.hasOwn(optionObj, "type")) return false;
      optionsList.push(
        <option
          key={optionObj[keyForOptionValue]}
          value={optionObj[keyForOptionValue]}
        >
          {optionObj.type.toUpperCase()}: {optionObj[keyToDisplay]}
        </option>,
      );
    });
  }

  ////////////////////////////////
  /// Output
  ////////////////////////////////
  const output = (
    <Fragment>
      <li
        key={
          key +
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "-" +
          "item"
        }
        data-marker="CATALOG-ITEM"
        id={
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "-" +
          "item"
        }
        data-parentmastertype={parentMasterType}
        data-category={studyPlanItemsObj[key]}
        data-parentkey={parentKey}
        data-parentsparentkey={parentsParentKey ? parentsParentKey : ""}
        data-parentmasterid={parentMasterID}
        className={
          styles.item +
          " " +
          styles[
            "protectedHidden-" +
              (displayConditions &&
                Object.hasOwn(displayConditions, "protectedHidden") &&
                displayConditions.protectedHidden.includes(key) &&
                !showProtectedHidden.includes(parentMasterID))
          ] +
          " " +
          styles[parentKey] +
          " " +
          styles[parentMasterType] +
          " " +
          styles[parentKey + "-" + key] +
          " " +
          styles[key] +
          " " +
          (editedField && !emptyForm && styles["edited-field"]) +
          " " +
          (emptyForm && styles["new-form-item"])
        }
      >
        <StudyPlanDisplayElm setEditedField={setEditedField} />
        {onlyList && <span>{studyPlanItemsObj[key]}</span>}
      </li>
      {
        // The main URL link needs to be on its own for grid placement
      }
      {elementTypeNeeded === "isURL" && key === "url" && (
        <li
          id={
            "arrow" +
            parentMasterID +
            "-" +
            parentsParentKey +
            "-" +
            parentKey +
            "-" +
            key +
            "url"
          }
          key={"arrow" + parentKey + "-" + key}
          className={
            styles["featured-url-arrow-wrap"] +
            " " +
            styles[
              "protectedHidden-" +
                displayConditions.protectedHidden.includes(key)
            ] +
            " " +
            styles[
              "protectedVisible-" +
                (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                  !unlockProtectedVisible.includes(parentMasterID)) ||
                (displayConditions.protectedVisible.includes(key) &&
                  !unlockProtectedVisible.includes(parentMasterID))
            ]
          }
        >
          <a
            href={studyPlanItemsObj[key]}
            rel="noreferrer"
            target="_blank"
            key={parentKey + "-" + key}
            name={parentKey + "-" + key}
            defaultValue={studyPlanItemsObj[key]}
            data-category={key}
            placeholder={"Valid URL only..."}
            title={key}
            data-parentkey={parentKey}
            data-parentsparentkey={
              parentsParentKey ? parentsParentKey.toString() : ""
            }
            data-parentmasterid={parentMasterID}
            className={
              styles["button"] +
              " " +
              styles["featured-url-arrow"] +
              " " +
              styles[
                "protectedHidden-" +
                  displayConditions.protectedHidden.includes(key)
              ] +
              " " +
              styles[
                "protectedVisible-" +
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          >
            Go &rarr;
          </a>
        </li>
      )}{" "}
    </Fragment>
  );

  return output;
};

export default StudyPlanItem;
