import React from "react";
import { useSelector } from "react-redux";
import StudyPlanItemsList from "../StudyPlanItemsList/StudyPlanItemsList";
import Styles from "./FilteredStudyPlanItems.module.scss";

const CompletedStudyPlanItems = (props) => {
  const studyPlanMetadata = useSelector(
    (state) => state.studyPlanData.studyPlanMetadata
  );
  const studyPlanSet = props.studyPlanSet ? props.studyPlanSet : {};
  const filterKey = props.filterKey;

  const filteredItems = {};

  Object.values(studyPlanSet).forEach((value) => {
    if (
      Object.hasOwn(value, filterKey) &&
      value[filterKey] &&
      value[filterKey] !== "false"
    )
      filteredItems[value._id] = { ...value };
  });

  return (
    <div
      key={"filtered-items-container-" + Object.keys(filteredItems).toString()}
      id={"filtered-items-container-" + Object.keys(filteredItems).toString()}
      className={Styles["filtered-items-container"]}
    >
      <h3 className={"subtitle " + Styles["filtered-items-title"]}>
        {props.sectionTitle}
      </h3>
      <p className={Styles["filtered-items-sub-text"]}>
        {props.sectionSubText}
      </p>
      {Object.keys(filteredItems).length > 0 && (
        <StudyPlanItemsList
          key={props.section + Object.keys(filteredItems).toString()}
          studyPlanItemsObj={filteredItems}
          allStudyPlanItems={studyPlanSet}
          parentKey={false}
          parentsParentKey={false}
          parentMasterID={false}
          displayConditions={props.displayConditions.formWithPreFilledData}
          user={props.user}
          section={props.section}
        />
      )}
      {Object.keys(filteredItems).length <= 0 && props.messageIfNone && (
        <p className={Styles["no-items-text"]}>{props.messageIfNone}</p>
      )}
      {Object.keys(filteredItems).length <= 0 && !props.messageIfNone && (
        <p className={Styles["no-items-text"]}>There are no items here yet.</p>
      )}
    </div>
  );
};

export default CompletedStudyPlanItems;
