import React, { Fragment } from "react";
import Styles from "./InputNumber.module.scss";
import useAddInputData from "../../../../../../Hooks/useAddInputData";

const InputNumber = (props) => {
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
      <input
        type="number"
        id={
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "url"
        }
        key={parentKey + "-" + key}
        name={parentKey + "-" + key}
        defaultValue={studyPlanItemsObj[key]}
        data-category={key}
        placeholder={"Numbers only..."}
        title={key}
        data-parentkey={parentKey}
        data-parentsparentkey={
          parentsParentKey ? parentsParentKey.toString() : ""
        }
        data-parentmasterid={parentMasterID}
        onChange={(e) => {
          addInputData(e, { emptyForm, editedField, setEditedField });
        }}
        min={displayConditions.isNumber[key].min * 1}
        max={displayConditions.isNumber[key].max}
      />
    </Fragment>
  );
};

export default InputNumber;
