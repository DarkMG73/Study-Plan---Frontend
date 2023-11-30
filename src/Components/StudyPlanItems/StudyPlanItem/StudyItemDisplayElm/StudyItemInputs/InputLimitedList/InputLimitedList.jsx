import React, { Fragment } from "react";
import Styles from "./InputLimitedList.module.scss";
import useAddInputData from "../../../../../../Hooks/useAddInputData";

const InputLimitedList = (props) => {
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
        {Object.values(displayConditions["isLimitedList"][key]).map(
          (option) => (
            <option
              key={
                option +
                parentMasterID +
                "-" +
                parentsParentKey +
                "-" +
                parentKey +
                "-" +
                key +
                "-" +
                "option"
              }
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>
    </Fragment>
  );
};

export default InputLimitedList;
