import { useState, useEffect, Fragment } from "react";
import Styles from "./Textarea.module.scss";
import useAddInputData from "../../../../../../Hooks/useAddInputData";
// import TextareaAutosize from "react-textarea-autosize";

const Textarea = (props) => {
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
  const [notes, setNotes] = useState("");
  const addInputData = useAddInputData();

  const onChangeNotes =
    () =>
    ({ target: { value } }) => {
      setNotes(value);
    };

  const onBlurHandler = (e) => {
    console.log(
      "%c⚪️►►►► %cline:30%ce",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
      e.nativeEvent.target,
    );
    console.log(
      "%c⚪️►►►► %cline:30%ce",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
      e.nativeEvent.target.innerHTML,
    );
    // Groom for standard input event
    const newE = e.nativeEvent;
    newE.target.value = e.nativeEvent.target.innerHTML;
    console.log(
      "%c⚪️►►►► %cline:47%cnewE",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(20, 68, 106);padding:3px;border-radius:2px",
      newE.target,
    );
    console.log(
      "%c⚪️►►►► %cline:47%cnewE",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(20, 68, 106);padding:3px;border-radius:2px",
      newE.target.value,
    );
    addInputData(newE, { emptyForm, editedField, setEditedField });
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
        {key}:
      </label>
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
        onChange={onChangeNotes()}
        onBlur={onBlurHandler}
        defaultValue={notes}
        contentEditable={unlockProtectedVisible.includes(parentMasterID)}
        suppressContentEditableWarning={true}
        className="sizable-textarea"
      >
        {notes}
      </div>
    </Fragment>
  );
};

export default Textarea;
