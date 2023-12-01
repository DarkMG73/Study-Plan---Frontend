import { Fragment } from "react";
import useAddInputData from "../../../../../../Hooks/useAddInputData";

const InputDate = (props) => {
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
  } = props;

  const key = passedKey;

  let defaultDateValue = new Date("yyyy-MM-ddThh:mm");

  if (studyPlanItemsObj[key]) {
    try {
      defaultDateValue =
        studyPlanItemsObj[key] &&
        new Date(
          new Date(studyPlanItemsObj[key]).getTime() -
            new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 19);
    } catch (err) {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:10px;border-radius:0 25px 25px 0",
        err
      );
    }
  }

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
        id={
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "input"
        }
        key={parentKey + "-" + key}
        name={parentKey + "-" + key}
        type="datetime-local"
        placeholder={studyPlanItemsObj[key]}
        title={key}
        data-parentkey={parentKey}
        data-parentsparentkey={
          parentsParentKey ? parentsParentKey.toString() : ""
        }
        data-parentmasterid={parentMasterID}
        onChange={(e) => {
          addInputData(e, { emptyForm, editedField, setEditedField });
        }}
        defaultValue={defaultDateValue}
      />
    </Fragment>
  );
};

export default InputDate;
