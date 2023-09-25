import React, { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import styles from "./CatalogItem.module.css";
import { formInputDataActions } from "../../../store/formInputDataSlice";

const CatalogItem = (props) => {
  const catalogItemsObj = props.catalogItemsObj.catalogItemsObj;

  const showProtectedHidden = props.showProtectedHidden;
  const unlockProtectedVisible = props.unlockProtectedVisible;
  const displayConditions = props.displayConditions;
  const onlyList = props.onlyList;
  // const key = catalogItemsObj._id;
  const key = props.passedKey;
  // const setExistingFormInputValuesObj = props.setExistingFormInputValuesObj;
  const parentKey = props.parentKey;
  const parentsParentKey = props.parentsParentKey;
  const parentMasterID = props.parentMasterID;
  const emptyForm = props.emptyForm;
  const [editedField, setEditedField] = useState(false);
  const dispatch = useDispatch();

  const addInputData = (e) => {
    e.preventDefault();
    const parentMasterID = e.target.getAttribute("parentmasterid");
    const parentKey = e.target.getAttribute("parentkey");
    const parentsParentKey = e.target.getAttribute("parentsParentKey");
    let title = e.target.getAttribute("title");
    let outputValue = e.target.value;

    if (parentMasterID !== parentKey) {
      if (parentMasterID === parentsParentKey) {
        outputValue = { [parentKey]: outputValue };
        title = parentKey;
      } else {
        outputValue = { [title]: outputValue };
        title = parentKey;
      }
    }

    if (emptyForm)
      dispatch(
        formInputDataActions.addToNewFormInputDataObj({
          parentMasterID,
          title,
          outputValue,
        })
      );

    if (!emptyForm)
      dispatch(
        formInputDataActions.addToExistingFormInputDataObj({
          parentMasterID,
          title,
          outputValue,
        })
      );
    setEditedField(true);
  };

  const output = (
    <li
      key={key}
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
        (editedField && !emptyForm && styles["edited-field"]) +
        " " +
        (emptyForm && styles["new-form-item"])
      }
    >
      {key === "_id" &&
        !onlyList &&
        displayConditions.hasOwnProperty("protectedHidden") &&
        displayConditions.protectedHidden.includes(key) && (
          <h4
            name={parentKey + "-" + key}
            className={
              styles[
                "protectedHidden-" +
                  (displayConditions &&
                    displayConditions.hasOwnProperty("protectedHidden") &&
                    displayConditions.protectedHidden.includes(key) &&
                    !showProtectedHidden.includes(parentMasterID))
              ] +
              " " +
              styles["_id"]
            }
          >
            {catalogItemsObj[key]}
          </h4>
        )}

      {key !== "_id" &&
        !onlyList &&
        displayConditions &&
        displayConditions.hasOwnProperty("isBoolean") &&
        !displayConditions.isBoolean.includes(key) &&
        !displayConditions.isDate.includes(key) &&
        !displayConditions.isURL.includes(key) && (
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
              category={catalogItemsObj[key]}
              placeholder={key}
              title={key}
              parentkey={parentKey}
              parentsparentkey={parentsParentKey ? parentsParentKey : ""}
              parentmasterid={parentMasterID}
              onChange={addInputData}
              defaultValue={catalogItemsObj[key]}
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
            />
          </Fragment>
        )}
      {!onlyList &&
        displayConditions &&
        displayConditions.hasOwnProperty("isURL") &&
        displayConditions.isURL.includes(key) && (
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
              type="url"
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
              defaultValue={catalogItemsObj[key]}
              category={key}
              placeholder={key}
              title={key}
              parentkey={parentKey}
              parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
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
            />
          </Fragment>
        )}
      {!onlyList &&
        displayConditions &&
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
              htmlFor={parentKey + "-" + key}
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
              defaultValue={catalogItemsObj[key]}
              category={key}
              placeholder={key}
              title={key}
              parentkey={parentKey}
              parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
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
              {" "}
              <option value={false}>False</option>
              <option value={true}>True</option>
            </select>
          </Fragment>
        )}
      {!onlyList &&
        displayConditions &&
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
              htmlFor={parentKey + "-" + key}
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
              placeholder={catalogItemsObj[key]}
              title={key}
              parentkey={parentKey}
              parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              parentmasterid={parentMasterID}
              onChange={addInputData}
              defaultValue={
                catalogItemsObj[key]
                  ? catalogItemsObj[key] &&
                    new Date(
                      new Date(catalogItemsObj[key]).getTime() -
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
      {onlyList && <span>{catalogItemsObj[key]}</span>}
    </li>
  );

  return output;
};

export default CatalogItem;
