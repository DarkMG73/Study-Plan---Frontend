import React, { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./StudyPlanItems.module.css";
import StudyPlanItemsList from "./StudyPlanItemsList/StudyPlanItemsList";
import displayConditions from "../../data/displayConditionsObj.js";
import useCreateNewForm from "../../Hooks/useCreateNewForm";
import { formInputDataActions as allFormInputDataActions } from "../../store/formInputDataSlice";
import { toTitleCase } from "../../Hooks/utility";
import { sha256 } from "js-sha256";
import {
  saveManyStudyPlanItems,
  getSchemaForStudyPlanItem,
} from "../../storage/studyPlanDB";
import {
  saveManyContentItems,
  getSchemaForContentItem,
} from "../../storage/contentDB";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";

const StudyPlanItems = (props) => {
  const user = useSelector((state) => state.auth.user);
  const studyPlanMetadata = useSelector(
    (state) => state.studyPlanData.studyPlanMetadata
  );
  const id = props.id;
  const typeName = props.type;
  const dataObjForEdit = props.dataObjForEdit;
  const [formInputData, setFormInputData] = useState({});
  const [newFormJSX, setNewFormJSX] = useState(false);
  const createNewForm = useCreateNewForm();
  const [newFormInputValuesObj, setNewFormInputValuesObj] = useState({});
  const newFormInputValuesObjRef = useRef();
  newFormInputValuesObjRef.current = newFormInputValuesObj;
  const allFormInputData = useSelector((state) => state.formInputData);
  const dispatch = useDispatch();

  ////////////////////////////////////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (dataObjForEdit) {
      let getSchema = getSchemaForStudyPlanItem;
      if (id === "content") {
        getSchema = getSchemaForContentItem;
      }

      getSchema()
        .then((data) => {
          const output = {};
          // Gather services available for sourceURLObj
          let availableServices =
            studyPlanMetadata &&
            studyPlanMetadata.hasOwnProperty("availableServices")
              ? [...studyPlanMetadata.availableServices]
              : [""];

          for (const itemID in dataObjForEdit) {
            output[itemID] = {};
            for (const catName of Object.keys(data.tree)) {
              // If sourceURLObj, add services
              if (catName === "sourceURLObj") {
                output[itemID][catName] = {};
                availableServices.forEach((serviceName) => {
                  if (serviceName === "") return;

                  if (
                    dataObjForEdit[itemID].hasOwnProperty(catName) &&
                    dataObjForEdit[itemID][catName].hasOwnProperty(
                      serviceName
                    ) &&
                    dataObjForEdit[itemID][catName][serviceName]
                  ) {
                    output[itemID][catName][serviceName] =
                      dataObjForEdit[itemID][catName][serviceName];
                  } else {
                    output[itemID][catName][serviceName] = "";
                  }
                });
              } else {
                output[itemID][catName] = dataObjForEdit[itemID].hasOwnProperty(
                  catName
                )
                  ? dataObjForEdit[itemID][catName]
                  : "";
              }
            }
          }
          setFormInputData(output);
        })
        .catch((err) => {
          console.log("ERROR->", err);
        });
    } else {
      getSchemaForStudyPlanItem()
        .then((data) => {
          setFormInputData((prevState) => {
            const existingState = { ...prevState };
            existingState.studyPlan = data.tree;
            return existingState;
          });
        })
        .catch((err) => {
          console.log("ERROR->", err);
        });
    }
  }, []);

  useEffect(() => {
    if (allFormInputData.allNewForms && user) {
      let getSchema = getSchemaForStudyPlanItem;
      let saveManyItems = saveManyStudyPlanItems;
      Object.keys(allFormInputData.allNewForms).forEach((formName) => {
        for (const categoryName in allFormInputData.allNewForms[formName]) {
          if (categoryName === "content") {
            getSchema = getSchemaForContentItem;
            saveManyItems = saveManyContentItems;
          }
        }
      });

      getSchema()
        .then((schema) => {
          const outputDataArray = [];
          const requiredFields = [];
          const groomedBlankForm = {};

          /////// Functions for later use ///////
          const lookForMissingRequirements = (measureArray, testObj) => {
            const filteredTestObj = {};
            for (const [key, value] of Object.entries(testObj)) {
              const groomedValue =
                value.constructor === String ? value.replace(/\s/g, "") : value;
              if (groomedValue !== "") filteredTestObj[key] = groomedValue;
            }
            const missingRequiredFields = measureArray.filter(
              (requiredFiledName) =>
                !Object.keys(filteredTestObj).includes(requiredFiledName)
            );
            return missingRequiredFields;
          };

          const flattenNestedObjToArr = (nestedObj) => {
            const outputArray = [];
            // new-form
            for (const l1Key in nestedObj) {
              // StudyPlan
              for (const l2Key in nestedObj[l1Key]) {
                // The base form
                const newObject = {};
                for (const l3Key in nestedObj[l1Key][l2Key]) {
                  newObject[l3Key] = nestedObj[l1Key][l2Key][l3Key];
                }
                outputArray.push(newObject);
              }
            }
            return outputArray;
          };

          /////// Begin processing  ///////
          // Prepare blank form and required fields
          for (const schemaKey in schema.tree) {
            if (schemaKey === "_id") continue;
            if (
              schema.tree[schemaKey].hasOwnProperty("required") &&
              schema.tree[schemaKey].required
            )
              requiredFields.push(schemaKey);

            groomedBlankForm[schemaKey] = "";
          }

          const flatInputDataArray = flattenNestedObjToArr(
            allFormInputData.allNewForms,
            2
          );

          // Check requirements
          const missingRequiredFields = [];
          flatInputDataArray.forEach((form) => {
            missingRequiredFields.push(
              lookForMissingRequirements(requiredFields, form)
            );
          });

          const cleanMissingFieldsArray = new Set();
          missingRequiredFields.forEach((arr) => {
            if (arr) arr.forEach((value) => cleanMissingFieldsArray.add(value));
          });

          if (cleanMissingFieldsArray.size > 0) {
            const errorMessage =
              "Unfortunately, there is missing required data preventing this from submitting. Please fill out the " +
              [...cleanMissingFieldsArray]
                .toString()
                .replace(/,(?=[^,]+$)/, ", and ") +
              " fields on each form.";
            alert(errorMessage);
            return;
          }

          // Requirements met and ready to prepare upload data
          const newFormData = flatInputDataArray.map((formData) => {
            const newForm = { ...groomedBlankForm };
            Object.keys(newForm).forEach((key) => {
              let value = formData[key] ? formData[key] : newForm[key];

              // Handle special identifier
              const date = new Date();
              let year = date.getFullYear();
              if (key === "identifier") {
                const hashID = sha256(JSON.stringify(formData["title"]));
                value = year + "-" + hashID;
              }

              // Special dates
              if (key === "createdAt" || key === "updatedAt") {
                value = date;
              }

              newForm[key] = value;
            });
            return newForm;
          });

          outputDataArray.push(...newFormData);
          saveManyItems({ user, outputDataArray }).then((data) => {
            console.log("Success! An item has been saved to the studyPlan.");
            dispatch(allFormInputDataActions.resetSubmitAllNewForms());
          });
        })
        .catch((err) => {
          console.log("ERROR GETTING SCHEMA: ", err);
          throw Error("ERROR GETTING SCHEMA: " + err);
        });
    }
  }, [allFormInputData.allNewForms]);

  ////////////////////////////////////////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////////////////////////////////////
  const addFormButtonHandler = (e) => {
    e.preventDefault();
    createNewForm({
      e,
      styles,
      setNewFormJSX,
      id,
      user,
      setNewFormInputValuesObj,
      currentNewFormInputValuesObjRef: newFormInputValuesObjRef.current,
    });
  };

  const outputName =
    dataObjForEdit[id] && dataObjForEdit[id].hasOwnProperty("title") ? (
      <Fragment>
        <div>{dataObjForEdit[id].title}</div>
        <div>{id}</div>
      </Fragment>
    ) : typeName ? (
      typeName + "s"
    ) : (
      id
    );
  ////////////////////////////////////////////////////////////////////////
  /// Output
  ////////////////////////////////////////////////////////////////////////
  return (
    <ul
      marker="CATALOG-ITEMS"
      section={id}
      id={id}
      type={typeName}
      className={
        styles["studyPlan-items-group"] +
        " " +
        styles["group-" + id] +
        " " +
        styles[id]
      }
    >
      <h2 className={styles["group-title"] + " " + styles[id]}>{outputName}</h2>
      <CollapsibleElm
        id={id + "-collapsible-elm"}
        styles={{
          position: "relative",
        }}
        maxHeight={"0em"}
        s
        inputOrButton="button"
        buttonStyles={{
          margin: "0 auto",
          padding: "0.5em 2em",
          letterSpacing: "0.25em",
          fontVariant: "small-caps",
          transform: "translateY(0%)",
          transition: "0.7s all ease",
          minWidth: "80%",
          maxWidth: "80%",
          textAlign: "center",
          display: "flex",
          alignItems: "center",

          borderRadius: "0 0 50px 50px",
          fontFamily: "Arial",

          boxShadow: "none",
          border: "3px solid var(--spt-color-accent-dark)",
        }}
        colorType="primary"
        data=""
        size="small"
        buttonTextOpened={"- Close All " + toTitleCase(outputName) + " -"}
        buttonTextClosed={"- Open All " + toTitleCase(outputName) + " -"}
        open={false}
      >
        {formInputData && Object.keys(formInputData).length > 0 && (
          <StudyPlanItemsList
            studyPlanItemsObj={formInputData}
            parentKey={false}
            parentsParentKey={false}
            parentMasterID={false}
            displayConditions={displayConditions.formWithPreFilledData}
            user={user}
            section={id}
          />
        )}
        {newFormJSX && (
          <div id="new-form-modal" className={styles["new-form-modal"]}>
            <form>{newFormJSX}</form>
          </div>
        )}
      </CollapsibleElm>
      <button
        className={styles["new-form-button"]}
        value={id}
        parentmasterid={id}
        onClick={addFormButtonHandler}
      >
        Add to <span>{id}</span>
      </button>
    </ul>
  );
};

export default StudyPlanItems;
