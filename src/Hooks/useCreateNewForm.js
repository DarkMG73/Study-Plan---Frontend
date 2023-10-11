import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSchemaForStudyPlanItem } from "../storage/studyPlanDB";
import { getSchemaForContentItem } from "../storage/contentDB";
import StudyPlanItemsList from "../Components/StudyPlanItems/StudyPlanItemsList/StudyPlanItemsList";
import displayConditions from "../data/displayConditionsObj.js";
import { formInputDataActions } from "../store/formInputDataSlice";

const useCreateNewForm = () => {
  const dispatch = useDispatch();
  const studyPlanMetadata = useSelector(
    (state) => state.studyPlanData.studyPlanMetadata
  );
  const outputFunction = (props) => {
    const e = props.e;
    const styles = props.styles;
    const setNewFormJSX = props.setNewFormJSX;
    const setNewFormInputValuesObj = props.setNewFormInputValuesObj;
    const id = props.id;
    const user = props.user;
    const getSchema =
      id === "studyPlan" ? getSchemaForStudyPlanItem : getSchemaForContentItem;
    ////////////////////////////////////////////////////////////////
    /// Handlers
    ////////////////////////////////////////////////////////////////
    const submitNewFormButtonHandler = (e) => {
      e.preventDefault();

      dispatch(formInputDataActions.submitAllNewForms());
    };

    const cancelFormButtonHandler = (e) => {
      e.preventDefault();
      const confirm = window.confirm(
        "Are you sure you want to cancel this form without saving? All data entered here will be lost."
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
        "Are you sure you want to cancel this form without saving? All data entered here will be lost."
      );
      if (confirm) setNewFormJSX(false);
    };

    ////////////////////////////////////////////////////////////////
    /// Functionality
    ////////////////////////////////////////////////////////////////
    const parentMasterID = e.target.getAttribute("parentmasterid");
    const amountToAdd = prompt("How many would you like to add?");

    getSchema().then((data) => {
      const targetFormDataObj = data.obj;
      // const itemsToRemove = ['$timestamps', ]
      const cleansedFormData = {};
      Object.keys(targetFormDataObj).forEach((key) => {
        cleansedFormData[key] = "";
      });

      const additionalFormElm = function () {
        const output = [];

        for (let i = 0; i < amountToAdd; i++) {
          output.push(
            <ul
              id={"newForm-" + i}
              parentmasterid={"newForm-" + i}
              className={styles["new-form-" + i] + " " + styles["new-form"]}
            >
              <button
                className={
                  styles["new-form-button"] +
                  " " +
                  styles["cancel-single-form-button"]
                }
                value={"newForm-" + i}
                onClick={cancelFormButtonHandler}
              >
                X
              </button>
              <h2
                id={parentMasterID}
                className={styles["group-title"] + " " + styles[parentMasterID]}
              >
                &nbsp; Entry {i + 1}
              </h2>

              {cleansedFormData && (
                <StudyPlanItemsList
                  studyPlanItemsObj={cleansedFormData}
                  id={"newForm-" + i}
                  parentKey={id}
                  displayConditions={displayConditions.emptyForm}
                  parentMasterID={"newForm-" + i}
                  user={user}
                  emptyForm={true}
                  inModal={true}
                />
              )}
            </ul>
          );
        }
        return output;
      };

      const groomedNewFormElement = (
        <ul
          className={
            styles.subgroup +
            " " +
            styles["subgroup-" + parentMasterID] +
            " " +
            styles[parentMasterID] +
            " " +
            styles["in-modal"] +
            " " +
            styles["new-form"]
          }
        >
          {" "}
          <h2
            id={parentMasterID}
            className={styles["group-title"] + " " + styles[parentMasterID]}
          >
            &nbsp;{parentMasterID.toUpperCase()}
          </h2>{" "}
          <button
            className={
              styles["new-form-button"] +
              " " +
              styles["cancel-all-forms-button"]
            }
            onClick={cancelAllFormsButtonHandler}
          >
            Cancel All Forms
          </button>
          {additionalFormElm()}
          <button
            className={styles["new-form-button"]}
            value={parentMasterID}
            onClick={submitNewFormButtonHandler}
          >
            Submit to <span>{parentMasterID}</span> &rarr;
          </button>
        </ul>
      );
      setNewFormJSX(groomedNewFormElement);
    });
  };
  return outputFunction;
};

export default useCreateNewForm;
