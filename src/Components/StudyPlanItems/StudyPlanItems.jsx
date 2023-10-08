import React, { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./StudyPlanItems.module.scss";
import StudyPlanItemsList from "./StudyPlanItemsList/StudyPlanItemsList";
import FilteredStudyPlanItems from "./FilteredStudyPlanItems/FilteredStudyPlanItems";
import displayConditions from "../../data/displayConditionsObj.js";
import studyItemSortOptions from "../../data/studyItemSortOptions.json";
import useCreateNewForm from "../../Hooks/useCreateNewForm";
import useProcessAllFormInputData from "../../Hooks/useProcessAllFormInputData";
import useInitStudyPlanItems from "../../Hooks/useInitStudyPlanItems";
import useProcessUpdateStudyPlan from "../../Hooks/useProcessUpdateStudyPlan";
import { toTitleCase } from "../../Hooks/utility";
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
  const [sortMethod, setSortMethod] = useState("priority");

  const id = props.id;
  const typeName = props.type;
  const section = props.section;
  const dataObjForEdit = props.dataObjForEdit;
  const processAllFormInputData = useProcessAllFormInputData();
  const initStudyPlanItems = useInitStudyPlanItems();
  const processUpdateStudyPlan = useProcessUpdateStudyPlan();
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
  /// EFFECTS
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    initStudyPlanItems({
      id,
      sortMethod: sortMethod,
      type: typeName,
      dataObjForEdit,
      getSchemaForStudyPlanItem,
      getSchemaForContentItem,
      allStudyPlanItems,
      setAllStudyPlanItems,
      setFormInputData,
    });
  }, [sortMethod]);

  useEffect(() => {
    processAllFormInputData({
      user,
      dispatch,
      allFormInputData,
      getSchemaForStudyPlanItem,
      saveManyStudyPlanItems,
      getSchemaForContentItem,
      saveManyContentItems,
    });
  }, [allFormInputData.allNewForms]);

  useEffect(() => {
    processUpdateStudyPlan({
      updateStudyPlan,
      updateAContentItem,
      updateAStudyPlanItem,
      studyPlanDataActions,
    });
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

  const sortMethodButtonHandler = (e) => {
    console.log(
      "%c --> %cline:130%ce.target.value",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px",
      e.target.value
    );
    setSortMethod(e.target.value);
  };
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
      {outputName.toLowerCase().includes("syllabus") && (
        <div
          section="history-list-section"
          id={id}
          className={
            styles["studyPlan-history-list-container"] +
            " " +
            styles["group-" + id] +
            " " +
            styles[id]
          }
        >
          <div
            style={{
              position: "relative",
              minHeight: "2em",
              margin: "0.5em 1em 0",
            }}
          >
            {" "}
            <CollapsibleElm
              id={id + "-collapsible-elm"}
              styles={{
                position: "relative",
              }}
              maxHeight={"1em"}
              s
              inputOrButton="button"
              buttonStyles={{
                margin: "auto",
                padding: "0.5em 2em",
                transition: "0.7s all ease",
                width: "24em",
                maxWidth: "100%",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
                fontFamily: "Arial",
                border: "none",
                position: "absolute",
                top: "0",
                left: "0",
                flexGrow: "1",
                minWidth: "min-content",
                boxShadow:
                  "inset 3px 3px 5px 0px #ffffffe0, inset -3px -3px 5px 0px #00000038",
                fontSize: "1.2rem",
                fontVariant: "all-small-caps",
                letterSpacing: "0.2em",
                cursor: "pointer",
                height: "100%",
                maxHeight: "3em",
                transformOrigin: "left",
                background: "var(--spt-color-background-warm)",
                color: "var(--spt-color-accent)",
              }}
              colorType="primary"
              data=""
              size="small"
              buttonTextOpened={"Close Completed Items"}
              buttonTextClosed={"Open Completed Items"}
              open={false}
            >
              <FilteredStudyPlanItems
                filterKey={"markcomplete"}
                section={"completed-items"}
                sectionTitle={"Completed"}
                sectionSubText={"All completed steps and goals"}
                messageIfNone="There are no completed items. Time to get to work! :)"
                studyPlanSet={formInputData}
                allStudyPlanItems={allStudyPlanItems}
                displayConditions={displayConditions}
                user={props.user}
              />{" "}
            </CollapsibleElm>{" "}
          </div>
          <div
            style={{
              position: "relative",
              minHeight: "2em",
              margin: "0.25em 1em 0",
            }}
          >
            <CollapsibleElm
              id={id + "-collapsible-elm"}
              styles={{
                position: "relative",
              }}
              maxHeight={"1em"}
              s
              inputOrButton="button"
              buttonStyles={{
                margin: "auto",
                padding: "0.5em 2em",
                transition: "0.7s all ease",
                width: "24em",
                maxWidth: "100%",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
                fontFamily: "Arial",
                border: "none",
                position: "absolute",
                top: "0",
                left: "0",
                flexGrow: "1",
                minWidth: "min-content",
                boxShadow:
                  "inset 3px 3px 5px 0px #ffffffe0, inset -3px -3px 5px 0px #00000038",
                fontSize: "1.2rem",
                fontVariant: "all-small-caps",
                letterSpacing: "0.2em",
                cursor: "pointer",
                height: "100%",
                maxHeight: "3em",
                transformOrigin: "left",
                background: "var(--spt-color-background-warm)",
                color: "var(--spt-color-accent)",
              }}
              colorType="primary"
              data=""
              size="small"
              buttonTextOpened={"Close Items Needing Review"}
              buttonTextClosed={"Open Items Needing Review"}
              open={false}
            >
              <FilteredStudyPlanItems
                filterKey={"markforreview"}
                section={"review-items"}
                sectionTitle={"Items for Review"}
                sectionSubText={
                  "All goals or steps that have been marked for review."
                }
                messageIfNone='There are no items for review right now. If you completed a step or a goal, but feel you need to review the material at a later date to ensure understanding, use the "Mark for Review" button at the bottom of each item to set it for later followup.'
                studyPlanSet={formInputData}
                allStudyPlanItems={allStudyPlanItems}
                displayConditions={displayConditions}
                user={props.user}
              />
            </CollapsibleElm>{" "}
          </div>
        </div>
      )}

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
        <label>
          Sort
          <select
            className={styles["new-form-button"]}
            parentmasterid={id}
            onChange={sortMethodButtonHandler}
            value={sortMethod}
          >
            {Object.entries(studyItemSortOptions).map((entry) => (
              <Fragment>
                {" "}
                <option value={entry[0]}>{entry[1]}</option>{" "}
                <option value={entry[0] + "-reverse"}>
                  {"Reverse " + entry[1]}
                </option>
              </Fragment>
            ))}
          </select>
        </label>
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
