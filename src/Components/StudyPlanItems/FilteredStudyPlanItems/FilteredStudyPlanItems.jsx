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
  console.log(
    "%c --> %cline:10%cstudyPlanSet",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px",
    studyPlanSet
  );
  const filteredItems = {};
  if (studyPlanMetadata.hasOwnProperty(filterKey)) {
    studyPlanMetadata[filterKey].forEach((id) => {
      if (studyPlanSet.hasOwnProperty(id)) {
        if (
          studyPlanSet[id].hasOwnProperty(filterKey) &&
          studyPlanSet[id][filterKey] &&
          studyPlanSet[id][filterKey] !== "false"
        )
          filteredItems[id] = { ...studyPlanSet[id] };
      }
    });
  }
  return (
    <div className={Styles["filtered-items-container"]}>
      <h3 className={"subtitle " + Styles["filtered-items-title"]}>
        {props.sectionTitle}
      </h3>
      <p className={Styles["filtered-items-sub-text"]}>
        {props.sectionSubText}
      </p>
      {Object.keys(filteredItems).length > 0 && (
        <StudyPlanItemsList
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
