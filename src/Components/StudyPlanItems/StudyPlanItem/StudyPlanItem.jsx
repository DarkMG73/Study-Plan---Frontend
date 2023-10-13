import React, { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./StudyPlanItem.module.scss";
import { formInputDataActions } from "../../../store/formInputDataSlice";
import ProgressBar from "@ramonak/react-progress-bar";
import SlideButton from "../../../UI/Buttons/Slide-Button/Slide-Button";
import { studyPlanDataActions } from "../../../store/studyPlanDataSlice";

const StudyPlanItem = (props) => {
  const studyPlanItemsObj = props.studyPlanItemsObj.studyPlanItemsObj;
  const user = useSelector((state) => state.auth.user);
  const studyPlanMetadata = useSelector(
    (state) => state.studyPlanData.studyPlanMetadata
  );
  const showProtectedHidden = props.showProtectedHidden;
  const unlockProtectedVisible = props.unlockProtectedVisible;
  const displayConditions = props.displayConditions;
  const onlyList = props.onlyList;
  // const key = studyPlanItemsObj._id;
  const key = props.passedKey;

  // const setExistingFormInputValuesObj = props.setExistingFormInputValuesObj;
  const parentKey = props.parentKey;
  const parentsParentKey = props.parentsParentKey;
  const parentMasterID = props.parentMasterID;
  const parentMasterType = props.parentMasterType;
  const emptyForm = props.emptyForm;
  const [editedField, setEditedField] = useState(false);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(studyPlanItemsObj[key] != false);
  const elementTypeNeeded = findElementType(key);

  ////////////////////////////////
  /// Handlers
  ////////////////////////////////
  const slideButtonHandler = (e) => {
    e.preventDefault();
    const itemWithNewEdits = { ...studyPlanItemsObj };
    const _id = itemWithNewEdits._id;
    itemWithNewEdits[key] = !studyPlanItemsObj[key];

    if (user) {
      setChecked(!checked);

      dispatch(
        studyPlanDataActions.updateOneStudyPlanItem({
          _id: _id,
          item: itemWithNewEdits,
        })
      );
      console.log("_id: ", _id);
      dispatch(
        studyPlanDataActions.updateStudyPlanDB({ itemWithNewEdits, user })
      );
      // updateAStudyPlanItem(dataObj, user);
    } else {
      alert("You must be logged in to be able to make changes.");
    }
  };

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

  ////////////////////////////////
  /// Functionality
  ////////////////////////////////

  function findElementType(itemKey) {
    const parentsParentKey = props.parentsParentKey;

    let output = "textarea";

    // ID & Progress Bar
    if (itemKey === "_id" || itemKey === "progressbar") {
      output = itemKey;
    } else {
      // Date
      if (
        displayConditions.hasOwnProperty("isDate") &&
        displayConditions.isDate.includes(key)
      )
        output = "isDate";

      // Boolean
      if (
        displayConditions.hasOwnProperty("isBoolean") &&
        displayConditions.isBoolean.includes(key)
      )
        output = "isBoolean";

      // Slide Button
      if (
        displayConditions.hasOwnProperty("forSlideButton") &&
        displayConditions.forSlideButton.includes(key)
      )
        output = "forSlideButton";

      // URL
      if (
        displayConditions.hasOwnProperty("isURL") &&
        displayConditions.isURL.includes(key)
      )
        output = "isURL";

      // Number
      if (
        displayConditions.hasOwnProperty("isNumber") &&
        displayConditions.isNumber.includes(key)
      )
        output = "isNumber";

      // Lists
      if (
        displayConditions.hasOwnProperty("isList") &&
        displayConditions.isList.includes(key)
      )
        output = "isList";
    }

    return output;
  }

  ////////////////////////////////
  /// Output
  ////////////////////////////////
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
        styles[parentMasterType] +
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
      {elementTypeNeeded === "_id" && !onlyList && (
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
          {studyPlanItemsObj[key]}
        </h4>
      )}
      {elementTypeNeeded === "progressbar" && (
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          >
            {key}:
          </label>

          <ProgressBar
            key={parentKey + "-" + key}
            completed={studyPlanItemsObj["status"]}
            className="wrapper"
            baseBgColor="transparent"
            bgColor="var(--spt-color-accent-light)"
            height="100%"
            width="100%"
            padding="0 1em 0 0"
            borderRadius="50px"
            labelAlignment
            labelColor="var(--spt-color-accent"
            labelSize="0.5em"
            animateOnRender={true}
            dir
            transitionDuration="3s"
            customLabelStyles={{ background: "transparent" }}
          />
        </Fragment>
      )}
      {!onlyList && elementTypeNeeded === "textarea" && (
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
            category={studyPlanItemsObj[key]}
            placeholder={false}
            title={key}
            parentkey={parentKey}
            parentsparentkey={parentsParentKey ? parentsParentKey : ""}
            parentmasterid={parentMasterID}
            onChange={addInputData}
            defaultValue={studyPlanItemsObj[key]}
            className={
              styles[
                "protectedVisible-" +
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions &&
                    displayConditions.hasOwnProperty("protectedVisible") &&
                    displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          />
        </Fragment>
      )}
      {!onlyList && elementTypeNeeded === "isURL" && (
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
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
            defaultValue={studyPlanItemsObj[key]}
            category={key}
            placeholder={"Valid URL only..."}
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          />
        </Fragment>
      )}
      {!onlyList && elementTypeNeeded === "isNumber" && (
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
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
            category={key}
            placeholder={"numbers only..."}
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          />
        </Fragment>
      )}
      {!onlyList && elementTypeNeeded === "isBoolean" && (
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
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
            defaultValue={studyPlanItemsObj[key]}
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
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
      {!onlyList && elementTypeNeeded === "isList" && (
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          >
            {key}:
          </label>
          <datalist
            id={parentKey + "-" + key + "datalist"}
            key={parentKey + "-" + key + "datalist"}
            name={parentKey + "-" + key + "datalist"}
            defaultValue={studyPlanItemsObj[key]}
            category={key}
            placeholder={key}
            title={key}
            parentkey={parentKey}
            parentsparentkey={
              parentsParentKey ? parentsParentKey.toString() : ""
            }
            parentmasterid={parentMasterID}
            className={
              styles[
                "protectedHidden-" +
                  displayConditions.protectedHidden.includes(key)
              ] +
              " " +
              styles[
                "protectedVisible-" +
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          >
            {studyPlanMetadata.hasOwnProperty(key) &&
              studyPlanMetadata[key].map((option) => (
                <option value={option}></option>
              ))}
          </datalist>
          <input
            type="text"
            list={parentKey + "-" + key + "datalist"}
            id={parentKey + "-" + key}
            name={parentKey + "-" + key}
            size="50"
            autocomplete="off"
            category={key}
            placeholder={"numbers only..."}
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          />
        </Fragment>
      )}
      {!onlyList && elementTypeNeeded === "isDate" && (
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
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
            parentsparentkey={
              parentsParentKey ? parentsParentKey.toString() : ""
            }
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          />
        </Fragment>
      )}
      {!onlyList && elementTypeNeeded === "forSlideButton" && (
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
                  (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                    !unlockProtectedVisible.includes(parentMasterID)) ||
                  (displayConditions.protectedVisible.includes(key) &&
                    !unlockProtectedVisible.includes(parentMasterID))
              ]
            }
          >
            {key}
          </label>
          <div className={styles["slider-button-wrap"]}>
            <SlideButton
              key={
                parentMasterID +
                "-" +
                parentsParentKey +
                "-" +
                parentKey +
                "-" +
                key
              }
              label={false}
              refresh={false}
              onClick={slideButtonHandler}
              checked={checked}
            />
          </div>
        </Fragment>
      )}

      {onlyList && <span>{studyPlanItemsObj[key]}</span>}
    </li>
  );

  return output;
};

export default StudyPlanItem;
