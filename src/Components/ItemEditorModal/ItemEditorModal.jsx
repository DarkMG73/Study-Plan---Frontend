import Styles from "./ItemEditorModal.module.scss";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import StudyPlanItemsList from "../StudyPlanItems/StudyPlanItemsList/StudyPlanItemsList.jsx";
import displayConditions from "../../data/displayConditionsObj.js";
import { formInputDataActions } from "../../store/formInputDataSlice.js";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice.js";
import useDemoCheck from "../../Hooks/useDemoCheck.js";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";

const ItemEditorModal = (props) => {
  const dispatch = useDispatch();
  const demoCheck = useDemoCheck();
  const isDemo = demoCheck();
  const [itemEditFormJSX, setNewFormJSX] = useState(false);
  const studyPlan = useSelector((state) => state.studyPlanData.studyPlan);
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema,
  );
  const refresh = props.refresh;
  const formInputData = useSelector((state) => state.formInputData);
  const formDataRef = useRef();
  const [formType, setFormType] = useState("all");
  const { id, user, _id } = props;
  const itemData = studyPlan[id];

  ////////////////////////////////////////////////////////////////
  /// Handlers
  ////////////////////////////////////////////////////////////////
  const submitFormButtonHandler = (e) => {
    e.preventDefault();

    if (isDemo) {
      alert(isDemo);
      return;
    }

    dispatch(loadingRequestsActions.addToLoadRequest());

    // Allow a pause to ensure input data is fully updated to existing form state
    setTimeout(() => {
      // const parentSection = e.target.getAttribute("data-section");
      const rawItemWithNewEdits = { ...itemData };
      // const _id = rawItemWithNewEdits._id;
      const existingFormEdits = { ...formDataRef.current };

      for (const key in existingFormEdits[id]) {
        // Convert to boolean.
        if (key === "markcomplete" || key === "markforreview") {
          const innerItem = existingFormEdits[id][key];
          if (typeof innerItem === String) {
            rawItemWithNewEdits[key] = ["true", "1", " "].includes(
              innerItem.trim(),
            )
              ? true
              : false;
          } else {
            rawItemWithNewEdits[key] = innerItem;
          }
        }

        if (
          existingFormEdits[id][key] &&
          existingFormEdits[id][key].constructor === Object
        ) {
          const newInnerItemWithNewEdits = {};

          for (const innerKey in existingFormEdits[id][key]) {
            newInnerItemWithNewEdits[innerKey] =
              existingFormEdits[id][key][innerKey];
          }

          if (key == 0) {
            const newKey = Object.keys(newInnerItemWithNewEdits)[0];
            rawItemWithNewEdits[newKey] = newInnerItemWithNewEdits[newKey];
          } else {
            rawItemWithNewEdits[key] = { ...newInnerItemWithNewEdits };
          }
        } else {
          rawItemWithNewEdits[key] = existingFormEdits[id][key];
        }
      }

      // Clean itemWithNewEdits
      const itemWithNewEdits = {};
      for (const [key, value] of Object.entries(rawItemWithNewEdits)) {
        if (key === "_id") {
          delete itemWithNewEdits[key];
        } else if (
          (key === "markcomplete" || key === "markforreview") &&
          rawItemWithNewEdits[key].constructor !== Boolean
        ) {
          // Convert to boolean.
          const innerItem = existingFormEdits[id][key];

          if (typeof innerItem === String) {
            itemWithNewEdits[key] =
              innerItem.trim().toLowerCase === "true" ? true : false;
          } else {
            itemWithNewEdits[key] = innerItem;
          }
        } else {
          itemWithNewEdits[key] = value;
        }
      }

      if (user) {
        dispatch(
          studyPlanDataActions.updateStudyPlanDB({
            itemWithNewEdits,
            user,
          }),
        );

        dispatch(
          studyPlanDataActions.updateOneStudyPlanItem({
            _id: _id,
            item: itemWithNewEdits,
          }),
        );

        // updateAStudyPlanItem(dataObj, user);
      } else {
        alert("You must be logged in to be able to make changes.");
      }
      dispatch(loadingRequestsActions.removeFromLoadRequest());
    }, 7000);
  };

  const cancelFormButtonHandler = (e) => {
    e.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to cancel this form without saving? All data entered here will be lost.",
    );
    if (confirm) {
      setNewFormJSX(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  /// Functionality
  ////////////////////////////////////////////////////////////////
  const processNewFormWithSchema = (schema) => {
    const targetFormDataObj = schema;
    // const itemsToRemove = ['$timestamps', ]
    const cleansedFormData = {};
    Object.keys(targetFormDataObj).forEach((key) => {
      cleansedFormData[key] = "";
    });

    const additionalFormElm = function () {
      const output = [];

      output.push(
        <div
          key={id + "-itemEditForm-"}
          id={"itemEditForm-" + id}
          data-parentmasterid={id}
          className={Styles["new-form-inner-container"]}
          data-newformtype={itemData.type}
          data-formtype={"type-" + formType}
        >
          <button
            key={id + "itemEditForm-button"}
            className={
              Styles["new-form-button"] +
              " " +
              Styles["cancel-single-form-button"]
            }
            value={"itemEditForm-"}
            onClick={cancelFormButtonHandler}
          >
            Cancel Edits
          </button>
          <h2 id={id} className={Styles["group-title"] + " " + Styles[id]}>
            &nbsp; Entry
          </h2>
          <ul
            key={id + "itemEditForm-"}
            id="itemEditForm-wrap"
            data-parentmasterid={"itemEditForm-"}
            className={
              Styles["new-form-wrap"] + " " + Styles["new-form-inner-wrap"]
            }
          >
            {itemData && (
              <StudyPlanItemsList
                key={id + "itemEditForm-"}
                studyPlanItemsObj={itemData}
                id={"itemEditForm-"}
                section="editor-in-modal"
                parentKey={id}
                displayConditions={displayConditions.formWithPreFilledData}
                parentMasterID={id}
                showProtectedHidden={[]}
                user={user}
                emptyForm={false}
                inModal={true}
                setFormType={setFormType}
              />
            )}
          </ul>
        </div>,
      );
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
          Styles["new-form-container"] +
          " edited-list "
        }
      >
        <h2 id={id} className={Styles["group-title"] + " " + Styles[id]}>
          &nbsp;{Object.hasOwn(itemData, "name") && itemData.name.toUpperCase()}
        </h2>
        {additionalFormElm()}
        <button
          className={Styles["new-form-button"]}
          value={id}
          onClick={submitFormButtonHandler}
        >
          Submit <span>{Object.hasOwn(itemData, "name") && itemData.name}</span>
          &rarr;
        </button>
      </ul>
    );

    setNewFormJSX(groomedNewFormElement);
  };

  ////////////////////////////////////////////////////////////////
  /// Effects
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(formInputDataActions.setNewFormOpen(true));
  }, []);

  useEffect(() => {
    formDataRef.current = formInputData.existingFormInputDataObj;
  }, [formInputData]);

  useEffect(() => {
    if (refresh) processNewFormWithSchema(studyPlanItemSchema);
  }, [refresh]);

  return (
    <div>
      {itemEditFormJSX && (
        <div
          key={props.typeName + "new-form-modal"}
          id="new-form-modal"
          className={Styles["new-form-modal"]}
          type={props.typeName}
        >
          <form>{itemEditFormJSX}</form>
        </div>
      )}
    </div>
  );
};

export default ItemEditorModal;
