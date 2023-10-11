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
import PushButton from "../../UI/Buttons/PushButton/PushButton";
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
import useSortList from "../../Hooks/useSortList";
import useAssembleStudyPlanList from "../../Hooks/useAssembleStudyPlanList";

const StudyPlanItems = (props) => {
  const user = useSelector((state) => state.auth.user);
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData
  );
  const updateStudyPlan = useSelector(
    (state) => state.studyPlanData.updateStudyPlan
  );
  const [sortMethod, setSortMethod] = useState("priority");
  const [refresh, setRefresh] = useState(0);
  const [changeListArray, setChangeListArray] = useState(false);
  const [showListResetButton, setShowListResetButton] = useState(false);
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
  const sortList = useSortList();
  const assembleStudyPlanList = useAssembleStudyPlanList();
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
      typeArray: [typeName],
      dataObjForEdit,
      getSchemaForStudyPlanItem,
      getSchemaForContentItem,
      allStudyPlanItems,
      setAllStudyPlanItems,
      setFormInputData,
    });
  }, []);

  useEffect(() => {
    const enumerableFormInputData = {};
    for (const [key, value] of Object.entries(formInputData)) {
      enumerableFormInputData[key] = value;
    }

    const sortedGroomedOutput = sortList({
      sortMethod: sortMethod,
      objectToBeSorted: { ...enumerableFormInputData },
    });

    setFormInputData(sortedGroomedOutput);
    setRefresh(refresh + 1);
  }, [sortMethod]);

  useEffect(() => {
    console.log(
      "%c --> %cline:135%cchangeListArray",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
      changeListArray
    );
    if (changeListArray) {
      const keysToUseArray = studyPlanMetadata
        ? Object.keys(studyPlanMetadata)
        : [];
      console.log(
        "%c --> %cline:127%ckeysToUseArray",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
        keysToUseArray
      );
      console.log(
        "%c --> %cline:129%callStudyPlanItems",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px",
        allStudyPlanItems
      );
      console.log(
        "%c --> %cline:142%cstudyPlan",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px",
        studyPlan
      );
      console.log(
        "%c --> %cline:49%cdataObjForEdit",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
        dataObjForEdit
      );
      const { groomedOutput } = assembleStudyPlanList({
        typeArray: changeListArray,
        keysToUseArray,
        dataObjForEdit,
        allStudyPlanItems: studyPlan,
      });

      console.log(
        "%c --> %cline:125%cgroomedOutput",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
        groomedOutput
      );
      const sortedGroomedOutput = sortList({
        sortMethod: sortMethod,
        objectToBeSorted: { ...groomedOutput },
      });
      setFormInputData(sortedGroomedOutput);
    }
  }, [changeListArray]);

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
  }, [
    allFormInputData.allNewForms,
    user,
    dispatch,
    allFormInputData,
    processAllFormInputData,
  ]);

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
    setSortMethod(e.target.value);
  };

  const showAllItemsButtonHandler = (e) => {
    if (studyPlanMetadata && studyPlanMetadata.hasOwnProperty("type")) {
      setShowListResetButton(true);
      setChangeListArray([...studyPlanMetadata.type]);
    }
  };

  const showDefaultItemsButtonHandler = (e) => {
    setShowListResetButton(false);
    setChangeListArray(["step"]);
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
                width: "21em",
                maxWidth: "100%",
                display: "flex",
                alignItems: "center",
                position: "absolute",
                top: "0",
                left: "0",
                flexGrow: "1",
                minWidth: "min-content",
                height: "100%",
                maxHeight: "3em",
                textAlign: "left",
                transformOrigin: "left",
              }}
              colorType="secondary"
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
                width: "21em",
                maxWidth: "100%",
                display: "flex",
                alignItems: "center",
                position: "absolute",
                top: "0",
                left: "0",
                flexGrow: "1",
                minWidth: "min-content",
                height: "100%",
                maxHeight: "3em",
                textAlign: "left",
                transformOrigin: "left",
              }}
              colorType="secondary"
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
        <div className={styles["sort-button-container"]} type={typeName}>
          <div
            id="list-button-container"
            className={styles["list-button-container"]}
          >
            {!showListResetButton && (
              <Fragment>
                <PushButton
                  inputOrButton="button"
                  id="create-entry-btn"
                  colorType="secondary"
                  styles={{}}
                  value={id}
                  parentmasterid={id}
                  data=""
                  size="small"
                  onClick={showAllItemsButtonHandler}
                >
                  List All Goals & Tasks
                </PushButton>
              </Fragment>
            )}
            {showListResetButton && (
              <PushButton
                inputOrButton="button"
                id="create-entry-btn"
                colorType="secondary"
                styles={{}}
                value={id}
                parentmasterid={id}
                data=""
                size="small"
                onClick={showDefaultItemsButtonHandler}
              >
                Show Only Steps
              </PushButton>
            )}
          </div>
          <label className={styles["sort-button-wrap"]}>
            Sort by:
            <select
              className={styles["new-form-button"]}
              parentmasterid={IdleDeadline}
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
            </select>{" "}
          </label>
        </div>
        {formInputData && refresh && Object.keys(formInputData).length > 0 && (
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
            refresh={refresh}
          />
        )}
        {newFormJSX && (
          <div id="new-form-modal" className={styles["new-form-modal"]}>
            <form>{newFormJSX}</form>
          </div>
        )}
      </CollapsibleElm>
      <div className={styles["new-form-button-wrap"]}>
        <PushButton
          inputOrButton="button"
          id="create-entry-btn"
          colorType="primary"
          styles={{}}
          value={id}
          parentmasterid={id}
          data=""
          size="medium"
          onClick={addFormButtonHandler}
        >
          Add to <span>{id}</span>
        </PushButton>
      </div>
    </ul>
  );
};

export default StudyPlanItems;
