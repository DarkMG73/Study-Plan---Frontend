import { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import styles from "./StudyPlanItem.module.scss";
import StudyItemDisplayElm from "./StudyItemDisplayElm/StudyItemDisplayElm";
import ArrowLink from "./StudyItemDisplayElm/StudyItemInputs/ArrowLink/ArrowLink";

const StudyPlanItem = (props) => {
  const {
    displayConditions,
    passedKey,
    parentKey,
    parentsParentKey,
    parentMasterID,
    parentMasterType,
    section,
    showProtectedHidden,
    emptyForm,
    onlyList,
    unlockProtectedVisible,
  } = props;

  const { expandedItems } = useSelector((state) => state.studyPlanData);
  const studyPlanItemsObj = props.studyPlanItemsObj.studyPlanItemsObj;
  const [editedField, setEditedField] = useState(false);
  const displayedWhenNotExpanded = [
    "name",
    "method",
    "priority",
    "_id",
    "progressbar",
  ];
  function findElementType(itemKey) {
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
      if (checkIfNameInDisplayCond(passedKey, "isDate")) output = "isDate";

      // Boolean
      if (checkIfNameInDisplayCond(passedKey, "isBoolean"))
        output = "isBoolean";

      // Slide Button
      if (checkIfNameInDisplayCond(passedKey, "forSlideButton"))
        output = "forSlideButton";

      // URL
      if (checkIfNameInDisplayCond(passedKey, "isURL")) output = "isURL";

      // Number
      if (checkIfNameInDisplayCond(passedKey, "isNumber")) output = "isNumber";

      // Lists
      if (checkIfNameInDisplayCond(passedKey, "isList")) output = "isList";
      if (checkIfNameInDisplayCond(passedKey, "isSuggestionsList"))
        output = "isSuggestionsList";
      if (checkIfNameInDisplayCond(passedKey, "isLimitedList"))
        output = "isLimitedList";
      if (checkIfNameInDisplayCond(passedKey, "isFixedCompiledList"))
        output = "isFixedCompiledList";
      if (checkIfNameInDisplayCond(passedKey, "isOtherKeyFixedCompiledList"))
        output = "isOtherKeyFixedCompiledList";
    }

    return output;
  }
  const elementTypeNeeded = findElementType(passedKey);

  // Clears delay of functions until after typing

  const keyToCheck =
    section && section.includes("goal")
      ? studyPlanItemsObj._id
      : parentMasterID;

  const output = (
    <Fragment>
      {((parentMasterID && parentMasterID.includes("newForm")) ||
        (section && section.includes("editor-in-modal")) ||
        displayedWhenNotExpanded.includes(passedKey) ||
        (expandedItems &&
          Object.hasOwn(expandedItems, section) &&
          expandedItems[section].includes(keyToCheck))) && (
        <li
          key={
            passedKey +
            parentMasterID +
            "-" +
            parentsParentKey +
            "-" +
            parentKey +
            "-" +
            passedKey +
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
            passedKey +
            "-" +
            "item"
          }
          data-parentmastertype={parentMasterType}
          data-category={studyPlanItemsObj[passedKey]}
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
                  displayConditions.protectedHidden.includes(passedKey) &&
                  !showProtectedHidden.includes(parentMasterID))
            ] +
            " " +
            styles[
              "protectedVisible-" +
                (displayConditions.protectedVisible.includes("PROTECT-ALL") &&
                  !unlockProtectedVisible.includes(parentMasterID)) ||
                (displayConditions.protectedVisible.includes(passedKey) &&
                  !unlockProtectedVisible.includes(parentMasterID))
            ] +
            " " +
            styles[parentKey] +
            " " +
            styles[parentMasterType] +
            " " +
            styles[parentKey + "-" + passedKey] +
            " " +
            styles[passedKey] +
            " " +
            (editedField && !emptyForm && styles["edited-field"]) +
            " " +
            (emptyForm && styles["new-form-item"])
          }
        >
          <StudyItemDisplayElm
            key={
              passedKey +
              parentMasterID +
              "-" +
              parentsParentKey +
              "-" +
              parentKey +
              "-" +
              passedKey +
              "-" +
              "studyItemElm"
            }
            passedKey={passedKey}
            elementTypeNeeded={elementTypeNeeded}
            studyPlanItemsObj={studyPlanItemsObj}
            onlyList={onlyList}
            section={section}
            parentKey={parentKey}
            parentsParentKey={parentsParentKey}
            parentMasterID={parentMasterID}
            showProtectedHidden={showProtectedHidden}
            unlockProtectedVisible={unlockProtectedVisible}
            displayConditions={displayConditions}
            editedField={editedField}
            setEditedField={setEditedField}
            emptyForm={emptyForm}
          />

          {onlyList && <span>{studyPlanItemsObj[passedKey]}</span>}
        </li>
      )}
      {elementTypeNeeded === "isURL" && passedKey === "url" && (
        <ArrowLink
          passedKey={passedKey}
          studyPlanItemsObj={studyPlanItemsObj}
          parentMasterID={parentMasterID}
          parentsParentKey={parentsParentKey}
          parentKey={parentKey}
          displayConditions={displayConditions}
          unlockProtectedVisible={unlockProtectedVisible}
        />
      )}
    </Fragment>
  );

  return output;
};

export default StudyPlanItem;
