import Styles from "./NewStudyPlanForm.module.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import StudyPlanItemsList from "../Components/StudyPlanItems/StudyPlanItemsList/StudyPlanItemsList";
import displayConditions from "../data/displayConditionsObj.js";
import { formInputDataActions } from "../store/formInputDataSlice";
import { loadingRequestsActions } from "../store/loadingRequestsSlice";
import useDemoCheck from "../Hooks/useDemoCheck";
import StudyPlanItemsList from "./StudyPlanItemsList/StudyPlanItemsList";

const NewStudyPlanForm = (props) => {
  const dispatch = useDispatch();
  const demoCheck = useDemoCheck();
  const isDemo = demoCheck();
  const [newFormJSX, setNewFormJSX] = useState(false);
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema,
  );
  const [formType, setFormType] = useState("all");
  const passedE = props.e;
  const setNewFormInputValuesObj = props.setNewFormInputValuesObj;
  const id = props.id;
  const user = props.user;

  ////////////////////////////////////////////////////////////////
  /// Handlers
  ////////////////////////////////////////////////////////////////
  const submitNewFormButtonHandler = (e) => {
    e.preventDefault();
    if (isDemo) {
      alert(isDemo);
      return;
    }
    dispatch(loadingRequestsActions.addToLoadRequest());

    // Allow a pause to ensure input data is fully updated to existing form state
    setTimeout(() => {
      dispatch(formInputDataActions.submitAllNewForms());
      dispatch(loadingRequestsActions.removeFromLoadRequest());
    }, 2000);
  };

  const cancelFormButtonHandler = (e) => {
    e.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to cancel this form without saving? All data entered here will be lost.",
    );
    if (confirm) {
      const key = e.target.value;
      const targetElm = document.getElementById(key);
      targetElm.style.display = "none";
      setNewFormInputValuesObj((prevState) => {
        const outputObj = { ...prevState };

        delete outputObj[key];
        return outputObj;
      });
    }
  };

  const cancelAllFormsButtonHandler = (e) => {
    e.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to cancel this form without saving? All data entered here will be lost.",
    );
    if (confirm) setNewFormJSX(false);
  };

  ////////////////////////////////////////////////////////////////
  /// Functionality
  ////////////////////////////////////////////////////////////////
  const parentMasterID = passedE.target.getAttribute("data-parentmasterid");
  const amountToAdd = prompt("How many would you like to add?");
  if (amountToAdd <= 0) return false;
  const processNewFormWithSchema = (schema) => {
    const targetFormDataObj = schema;
    // const itemsToRemove = ['$timestamps', ]
    const cleansedFormData = {};
    Object.keys(targetFormDataObj).forEach((key) => {
      cleansedFormData[key] = "";
    });

    const additionalFormElm = function () {
      const output = [];

      for (let i = 0; i < amountToAdd; i++) {
        output.push(
          <div
            key={parentMasterID + "newForm-" + i}
            id={"newForm-" + i}
            data-parentmasterid={"newForm-" + i}
            className={Styles["new-form-" + i] + " " + Styles["new-form"]}
            data-formtype={"type-" + formType}
          >
            <button
              key={parentMasterID + "newForm-" + i + "button"}
              className={
                Styles["new-form-button"] +
                " " +
                Styles["cancel-single-form-button"]
              }
              value={"newForm-" + i}
              onClick={cancelFormButtonHandler}
            >
              X
            </button>
            <h2
              id={parentMasterID}
              className={Styles["group-title"] + " " + Styles[parentMasterID]}
            >
              &nbsp; Entry {i + 1}
            </h2>
            <ul
              key={parentMasterID + "newForm-" + i}
              id={"newForm-" + i + "-wrap"}
              data-parentmasterid={"newForm-" + i}
              className={
                Styles["new-form-" + i + "-wrap"] +
                " " +
                Styles["new-form-inner-wrap"]
              }
            >
              {cleansedFormData && (
                <StudyPlanItemsList
                  key={parentMasterID + "newForm-" + i}
                  studyPlanItemsObj={cleansedFormData}
                  id={"newForm-" + i}
                  parentKey={id}
                  displayConditions={displayConditions.emptyForm}
                  parentMasterID={"newForm-" + i}
                  user={user}
                  emptyForm={true}
                  inModal={true}
                  setFormType={setFormType}
                />
              )}
            </ul>
          </div>,
        );
      }
      return output;
    };

    const groomedNewFormElement = (
      <ul
        key={parentMasterID}
        className={
          Styles.subgroup +
          " " +
          Styles["subgroup-" + parentMasterID] +
          " " +
          Styles[parentMasterID] +
          " " +
          Styles["in-modal"] +
          " " +
          Styles["new-form"]
        }
      >
        {" "}
        <h2
          id={parentMasterID}
          className={Styles["group-title"] + " " + Styles[parentMasterID]}
        >
          &nbsp;{parentMasterID && parentMasterID.toUpperCase()}
        </h2>{" "}
        <button
          className={
            Styles["new-form-button"] + " " + Styles["cancel-all-forms-button"]
          }
          onClick={cancelAllFormsButtonHandler}
        >
          Cancel All Forms
        </button>
        {additionalFormElm()}
        <button
          className={Styles["new-form-button"]}
          value={parentMasterID}
          onClick={submitNewFormButtonHandler}
        >
          Submit to <span>{parentMasterID}</span> &rarr;
        </button>
      </ul>
    );
    setNewFormJSX(groomedNewFormElement);
  };

  processNewFormWithSchema(studyPlanItemSchema);

  return (
    <div>
      {Object.keys(formInputData).length > 0 && (
        <StudyPlanItemsList
          key={"spi-list" + id}
          studyPlanItemsObj={formInputData}
          allStudyPlanItems={allStudyPlanItems}
          parentKey={false}
          parentsParentKey={false}
          parentMasterID={false}
          displayConditions={displayConditions.formWithPreFilledData}
          user={props.user}
          section={id}
          onlyList={props.onlyList}
          noEditButton={props.noEditButton}
          refresh={refresh}
        />
      )}
    </div>
  );
};

export default NewStudyPlanForm;
