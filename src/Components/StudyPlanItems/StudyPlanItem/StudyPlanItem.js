import React, { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./StudyPlanItem.module.css";
import { formInputDataActions } from "../../../store/formInputDataSlice";
import ProgressBar from "@ramonak/react-progress-bar";
import SlideButton from "../../../UI/Buttons/Slide-Button/Slide-Button";
import { studyPlanDataActions } from "../../../store/studyPlanDataSlice";
import { updateAStudyPlanItem } from "../../../storage/studyPlanDB";

const StudyPlanItem = (props) => {
  const studyPlanItemsObj = props.studyPlanItemsObj.studyPlanItemsObj;
  const user = useSelector((state) => state.auth.user);
  console.log(
    "%c --> %cline:12%cuser",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
    user
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
  const emptyForm = props.emptyForm;
  const [editedField, setEditedField] = useState(false);
  const dispatch = useDispatch();
  const slideButtonHandlerOLD = (e) => {
    e.preventDefault();

    const itemWithNewEdits = { ...studyPlanItemsObj };
    console.log(
      "%c --> %cline:28%citemWithNewEdits",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(114, 83, 52);padding:3px;border-radius:2px",
      itemWithNewEdits
    );

    const itemIdentifier = itemWithNewEdits.identifier;
    console.log(
      "%c --> %cline:37%citemIdentifier",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
      itemIdentifier
    );
    itemWithNewEdits[key] = !studyPlanItemsObj[key];
    console.log(
      "%c --> %cline:31%citemWithNewEdits",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
      itemWithNewEdits
    );
    // updateAStudyPlanItem(itemIdentifier, itemWithNewEdits, user).then((res) => {
    // const status = res.status ? res.status : res.response.status;
    // if (status >= 400) {
    //   alert("There was an error: " + res.response.data.message);
    // } else if (status >= 200) {
    //   alert("Success! The item has been updated.");
    //   // setInEditMode(false);
    // } else {
    //   alert("there was an error: " + +res.message);
    // }
    // }
    // );
  };

  const slideButtonHandler = (e) => {
    e.preventDefault();
    console.log(
      "%c --> %cline:12%cuser",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
      user
    );
    const itemWithNewEdits = { ...studyPlanItemsObj };
    console.log(
      "%c --> %cline:28%citemWithNewEdits",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(114, 83, 52);padding:3px;border-radius:2px",
      itemWithNewEdits
    );

    const _id = itemWithNewEdits._id;
    console.log(
      "%c --> %cline:37%citem_id",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
      _id
    );
    console.log(
      "%c --> %cline:87%cstudyPlanItemsObj[key]",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
      studyPlanItemsObj[key]
    );
    console.log(
      "%c --> %cline:92%ckey",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px",
      key
    );
    itemWithNewEdits[key] = !studyPlanItemsObj[key];

    console.log(
      "%c --> %cline:31%citemWithNewEdits",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
      itemWithNewEdits
    );

    if (user) {
      dispatch(
        studyPlanDataActions.updateOneStudyPlanItem({
          _id: _id,
          item: itemWithNewEdits,
        })
      );
      // dispatch(studyPlanDataActions.updateStudyPlanDB(true));
      const dataObj = itemWithNewEdits;
      updateAStudyPlanItem(dataObj, user);
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
            {studyPlanItemsObj[key]}
          </h4>
        )}
      {key === "progressbar" && (
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
      {key !== "_id" &&
        key !== "progressbar" &&
        !onlyList &&
        displayConditions &&
        displayConditions.hasOwnProperty("isBoolean") &&
        !displayConditions.isBoolean.includes(key) &&
        !displayConditions.isDate.includes(key) &&
        !displayConditions.isURL.includes(key) &&
        displayConditions.hasOwnProperty("forSlideButton") &&
        !displayConditions.forSlideButton.includes(key) && (
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
              placeholder={key}
              title={key}
              parentkey={parentKey}
              parentsparentkey={parentsParentKey ? parentsParentKey : ""}
              parentmasterid={parentMasterID}
              onChange={addInputData}
              defaultValue={studyPlanItemsObj[key]}
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
        displayConditions.isBoolean.includes(key) &&
        displayConditions.hasOwnProperty("forSlideButton") &&
        displayConditions.forSlideButton.includes(key) && (
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
        displayConditions.hasOwnProperty("forSlideButton") &&
        displayConditions.forSlideButton.includes(key) && (
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
            <SlideButton
              key={parentKey + "-" + key}
              label={"something"}
              refresh={Math.random(10)}
              onClick={slideButtonHandler}
              checked={studyPlanItemsObj[key]}
            />

            <input type="checkbox" name={parentKey + "-" + key} />

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
              name={parentKey + "-" + key}
              type="checkbox"
              title={key}
              parentkey={parentKey}
              parentsparentkey={
                parentsParentKey ? parentsParentKey.toString() : ""
              }
              parentmasterid={parentMasterID}
              onChange={addInputData}
            />
          </Fragment>
        )}

      {onlyList && <span>{studyPlanItemsObj[key]}</span>}
    </li>
  );

  return output;
};

export default StudyPlanItem;
