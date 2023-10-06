import React, { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import styles from "./FormItemEmpty.module.scss";
import { formInputDataActions } from "../../../store/formInputDataSlice";

const FormItemEmpty = (props) => {
  const studyPlanItemsObj = props.studyPlanItemsObj.studyPlanItemsObj;
  const showProtectedHidden = props.showProtectedHidden;
  const unlockProtectedVisible = props.unlockProtectedVisible;
  const displayConditions = props.displayConditions;
  // const key = studyPlanItemsObj._id;
  const key = props.passedKey;
  // const setExistingFormInputValuesObj = props.setExistingFormInputValuesObj;
  const parentKey = props.parentKey;
  const parentsParentKey = props.parentsParentKey;
  const parentMasterID = props.parentMasterID;
  const [editedField, setEditedField] = useState(false);
  const dispatch = useDispatch();

  const addInputData = (e) => {
    e.preventDefault();
    const parentMasterID = e.target.getAttribute("parentmasterid");
    const parentKey = e.target.getAttribute("parentkey");
    let title = e.target.getAttribute("title");
    let outputValue = e.target.value;

    if (parentMasterID !== parentKey) {
      outputValue = { [title]: outputValue };
      title = parentKey;
    }
    dispatch(
      formInputDataActions.addToNewFormInputDataObj({
        parentMasterID,
        title,
        outputValue,
      })
    );

    setEditedField(true);
  };

  const output = (
    <li
      marker="CATALOG-ITEM"
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
      className={
        styles.item +
        " " +
        styles[
          "protectedHidden-" +
            (displayConditions &&
              displayConditions.hasOwnProperty("protectedHidden") &&
              displayConditions.protectedHidden.includes(key) &&
              !showProtectedHidden.includes(parentMasterID))
        ] +
        " " +
        styles[parentKey] +
        " " +
        styles[parentKey + "-" + key] +
        " " +
        styles[key] +
        " " +
        (editedField && styles["edited-field"])
      }
    >
      {key === "_id" && (
        <h4 name={parentKey + "-" + key}>{studyPlanItemsObj[key]}</h4>
      )}
      {key !== "_id" &&
        displayConditions &&
        displayConditions.hasOwnProperty("isBoolean") &&
        !displayConditions.isBoolean.includes(key) &&
        !displayConditions.isDate.includes(key) &&
        !displayConditions.isURL.includes(key) && (
          <Fragment>
            {" "}
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
              for={parentKey + "-" + key}
              className={
                styles[
                  "protectedVisible-" +
                    (displayConditions.protectedVisible.includes(key) &&
                      !unlockProtectedVisible.includes(parentMasterID))
                ]
              }
            >
              {key}:
            </label>
            <textarea
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
              category={studyPlanItemsObj[key]}
              placeholder={key}
              title={key}
              parentkey={parentKey}
              parentsparentkey={parentsParentKey}
              parentmasterid={parentMasterID}
              onChange={addInputData}
              className={
                styles[
                  "protectedVisible-" +
                    (displayConditions.protectedVisible.includes(
                      "PROTECT-ALL"
                    ) && !unlockProtectedVisible.includes(parentMasterID)) ||
                    (displayConditions &&
                      displayConditions.hasOwnProperty("protectedVisible") &&
                      displayConditions.protectedVisible.includes(key) &&
                      !unlockProtectedVisible.includes(parentMasterID))
                ]
              }
            >
              {studyPlanItemsObj[key]}
            </textarea>
          </Fragment>
        )}
      {displayConditions &&
        displayConditions.hasOwnProperty("isBoolean") &&
        displayConditions.isBoolean.includes(key) && (
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
              for={parentKey + "-" + key}
              className={
                styles[
                  "protectedHidden-" +
                    displayConditions.protectedHidden.includes(key)
                ] +
                " " +
                styles[
                  "protectedVisible-" +
                    (displayConditions.protectedVisible.includes(
                      "PROTECT-ALL"
                    ) && !unlockProtectedVisible.includes(parentMasterID)) ||
                    (displayConditions.protectedVisible.includes(key) &&
                      !unlockProtectedVisible.includes(parentMasterID))
                ]
              }
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
              category={studyPlanItemsObj[key]}
              placeholder={key}
              title={key}
              parentkey={parentKey}
              parentsparentkey={parentsParentKey}
              parentmasterid={parentMasterID}
              onChange={addInputData}
              className={
                styles[
                  "protectedHidden-" +
                    displayConditions.protectedHidden.includes(key)
                ] +
                " " +
                styles[
                  "protectedVisible-" +
                    (displayConditions.protectedVisible.includes(
                      "PROTECT-ALL"
                    ) && !unlockProtectedVisible.includes(parentMasterID)) ||
                    (displayConditions.protectedVisible.includes(key) &&
                      !unlockProtectedVisible.includes(parentMasterID))
                ]
              }
            >
              <option selected={studyPlanItemsObj[key] === true}>True</option>
              <option selected={studyPlanItemsObj[key] === false}>False</option>
              {studyPlanItemsObj[key]}
            </select>
          </Fragment>
        )}
      {displayConditions &&
        displayConditions.hasOwnProperty("isDate") &&
        displayConditions.isDate.includes(key) && (
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
              for={parentKey + "-" + key}
              className={
                styles[
                  "protectedHidden-" +
                    displayConditions.protectedHidden.includes(key)
                ] +
                " " +
                styles[
                  "protectedVisible-" +
                    (displayConditions.protectedVisible.includes(
                      "PROTECT-ALL"
                    ) && !unlockProtectedVisible.includes(parentMasterID)) ||
                    (displayConditions.protectedVisible.includes(key) &&
                      !unlockProtectedVisible.includes(parentMasterID))
                ]
              }
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
              parentkey={parentKey}
              parentsparentkey={parentsParentKey}
              parentmasterid={parentMasterID}
              onChange={addInputData}
              defaultValue={
                studyPlanItemsObj[key]
                  ? studyPlanItemsObj[key] &&
                    new Date(
                      new Date(studyPlanItemsObj[key]).getTime() -
                        new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 19)
                  : new Date()
              }
              className={
                styles[
                  "protectedHidden-" +
                    displayConditions.protectedHidden.includes(key)
                ] +
                " " +
                styles[
                  "protectedVisible-" +
                    (displayConditions.protectedVisible.includes(
                      "PROTECT-ALL"
                    ) && !unlockProtectedVisible.includes(parentMasterID)) ||
                    (displayConditions.protectedVisible.includes(key) &&
                      !unlockProtectedVisible.includes(parentMasterID))
                ]
              }
            />
          </Fragment>
        )}
    </li>
  );

  return output;
};

export default FormItemEmpty;
