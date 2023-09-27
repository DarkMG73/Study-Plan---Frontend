import React from "react";
// import styles from "./StudyPlanItemsSubList.module.css";
import StudyPlanItemsList from "../StudyPlanItemsList/StudyPlanItemsList";

const StudyPlanItemsSubList = (props) => {
  return (
    <StudyPlanItemsList
      studyPlanItemsObj={props.studyPlanItemsObj}
      allStudyPlanItems={props.allStudyPlanItems}
      key={props.key}
      parentKey={props.parentKey}
      parentsParentKey={props.parentsParentKey}
      parentMasterID={props.parentMasterID}
      displayConditions={props.displayConditions}
      subListLevel={props.subListLevel ? props.subListLevel + 1 : 1}
      unlockProtectedVisible={props.unlockProtectedVisible}
      showProtectedHidden={props.showProtectedHidden}
      refresh={props.refresh}
      onlyList={props.onlyList}
      emptyForm={props.emptyForm}
    />
  );
};

export default StudyPlanItemsSubList;
