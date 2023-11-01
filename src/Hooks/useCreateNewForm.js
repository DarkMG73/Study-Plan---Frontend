import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import StudyPlanItemsList from "../Components/StudyPlanItems/StudyPlanItemsList/StudyPlanItemsList";
import displayConditions from "../data/displayConditionsObj.js";
import { formInputDataActions } from "../store/formInputDataSlice";

const useCreateNewForm = () => {
  const dispatch = useDispatch();
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema
  );
  const [formType, setFormType] = useState("all");

  useEffect(() => {
    console.log("formType", formType);
  }, [formType]);
  const outputFunction = (props) => {
    const e = props.e;
    const styles = props.styles;
    const setNewFormJSX = props.setNewFormJSX;
    const setNewFormInputValuesObj = props.setNewFormInputValuesObj;
    const id = props.id;
    const user = props.user;

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
    const parentMasterID = e.target.getAttribute("data-parentmasterid");
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
              key={Math.random(10)}
              id={"newForm-" + i}
              data-parentmasterid={"newForm-" + i}
              className={styles["new-form-" + i] + " " + styles["new-form"]}
              formType={"type-" + formType}
            >
              {formType}
              <button
                key={Math.random(10)}
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
                key={Math.random(10)}
                id={parentMasterID}
                className={styles["group-title"] + " " + styles[parentMasterID]}
              >
                &nbsp; Entry {i + 1}
              </h2>
              <ul
                key={Math.random(10)}
                id={"newForm-" + i + "-wrap"}
                data-parentmasterid={"newForm-" + i}
                className={
                  styles["new-form-" + i + "-wrap"] +
                  " " +
                  styles["new-form-inner-wrap"]
                }
              >
                {cleansedFormData && (
                  <StudyPlanItemsList
                    key={Math.random(10)}
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
            </div>
          );
        }
        return output;
      };

      const groomedNewFormElement = (
        <ul
          key={Math.random(10)}
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
            &nbsp;{parentMasterID && parentMasterID.toUpperCase()}
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
    };

    processNewFormWithSchema(studyPlanItemSchema);
  };
  return outputFunction;
};

export default useCreateNewForm;
