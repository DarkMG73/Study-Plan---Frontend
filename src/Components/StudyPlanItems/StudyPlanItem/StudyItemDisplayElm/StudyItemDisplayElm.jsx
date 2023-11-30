import React, { Fragment } from "react";
import Styles from "./StudyItemDisplayElm.module.scss";
import ProgressBar from "./StudyItemInputs/ProgressBar/ProgressBar";
import Textarea from "./StudyItemInputs/Textarea/Textarea";
import InputURL from "./StudyItemInputs/InputURL/InputURL";
import InputDate from "./StudyItemInputs/InputDate/InputDate";
import InputBoolean from "./StudyItemInputs/InputBoolean/InputBoolean";
import InputDataList from "./StudyItemInputs/InputDataList/InputDataList";
import InputSuggestionList from "./StudyItemInputs/InputSuggestionList/InputSuggestionList";
import InputNumber from "./StudyItemInputs/InputNumber/InputNumber";
import InputFixedCompiledList from "./StudyItemInputs/InputFixedCompiledList/InputFixedCompiledList";
import OtherKeyFixedCompiledList from "./StudyItemInputs/InputOtherKeyFixedCompiledList/InputOtherKeyFixedCompiledList";
import InputLimitedList from "./StudyItemInputs/InputLimitedList/InputLimitedList";
import TextareaAutosize from "react-textarea-autosize";
import InputSlideButton from "./StudyItemInputs/InputSlideButton/InputSlideButton";

const StudyItemDisplayElm = (props) => {
  const {
    passedKey,
    elementTypeNeeded,
    studyPlanItemsObj,
    onlyList,
    parentKey,
    parentsParentKey,
    parentMasterID,
    showProtectedHidden,
    unlockProtectedVisible,
    displayConditions,
  } = props;

  const passedProps = {
    passedKey: passedKey,
    studyPlanItemsObj: studyPlanItemsObj,
    parentMasterID: parentMasterID,
    parentsParentKey: parentsParentKey,
    parentKey: parentKey,
    displayConditions: displayConditions,
    unlockProtectedVisible: unlockProtectedVisible,
  };

  let output = <Textarea {...passedProps} />;

  switch (elementTypeNeeded) {
    case "_id":
      output = (
        <h4
          name={parentKey + "-" + passedKey}
          className={
            Styles[
              "protectedHidden-" +
                (displayConditions &&
                  Object.hasOwn(displayConditions, "protectedHidden") &&
                  displayConditions.protectedHidden.includes(passedKey) &&
                  !showProtectedHidden.includes(parentMasterID))
            ] +
            " " +
            Styles["_id"]
          }
        ></h4>
      );
      break;
    case "progressbar":
      output = <ProgressBar {...passedProps} />;
      break;
    case "isURL":
      output = <InputURL {...passedProps} />;
      break;
    case "isNumber":
      output = <InputNumber {...passedProps} />;
      break;
    case "isBoolean":
      output = <InputBoolean {...passedProps} />;
      break;
    case "isList":
      output = <InputDataList {...passedProps} />;
      break;
    case "isSuggestionsList":
      output = <InputSuggestionList {...passedProps} />;
      break;
    case "isFixedCompiledList":
      output = <InputFixedCompiledList {...passedProps} />;
      break;
    case "isOtherKeyFixedCompiledList":
      output = <OtherKeyFixedCompiledList {...passedProps} />;
      break;
    case "isLimitedList":
      output = <InputLimitedList {...passedProps} />;
      break;
    case "isDate":
      output = <InputDate {...passedProps} />;
      break;
    case "forSlideButton":
      output = <InputSlideButton {...passedProps} />;
      break;
  }

  return output;
};

export default StudyItemDisplayElm;
