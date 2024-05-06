import { useState, useEffect, Fragment } from "react";
import Styles from "./Textarea.module.scss";
import useAddInputData from "../../../../../../Hooks/useAddInputData";
import TextareaAutosize from "react-textarea-autosize";

const Textarea = (props) => {
  const {
    passedKey,
    studyPlanItemsObj,
    section,
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
  const [notes, setNotes] = useState("");
  const addInputData = useAddInputData();
  const onChangeNotes =
    () =>
    ({ target: { value } }) => {
      setNotes(value);
    };

  const onBlurHandler = (e) => {
    addInputData(e, { emptyForm, editedField, setEditedField });
  };

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
        {key}
      </label>
      {(unlockProtectedVisible.includes(parentMasterID) ||
        (section && section.includes("editor-in-modal")) ||
        parentMasterID.includes("newForm")) && (
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
          onChange={onChangeNotes()}
          onBlur={onBlurHandler}
          defaultValue={notes}
          contentEditable={unlockProtectedVisible.includes(parentMasterID)}
          suppressContentEditableWarning={true}
          className="sizable-textarea"
        />
      )}
      {!unlockProtectedVisible.includes(parentMasterID) &&
        section !== "editor-in-modal" &&
        !parentMasterID.includes("newForm") && (
          <div
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
            className="sizable-textarea"
          >
            {notes}
          </div>
        )}
    </Fragment>
  );
};

export default Textarea;
