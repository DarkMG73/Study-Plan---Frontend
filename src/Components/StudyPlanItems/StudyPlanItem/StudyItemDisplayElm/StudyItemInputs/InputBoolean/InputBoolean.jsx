import React, { Fragment } from "react";
import Styles from "./InputBoolean.module.scss";
import useAddInputData from "../../../../../../Hooks/useAddInputData";
const InputBoolean = (props) => {
  const addInputData = useAddInputData();
  const {
    passedKey,
    studyPlanItemsObj,
    parentMasterID,
    parentsParentKey,
    parentKey,
    emptyForm,
    editedField,
    setEditedField,
    displayConditions,
    unlockProtectedVisible,
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
        {" "}
        <option key={"false-set"} value={false}>
          False
        </option>
        <option key={"true-set"} value={true}>
          True
        </option>
      </select>
    </Fragment>
  );
};

export default InputBoolean;
