import StudyPlanItemsList from "../StudyPlanItemsList/StudyPlanItemsList";

const StudyPlanItemsSubList = (props) => {
  return (
    <StudyPlanItemsList
      studyPlanItemsObj={props.studyPlanItemsObj}
      allStudyPlanItems={props.allStudyPlanItems}
      key={props.parentMasterID + "in-sub--1"}
      section={props.section}
      parentKey={props.parentKey}
      parentsParentKey={props.parentsParentKey}
      parentMasterID={props.parentMasterID}
      displayConditions={props.displayConditions}
      subListLevel={props.subListLevel ? props.subListLevel + 1 : 1}
      unlockProtectedVisible={props.unlockProtectedVisible}
      showProtectedHidden={props.showProtectedHidden}
      refresh={props.refresh}
      onlyList={props.onlyList}
      noEditButton={props.noEditButton}
      emptyForm={props.emptyForm}
      setFormType={props.setFormType}
    />
  );
};

export default StudyPlanItemsSubList;
