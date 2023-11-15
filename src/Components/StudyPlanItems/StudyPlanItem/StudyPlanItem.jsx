import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./StudyPlanItem.module.scss";
import { formInputDataActions } from "../../../store/formInputDataSlice";
import ProgressBar from "@ramonak/react-progress-bar";
import SlideButton from "../../../UI/Buttons/Slide-Button/Slide-Button";
import { studyPlanDataActions } from "../../../store/studyPlanDataSlice";

const StudyPlanItem = (props) => {
  const studyPlanItemsObj = props.studyPlanItemsObj.studyPlanItemsObj;
  const user = useSelector((state) => state.auth.user);
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData
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
  const setFormType = props.setFormType;
  // Delays functions until after typing
  let typingTimer = null;

  // Clears delay of functions until after typing

  ////////////////////////////////
  /// Effects
  ////////////////////////////////
  useEffect(() => {
    return () => {
      clearTimeout(typingTimer);
    };
  }, []);

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
        studyPlanDataActions.updateStudyPlanDB({ itemWithNewEdits, user })
      );
      // updateAStudyPlanItem(dataObj, user);
    } else {
      alert("You must be logged in to be able to make changes.");
    }
  };

  const addInputData = (e) => {
    e.preventDefault();
    const target = e.target;
    const outputValue = target.value;
    // Allows the form show only inputs needed by each type
    const parentMasterID = target.getAttribute("data-parentmasterid");
    let title = target.getAttribute("title");

    if (title === "type")
      document
        .getElementById(parentMasterID)
        .setAttribute("newFormType", outputValue);

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      if (outputValue) {
        groomAndAddInputData(target, parentMasterID, outputValue);
      }
    }, 2000);
  };

  ////////////////////////////////
  /// Functionality
  ////////////////////////////////
  function findElementType(itemKey) {
    const parentsParentKey = props.parentsParentKey;
    const checkIfNameInDisplayCond = (name, condition) => {
      if (Object.hasOwn(displayConditions, condition)) {
        if (Array.isArray(displayConditions[condition])) {
          return (
            Object.hasOwn(displayConditions, condition) &&
            displayConditions[condition].includes(name)
          );
        } else {
          return Object.keys(displayConditions[condition]).includes(name);
        }
      } else return false;
    };

    let output = "textarea";

    if (itemKey === "_id" || itemKey === "progressbar") {
      // ID & Progress Bar
      output = itemKey;
    } else {
      // Date
      if (checkIfNameInDisplayCond(key, "isDate")) output = "isDate";

      // Boolean
      if (checkIfNameInDisplayCond(key, "isBoolean")) output = "isBoolean";

      // Slide Button
      if (checkIfNameInDisplayCond(key, "forSlideButton"))
        output = "forSlideButton";

      // URL
      if (checkIfNameInDisplayCond(key, "isURL")) output = "isURL";

      // Number
      if (checkIfNameInDisplayCond(key, "isNumber")) output = "isNumber";

      // Lists
      if (checkIfNameInDisplayCond(key, "isList")) output = "isList";
      if (checkIfNameInDisplayCond(key, "isSuggestionsList"))
        output = "isSuggestionsList";
      if (checkIfNameInDisplayCond(key, "isLimitedList"))
        output = "isLimitedList";
      if (checkIfNameInDisplayCond(key, "isFixedCompiledList"))
        output = "isFixedCompiledList";
      if (checkIfNameInDisplayCond(key, "isOtherKeyFixedCompiledList"))
        output = "isOtherKeyFixedCompiledList";
    }

    return output;
  }

  let defaultDateValue = new Date("yyyy-MM-ddThh:mm");
  if (elementTypeNeeded === "isDate") {
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

  const optionsList = [];
  if (elementTypeNeeded === "isOtherKeyFixedCompiledList") {
    // Create array of objects without parent
    const fullOptionsArray = Object.values(studyPlan).filter((value) => {
      // Get rid of parent item from list
      if (studyPlanItemsObj.name === value.name) return false;
      return true;
    });

    // Determine data needed
    const keyToDisplay =
      displayConditions.isOtherKeyFixedCompiledList[key].keyToDisplay;
    const keyForOptionValue =
      displayConditions.isOtherKeyFixedCompiledList[key].keyToSave;

    // Alpha sort ascending then by type descending (Goals first)
    const sortedFullOptionsArray = fullOptionsArray
      .sort((a, b) => {
        if (!Object.hasOwn(a, "name") || !Object.hasOwn(b, "name")) return 0;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        return 0;
      })
      .sort((a, b) => {
        if (!Object.hasOwn(a, "type") || !Object.hasOwn(b, "type")) return 0;
        if (a.type.toLowerCase() > b.type.toLowerCase()) return 1;
        if (a.type.toLowerCase() < b.type.toLowerCase()) return -1;
        return 0;
      });

    // Create the JSX
    sortedFullOptionsArray.forEach((optionObj) => {
      if (!Object.hasOwn(optionObj, "type")) return false;
      optionsList.push(
        <option
          key={optionObj[keyForOptionValue]}
          value={optionObj[keyForOptionValue]}
        >
          {optionObj.type.toUpperCase()}: {optionObj[keyToDisplay]}
        </option>
      );
    });
  }

  function groomAndAddInputData(target, parentMasterID, outputValue) {
    const parentKey = target.getAttribute("data-parentkey");
    const parentsParentKey = target.getAttribute("parentsParentKey");
    let title = target.getAttribute("title");

    if (parentMasterID !== parentKey) {
      if (parentMasterID === parentsParentKey) {
        outputValue = { [parentKey]: outputValue };
        title = parentKey;
      } else {
        outputValue = { [title]: outputValue };
        title = parentKey;
      }
    }

    setTimeout(() => {
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
    }, 500);

    if (!editedField) setEditedField(true);
  }
  ////////////////////////////////
  /// Output
  ////////////////////////////////
  const output = (
    <Fragment>
      <li
        key={
          key +
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
        data-marker="CATALOG-ITEM"
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
        data-parentmastertype={parentMasterType}
        data-category={studyPlanItemsObj[key]}
        data-parentkey={parentKey}
        data-parentsparentkey={parentsParentKey ? parentsParentKey : ""}
        data-parentmasterid={parentMasterID}
        className={
          styles.item +
          " " +
          styles[
            "protectedHidden-" +
              (displayConditions &&
                Object.hasOwn(displayConditions, "protectedHidden") &&
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
                    Object.hasOwn(displayConditions, "protectedHidden") &&
                    displayConditions.protectedHidden.includes(key) &&
                    !showProtectedHidden.includes(parentMasterID))
              ] +
              " " +
              styles["_id"]
            }
          ></h4>
        )}{" "}
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

            <ProgressBar
              key={parentKey + "-" + key}
              completed={+studyPlanItemsObj["status"]}
              maxCompleted="100"
              className="wrapper"
              baseBgColor="transparent"
              bgColor="var(--spt-color-accent-light)"
              height="100%"
              width="100%"
              padding="0 1em 0 0"
              borderRadius="50px"
              labelAlignment="center"
              labelColor="var(--spt-color-accent"
              labelSize="0.5em"
              animateOnRender={true}
              dir="auto"
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
              data-category={studyPlanItemsObj[key]}
              placeholder={""}
              title={key}
              data-parentkey={parentKey}
              data-parentsparentkey={parentsParentKey ? parentsParentKey : ""}
              data-parentmasterid={parentMasterID}
              onChange={addInputData}
              defaultValue={studyPlanItemsObj[key]}
              className={
                styles[
                  "protectedVisible-" +
                    (displayConditions.protectedVisible.includes(
                      "PROTECT-ALL"
                    ) && !unlockProtectedVisible.includes(parentMasterID)) ||
                    (displayConditions &&
                      Object.hasOwn(displayConditions, "protectedVisible") &&
                      displayConditions.protectedVisible.includes(key) &&
                      !unlockProtectedVisible.includes(parentMasterID))
                ]
              }
            />
          </Fragment>
        )}
        {!onlyList && elementTypeNeeded === "isURL" && (
          <Fragment>
            <a
              id={
                "arrow" +
                parentMasterID +
                "-" +
                parentsParentKey +
                "-" +
                parentKey +
                "-" +
                key +
                "url"
              }
              key={"arrow" + parentKey + "-" + key}
              href={studyPlanItemsObj[key]}
              rel="noreferrer"
              target="_blank"
              name={parentKey + "-" + key}
              defaultValue={studyPlanItemsObj[key]}
              data-category={key}
              placeholder={"Valid URL only..."}
              title={key}
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
              className={
                styles["url-arrow"] +
                " " +
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
              Go &rarr;
            </a>
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
              defaultValue={studyPlanItemsObj[key]}
              data-category={key}
              placeholder={"Valid URL only..."}
              title={key}
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
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
              onChange={addInputData}
              min={displayConditions.isNumber[key].min * 1}
              max={displayConditions.isNumber[key].max}
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
              defaultValue={studyPlanItemsObj[key]}
              data-category={key}
              placeholder={key}
              title={key}
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
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
              <option key={"false-set"} value={false}>
                False
              </option>
              <option key={"true-set"} value={true}>
                True
              </option>
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
              htmlFor={parentKey + "-" + key + "datalist"}
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
            <datalist
              id={parentKey + "-" + key + "datalist"}
              key={parentKey + "-" + key + "datalist"}
              name={parentKey + "-" + key + "datalist"}
              defaultValue={studyPlanItemsObj[key]}
              data-category={key}
              placeholder={key}
              title={key}
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
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
              {Object.hasOwn(studyPlanMetadata, key) &&
                studyPlanMetadata[key]
                  .slice(1)
                  .map((option) => (
                    <option key={option} value={option}></option>
                  ))}
            </datalist>
            {/*name={parentKey + "-" + key}*/}
            <input
              type="text"
              list={parentKey + "-" + key + "datalist"}
              id={parentKey + "-" + key}
              size="50"
              autoComplete="off"
              data-category={key}
              placeholder={""}
              title={key}
              name={parentKey + "-" + key + "datalist"}
              defaultValue={studyPlanItemsObj[key]}
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
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
        {!onlyList && elementTypeNeeded === "isSuggestionsList" && (
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
              htmlFor={parentKey + "-" + key + "datalist"}
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
            </label>{" "}
            {/*name={parentKey + "-" + key}*/}
            <input
              type="text"
              list={parentKey + "-" + key + "datalist"}
              id={parentKey + "-" + key}
              size="50"
              autoComplete="off"
              data-category={key}
              placeholder={""}
              title={key}
              name={parentKey + "-" + key + "datalist"}
              defaultValue={studyPlanItemsObj[key]}
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
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
            <datalist
              id={parentKey + "-" + key + "datalist"}
              key={parentKey + "-" + key + "datalist"}
              name={parentKey + "-" + key + "datalist"}
              defaultValue={studyPlanItemsObj[key]}
              data-category={key}
              placeholder={key}
              title={key}
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
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
              {Object.values(displayConditions["isSuggestionsList"][key]).map(
                (option) => (
                  <option key={option} value={option}></option>
                )
              )}

              {Object.hasOwn(studyPlanMetadata, key) &&
                studyPlanMetadata[key].slice(1).map((option) => {
                  if (
                    !displayConditions["isSuggestionsList"][key].includes(
                      option
                    )
                  )
                    return <option key={option} value={option}></option>;
                })}
            </datalist>
          </Fragment>
        )}
        {!onlyList && elementTypeNeeded === "isFixedCompiledList" && (
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
              defaultValue={studyPlanItemsObj[key]}
              data-category={key}
              placeholder={key}
              title
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
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
              {Object.hasOwn(studyPlanMetadata, key) &&
                studyPlanMetadata[key].slice(1).map((option) => (
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
                ))}
            </select>
          </Fragment>
        )}
        {!onlyList && elementTypeNeeded === "isOtherKeyFixedCompiledList" && (
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
              defaultValue={studyPlanItemsObj[key]}
              data-category={key}
              placeholder={key}
              title={key}
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
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
              <option key="-Select One-" value="">
                -Select One-
              </option>

              {optionsList.map((option) => option)}
            </select>
          </Fragment>
        )}
        {!onlyList && elementTypeNeeded === "isLimitedList" && (
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
              defaultValue={studyPlanItemsObj[key]}
              data-category={key}
              placeholder={key}
              title={key}
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
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
              data-parentkey={parentKey}
              data-parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              data-parentmasterid={parentMasterID}
              onChange={addInputData}
              defaultValue={defaultDateValue}
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
                    (displayConditions.protectedVisible.includes(
                      "PROTECT-ALL"
                    ) && !unlockProtectedVisible.includes(parentMasterID)) ||
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
                label={""}
                refresh={false}
                onClick={slideButtonHandler}
                checked={checked}
              />
            </div>
          </Fragment>
        )}
        {onlyList && <span>{studyPlanItemsObj[key]}</span>}
      </li>
      {
        // The main URL link needs to be on its own for grid placement
      }
      {elementTypeNeeded === "isURL" && key === "url" && (
        <li
          id={
            "arrow" +
            parentMasterID +
            "-" +
            parentsParentKey +
            "-" +
            parentKey +
            "-" +
            key +
            "url"
          }
          key={"arrow" + parentKey + "-" + key}
          className={
            styles["featured-url-arrow-wrap"] +
            " " +
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
          <a
            href={studyPlanItemsObj[key]}
            rel="noreferrer"
            target="_blank"
            key={parentKey + "-" + key}
            name={parentKey + "-" + key}
            defaultValue={studyPlanItemsObj[key]}
            data-category={key}
            placeholder={"Valid URL only..."}
            title={key}
            data-parentkey={parentKey}
            data-parentsparentkey={
              parentsParentKey ? parentsParentKey.toString() : ""
            }
            data-parentmasterid={parentMasterID}
            className={
              styles["button"] +
              " " +
              styles["featured-url-arrow"] +
              " " +
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
            Go &rarr;
          </a>
        </li>
      )}{" "}
    </Fragment>
  );

  return output;
};

export default StudyPlanItem;
