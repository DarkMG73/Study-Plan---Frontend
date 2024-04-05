import Styles from "./NewStudyPlanForm.module.scss";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import StudyPlanItemsList from "../StudyPlanItems/StudyPlanItemsList/StudyPlanItemsList";
import displayConditions from "../../data/displayConditionsObj.js";
import { formInputDataActions } from "../../store/formInputDataSlice";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";
import useDemoCheck from "../../Hooks/useDemoCheck";

const NewStudyPlanForm = (props) => {
  const dispatch = useDispatch();
  const demoCheck = useDemoCheck();
  const isDemo = demoCheck();
  const [newFormJSX, setNewFormJSX] = useState(false);
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema,
  );
  const [formType, setFormType] = useState("all");
  const { id, user, amountToAdd, formActive } = props.data;
  console.log(
    "%c⚪️►►►► %cline:19%cid",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
    id,
  );

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
      setNewFormJSX((prevState) => {
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
    if (confirm) {
      setNewFormJSX(false);
      formActive(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  /// Functionality
  ////////////////////////////////////////////////////////////////
  const processNewFormWithSchema = (schema) => {
    const targetFormDataObj = schema;
    console.log(
      "%c⚪️►►►► %cline:79%ctargetFormDataObj",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
      targetFormDataObj,
    );
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
            key={id + "newForm-" + i}
            id={"newForm-" + i}
            data-parentmasterid={"newForm-" + i}
            className={Styles["new-form-" + i] + " " + Styles["new-form"]}
            data-formtype={"type-" + formType}
          >
            <button
              key={id + "newForm-" + i + "button"}
              className={
                Styles["new-form-button"] +
                " " +
                Styles["cancel-single-form-button"]
              }
              value={"newForm-" + i}
              onClick={cancelFormButtonHandler}
            >
              Cancel Entry {i + 1}
            </button>
            <h2 id={id} className={Styles["group-title"] + " " + Styles[id]}>
              &nbsp; Entry {i + 1}
            </h2>
            <ul
              key={id + "newForm-" + i}
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
                  key={id + "newForm-" + i}
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
        key={id}
        className={
          Styles.subgroup +
          " " +
          Styles["subgroup-" + id] +
          " " +
          Styles[id] +
          " " +
          Styles["in-modal"] +
          " " +
          Styles["new-form"]
        }
      >
        {" "}
        <h2 id={id} className={Styles["group-title"] + " " + Styles[id]}>
          &nbsp;{id && id.toUpperCase()}
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
          value={id}
          onClick={submitNewFormButtonHandler}
        >
          Submit to <span>{id}</span> &rarr;
        </button>
      </ul>
    );

    console.log(
      "%c⚪️►►►► %cline:194%cgroomedNewFormElement",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
      groomedNewFormElement,
    );
    setNewFormJSX(groomedNewFormElement);
  };

  ////////////////////////////////////////////////////////////////
  /// Effects
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    processNewFormWithSchema(studyPlanItemSchema);
  }, []);

  return (
    <div>
      <div
        key={props.typeName + "new-form-modal"}
        id="new-form-modal"
        className={Styles["new-form-modal"]}
        type={props.typeName}
      >
        <form>{newFormJSX}</form>
      </div>
    </div>
  );
};

export default NewStudyPlanForm;
