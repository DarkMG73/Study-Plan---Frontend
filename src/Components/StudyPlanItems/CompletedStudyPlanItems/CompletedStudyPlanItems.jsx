import React from "react";
import { useSelector } from "react-redux";
import StudyPlanItemsList from "../StudyPlanItemsList/StudyPlanItemsList";
import Styles from "./CompletedStudyPlanItems.module.scss";

const CompletedStudyPlanItems = (props) => {
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData
  );
  const filteredItems = {};
  if (studyPlanMetadata.hasOwnProperty("markcomplete")) {
    studyPlanMetadata.markcomplete.forEach((id) => {
      if (studyPlan.hasOwnProperty(id)) {
        if (
          studyPlan[id].hasOwnProperty("markcomplete") &&
          studyPlan[id].markcomplete &&
          studyPlan[id].markcomplete !== "false"
        )
          filteredItems[id] = { ...studyPlan[id] };
      }
    });
  }
  return (
    <div className={Styles["filtered-items-container"]}>
      CompletedStudyPlanItems
      {Object.keys(filteredItems).length > 0 && (
        <StudyPlanItemsList
          studyPlanItemsObj={filteredItems}
          allStudyPlanItems={studyPlan}
          parentKey={false}
          parentsParentKey={false}
          parentMasterID={false}
          displayConditions={props.displayConditions.formWithPreFilledData}
          user={props.user}
          section={"completed-items"}
        />
      )}
      {Object.keys(CompletedStudyPlanItems).length <= 0 && (
        <h3>There are no completed items. Time to get to work! :)</h3>
      )}
    </div>
  );
};

export default CompletedStudyPlanItems;
