import { useState, useEffect, Fragment } from "react";
import Styles from "./Textarea.module.scss";
import useAddInputData from "../../../../../../Hooks/useAddInputData";
import TextareaAutosize from "react-textarea-autosize";

const Textarea = (props) => {
  const [notes, setNotes] = useState("");

  const onChangeNotes =
    () =>
    ({ target: { value } }) => {
      setNotes(value);
    };

  const addInputData = useAddInputData();
  const {
    passedKey,
    studyPlanItemsObj,
    parentMasterID,
    parentsParentKey,
    parentKey,
    displayConditions,
    unlockProtectedVisible,
    emptyForm,
    editedField,
    setEditedField,
  } = props;

  const key = passedKey;

  useEffect(() => {
    setNotes(studyPlanItemsObj[key]);
  }, [studyPlanItemsObj[key]]);

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
        className={
          Styles[
            "protectedVisible-" +
              (displayConditions.protectedVisible.includes(key) &&
                !unlockProtectedVisible.includes(parentMasterID))
          ]
        }
      >
        {key}:
      </label>
      <TextareaAutosize
        id={
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "textarea"
        }
        key={parentKey + "-" + key}
        name={parentKey + "-" + key}
        data-category={studyPlanItemsObj[key]}
        placeholder={""}
        title={key}
        data-parentkey={parentKey}
        data-parentsparentkey={parentsParentKey ? parentsParentKey : ""}
        data-parentmasterid={parentMasterID}
        onChange={onChangeNotes}
        onBlur={(e) => {
          addInputData(e, { emptyForm, editedField, setEditedField });
        }}
        defaultValue={notes}
      />
    </Fragment>
  );
};

export default Textarea;
