import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Styles from "./InputOtherKeyFixedCompiledList.module.scss";
import useAddInputData from "../../../../../../Hooks/useAddInputData";

const InputOtherKeyFixedCompiledList = (props) => {
  const studyPlan = useSelector((state) => state.studyPlanData.studyPlan);
  const addInputData = useAddInputData();
  const {
    passedKey,
    studyPlanItemsObj,
    parentMasterID,
    parentsParentKey,
    parentKey,
    displayConditions,
    emptyForm,
    editedField,
    setEditedField,
  } = props;

  const key = passedKey;

  if (!studyPlan) return;
  const optionsList = [];
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
      </option>
    );
  });

  return (
    <Fragment>
      <label
        id={
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "label"
        }
        htmlFor={parentKey + "-" + key}
      >
        {key}:
      </label>
      <select
        id={
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "select"
        }
        key={parentKey + "-" + key}
        name={parentKey + "-" + key}
        defaultValue={studyPlanItemsObj[key]}
        data-category={key}
        placeholder={key}
        title={key}
        data-parentkey={parentKey}
        data-parentsparentkey={
          parentsParentKey ? parentsParentKey.toString() : ""
        }
        data-parentmasterid={parentMasterID}
        onChange={(e) => {
          addInputData(e, { emptyForm, editedField, setEditedField });
        }}
      >
        <option key="-Select One-" value="">
          -Select One-
        </option>

        {optionsList.map((option) => option)}
      </select>
    </Fragment>
  );
};

export default InputOtherKeyFixedCompiledList;
