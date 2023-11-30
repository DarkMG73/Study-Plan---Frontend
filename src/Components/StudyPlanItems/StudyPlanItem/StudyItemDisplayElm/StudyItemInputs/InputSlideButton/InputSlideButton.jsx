import React, { useState, Fragment } from "react";
import Styles from "./InputSlideButton.module.scss";
import { useSelector, useDispatch } from "react-redux";
import SlideButton from "../../../../../../UI/Buttons/Slide-Button/Slide-Button";
import { studyPlanDataActions } from "../../../../../../store/studyPlanDataSlice";

const InputSlideButton = (props) => {
  const {
    passedKey,
    studyPlanItemsObj,
    parentMasterID,
    parentsParentKey,
    parentKey,
  } = props;
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const key = passedKey;
  const [checked, setChecked] = useState(studyPlanItemsObj[key] != false);

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
      >
        {key}
      </label>
      <div className={Styles["slider-button-wrap"]}>
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
  );
};

export default InputSlideButton;
