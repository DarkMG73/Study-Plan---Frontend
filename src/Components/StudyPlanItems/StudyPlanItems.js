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
import {
  updateAStudyPlanItem,
  deleteDocFromDb,
} from "../../storage/studyPlanDB";
import {
  updateAContentItem,
  deleteContentDocFromDb,
} from "../../storage/contentDB";
import { studyPlanDataActions } from "../../store/studyPlanDataSlice";

const StudyPlanItems = (props) => {
  const user = useSelector((state) => state.auth.user);
  const studyPlanMetadata = useSelector(
    (state) => state.studyPlanData.studyPlanMetadata
  );
  const updateStudyPlan = useSelector(
    (state) => state.studyPlanData.updateStudyPlan
  );
  const id = props.id;
  const typeName = props.type;
  const dataObjForEdit = props.dataObjForEdit;
  const [allStudyPlanItems, setAllStudyPlanItems] = useState(
    props.allStudyPlanItems
  );
  const [formInputData, setFormInputData] = useState({});
  const [newFormJSX, setNewFormJSX] = useState(false);
  const createNewForm = useCreateNewForm();
  const [newFormInputValuesObj, setNewFormInputValuesObj] = useState({});
  const newFormInputValuesObjRef = useRef();
  newFormInputValuesObjRef.current = newFormInputValuesObj;
  const allFormInputData = useSelector((state) => state.formInputData);
  const dispatch = useDispatch();
  // const orderOfOutputArray = [
  //   "progressbar",
  //   "name",
  //   "method",
  //   "priority",
  //   "msup",
  //   "asup",
  //   "des",
  //   "url",
  //   "type",
  //   "author",
  //   "platform",
  //   "start",
  //   "acomp",
  //   "status",
  //   "lectureTime",
  //   "labTime",
  //   "markcomplete",
  //   "markforreview",
  //   "demonstratedskillurl",
  //   "demonstratedskillsdesc",
  //   "tags",
  //   "itemnotes",
  // ];
  const findDependencies = (objectIdentifier, masterListObj) => {
    console.log(
      "%c --> %cline:37%cmasterListObj",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
      masterListObj
    );
    console.log(
      "%c --> %cline:37%cobjectIdentifier",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
      objectIdentifier
    );
    const output = [];
    for (const value of Object.values(masterListObj)) {
      console.log(
        "%c --> %cline:53%centry",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
        value
      );
      console.log(
        "%c --> %cline:54%centry.msup",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
        value.msup
      );
      if (value.hasOwnProperty("msup") && value.msup === objectIdentifier)
        output.push(value.identifier);

      if (value.hasOwnProperty("msup") && value.msup === objectIdentifier)
        console.log(value.msup);
    }

    return output;
  };
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
          // const groomedSchema = {}
          // // Organize Schema
          // orderOfOutputArray.forEach(topic=>{
          //   groomedSchema[topic] = data.tree[topic]
          // })
          // Gather items to list based on type.
          for (const itemID in dataObjForEdit) {
            if (
              !dataObjForEdit[itemID].hasOwnProperty("type") ||
              dataObjForEdit[itemID].type !== props.type
            )
              continue;
            output[itemID] = {};

            for (const catName of Object.keys(data.tree)) {
              output[itemID][catName] = dataObjForEdit[itemID].hasOwnProperty(
                catName
              )
                ? dataObjForEdit[itemID][catName]
                : "";
            }
          }
          console.log(
            "%c --> %cline:73%coutput",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
            props.type,
            " | ",
            output
          );
          const groomedOutput = { ...output };
          const groomedAllItemOutput = {};
          if (allStudyPlanItems) {
            for (const [key, value] of Object.entries(allStudyPlanItems)) {
              console.log(
                "%c --> %cline:122%cvalue",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                "color:#fff;background:rgb(254, 67, 101);padding:3px;border-radius:2px",
                value
              );
              groomedAllItemOutput[key] = {};
              for (const [innerKey, innerValue] of Object.entries(value)) {
                console.log(
                  "%c --> %cline:125%cinnerValue",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
                  innerValue
                );
                groomedAllItemOutput[key][innerKey] = innerValue;
              }
            }
            console.log(
              "%c --> %cline:128%cgroomedAllItemOutput",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
              groomedAllItemOutput
            );
          }

          if (props.type === "goal") {
            for (const [key, value] of Object.entries(output)) {
              groomedOutput[key].dependencies = findDependencies(
                value.identifier,
                dataObjForEdit
              );
            }

            if (allStudyPlanItems) {
              for (const [key, value] of Object.entries(allStudyPlanItems)) {
                console.log(
                  "%c --> %cline:97%callStudyPlanItems key",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(20, 68, 106);padding:3px;border-radius:2px",
                  key
                );
                console.log(
                  "%c --> %cline:97%callStudyPlanItems value",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
                  value
                );
                console.log(
                  "%c --> %cline:176%cgroomedAllItemOutput[key]",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
                  groomedAllItemOutput[key]
                );
                groomedAllItemOutput[key].dependencies = findDependencies(
                  value.identifier,
                  allStudyPlanItems
                );
              }
            }
          }
          console.log(
            "%c --> %cline:73%c--groomedOutput",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
            props.type,
            " | ",
            groomedOutput
          );
          console.log(
            "%c --> %cline:181%c--groomedAllItemOutput",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
            groomedAllItemOutput
          );

          setAllStudyPlanItems(groomedAllItemOutput);
          setFormInputData(groomedOutput);
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

  useEffect(() => {
    if (!updateStudyPlan) return;
    console.log(
      "%c --> %cline:114%c-------------------updateStudyPlan",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(114, 83, 52);padding:3px;border-radius:2px",
      updateStudyPlan
    );
    const { itemWithNewEdits, user, parentSection } = updateStudyPlan;
    console.log(
      "%c --> %cline:406%cparentSection",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
      parentSection
    );
    console.log(
      "%c --> %cline:406%cuser",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
      user
    );
    console.log(
      "%c --> %cline:406%citemWithNewEdits",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
      itemWithNewEdits
    );
    const updateAnItem =
      parentSection === "content" ? updateAContentItem : updateAStudyPlanItem;

    /* eslint eqeqeq: 0 */
    if (user && user.isAdmin == true) {
      updateAnItem(itemWithNewEdits, user)
        .then((res) => {
          console.log(
            "%c --> %cline:433%cres",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(60, 79, 57);padding:3px;border-radius:2px",
            res
          );
          const status = res.status ? res.status : res.response.status;
          if (status >= 400) {
            alert("There was an error: " + res.response.data.message);
          } else if (status >= 200) {
            alert("Success! The item has been updated.");
            // setInEditMode(false);
          } else {
            alert("there was an error: " + +res.message);
          }
        })
        .catch((err) => {
          alert(err);
        });
      dispatch(studyPlanDataActions.resetUpdateStudyPlan(false));
    } else {
      const sendEmail = window.confirm(
        'Thank you for contributing. All contributions must be reviewed before becoming public. Click "OK" to send this via email for review and, if approved, to be included. Click "Cancel" to cancel this and not send an email.'
      );
      if (sendEmail) {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject =
          "A Question Edit Request for the Interview Questions Tool";
        const body = `A question edit is being recommended: ${JSON
          .stringify
          // editedQuestions.current.edits
          ()}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${encodeURIComponent(
            body
          )}`
        );
      }
      dispatch(studyPlanDataActions.resetUpdateStudyPlan(false));
    }
  }, [updateStudyPlan]);
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

  let outputName =
    dataObjForEdit &&
    dataObjForEdit[id] &&
    dataObjForEdit[id].hasOwnProperty("title") ? (
      <Fragment>
        <div>{dataObjForEdit[id].title}</div>
        <div>{id}</div>
      </Fragment>
    ) : typeName ? (
      typeName + "s"
    ) : (
      id
    );

  if (outputName === "goals") outputName = "Goal & Curriculum";
  if (outputName === "steps") outputName = "Syllabus";
  ////////////////////////////////////////////////////////////////////////
  /// Output
  ////////////////////////////////////////////////////////////////////////
  return (
    <ul
      marker="STUDYPLAN-ITEMS"
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
        maxHeight={
          id.includes("goal") || id.includes("studyPlan") ? "none" : "8em"
        }
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
          fontFamily: "Good Times RG",
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
            allStudyPlanItems={allStudyPlanItems}
            parentKey={false}
            parentsParentKey={false}
            parentMasterID={false}
            displayConditions={displayConditions.formWithPreFilledData}
            user={user}
            section={id}
            onlyList={props.onlyList}
            noEditButton={props.noEditButton}
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
