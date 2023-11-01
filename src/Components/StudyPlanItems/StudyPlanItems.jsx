import React, { useState, useEffect, useRef, Fragment } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import styles from "./StudyPlanItems.module.scss";
import StudyPlanItemsList from "./StudyPlanItemsList/StudyPlanItemsList";
import Welcome from "../Welcome/Welcome";
import FilteredStudyPlanItems from "./FilteredStudyPlanItems/FilteredStudyPlanItems";
import displayConditions from "../../data/displayConditionsObj.js";
import studyItemSortOptions from "../../data/studyItemSortOptions.json";
import useCreateNewForm from "../../Hooks/useCreateNewForm";
import useProcessAllFormInputData from "../../Hooks/useProcessAllFormInputData";
import useInitStudyPlanItems from "../../Hooks/useInitStudyPlanItems";
import useProcessUpdateStudyPlan from "../../Hooks/useProcessUpdateStudyPlan";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { toTitleCase } from "../../Hooks/utility";
import { saveManyStudyPlanItems } from "../../storage/studyPlanDB";
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
  let saveManyItems = saveManyStudyPlanItems;
  const [sortMethod, setSortMethod] = useState("priority");
  const [refresh, setRefresh] = useState(0);
  const [changeListArray, setChangeListArray] = useState(false);
  const [hideAllSubGoals, setHideAllSubGoals] = useState(true);
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
  const allFormInputData = useSelector(
    (state) => state.formInputData,
    shallowEqual
  );
  const dispatch = useDispatch();
  const sortList = useSortList();
  const [formType, setFormType] = useState("all");
  const assembleStudyPlanList = useAssembleStudyPlanList();
  let outputName =
    dataObjForEdit &&
    dataObjForEdit[id] &&
    Object.hasOwn(dataObjForEdit[id], "title") ? (
      <Fragment key={dataObjForEdit[id].title + id}>
        <div key={dataObjForEdit[id].title}>{dataObjForEdit[id].title}</div>
        <div key={id}>{id}</div>
      </Fragment>
    ) : typeName ? (
      typeName + "s"
    ) : (
      id
    );

  if (outputName === "goals") outputName = "Goal & Curriculum";
  if (outputName === "steps") outputName = "Syllabus";
  if (outputName === "holds") outputName = "Holding Area";

  ////////////////////////////////////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    initStudyPlanItems({
      id,
      sortMethod: sortMethod,
      typeArray: [typeName],
      dataObjForEdit,
      getSchemaForContentItem,
      allStudyPlanItems,
      setAllStudyPlanItems,
      setFormInputData,
    });
  }, [dataObjForEdit, user]);

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
    if (changeListArray) {
      const keysToUseArray = studyPlanMetadata
        ? Object.keys(studyPlanMetadata)
        : [];

      const { groomedOutput } = assembleStudyPlanList({
        typeArray: changeListArray,
        keysToUseArray,
        dataObjForEdit,
        allStudyPlanItems: studyPlan,
      });

      const sortedGroomedOutput = sortList({
        sortMethod: sortMethod,
        objectToBeSorted: { ...groomedOutput },
      });

      setFormInputData(sortedGroomedOutput);
    }
  }, [changeListArray]);

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
    if (user) {
      createNewForm({
        e,
        styles,
        setNewFormJSX,
        id,
        user,
        setNewFormInputValuesObj,
        currentNewFormInputValuesObjRef: newFormInputValuesObjRef.current,
        formTypeGroup: { formType, setFormType },
      });
    } else {
      alert(
        'Please log in to add to your study plan. If you do not yet have a profile, click "Sign Up" at the top of the page to get started.'
      );
    }
  };

  const sortMethodButtonHandler = (e) => {
    setSortMethod(e.target.value);
  };

  const showAllItemsButtonHandler = (e) => {
    if (studyPlanMetadata && Object.hasOwn(studyPlanMetadata, "type")) {
      setShowListResetButton(true);
      setChangeListArray([...studyPlanMetadata.type]);
      setHideAllSubGoals(false);
    }
  };

  const showDefaultItemsButtonHandler = (e) => {
    setShowListResetButton(false);
    setChangeListArray(["step"]);
    setHideAllSubGoals(true);
  };

  const hideAllSubGoalsButtonHandler = (e) => {
    if (studyPlanMetadata && Object.hasOwn(studyPlanMetadata, "type")) {
      setHideAllSubGoals(!hideAllSubGoals);
    }
  };

  ////////////////////////////////////////////////////////////////////////
  /// Output
  ////////////////////////////////////////////////////////////////////////
  if (props.onlyAddToButton)
    return (
      <Fragment key={id}>
        <PushButton
          key={id}
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
          Add to <span>{toTitleCase(id, true)}</span>
        </PushButton>{" "}
        {newFormJSX && (
          <div
            key={id}
            id="new-form-modal"
            className={styles["new-form-modal"]}
            type={typeName}
          >
            <form key={id}>{newFormJSX}</form>
          </div>
        )}
      </Fragment>
    );
  return (
    <Fragment key={"Welcome"}>
      {!user && outputName.includes("Goal") && <Welcome />}
      {user &&
        outputName.includes("Goal") &&
        (!Object.hasOwn(studyPlanMetadata, "_id") ||
          (Object.hasOwn(studyPlanMetadata, "_id") &&
            studyPlanMetadata._id.length <= 0)) && (
          <Welcome key={"Welcome"} user={user} />
        )}

      {user &&
        Object.keys(formInputData).length >= 0 &&
        Object.hasOwn(studyPlanMetadata, "_id") &&
        studyPlanMetadata._id.length > 0 && (
          <ul
            key={id}
            data-marker="STUDYPLAN-ITEMS"
            data-section={id}
            id={id}
            type={typeName}
            data-hiddeitems={"" + hideAllSubGoals}
            className={
              styles["studyPlan-items-group"] +
              " " +
              styles["group-" + id] +
              " " +
              styles[id]
            }
          >
            <h2 className={styles["group-title"] + " " + styles[id]}>
              {outputName}
            </h2>
            {props.subText && (
              <p className={styles["subtext"]}>{props.subText}</p>
            )}
            {outputName.toLowerCase().includes("goal") &&
              Object.keys(formInputData).length > 0 &&
              !outputName.includes("Syllabus") && (
                <div
                  key={id}
                  id="list-button-container"
                  className={styles["goal-button-container"]}
                >
                  {hideAllSubGoals && (
                    <Fragment key={id}>
                      <PushButton
                        key={id}
                        inputOrButton="button"
                        id="create-entry-btn"
                        colorType="secondary"
                        styles={{}}
                        value={id}
                        parentmasterid={id}
                        data=""
                        size="small"
                        onClick={hideAllSubGoalsButtonHandler}
                      >
                        Show Sub-goals as a list
                      </PushButton>
                    </Fragment>
                  )}
                  {!hideAllSubGoals && (
                    <PushButton
                      key={id}
                      inputOrButton="button"
                      id="create-entry-btn"
                      colorType="secondary"
                      styles={{}}
                      value={id}
                      parentmasterid={id}
                      data=""
                      size="small"
                      onClick={hideAllSubGoalsButtonHandler}
                    >
                      Sub-Goal Tree (Inside Main Goal)
                    </PushButton>
                  )}
                </div>
              )}
            {outputName.toLowerCase().includes("syllabus") &&
              Object.keys(formInputData).length > 0 &&
              !outputName.includes("Goal") && (
                <div
                  key={id}
                  data-section="history-list-data-section"
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
                    key={id}
                    style={{
                      margin: "0.5em 1em 0",
                    }}
                  >
                    <CollapsibleElm
                      key={id + "-collapsible-elm"}
                      id={id + "-collapsible-elm"}
                      styles={{
                        position: "relative",
                      }}
                      maxHeight={"0"}
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
                        key={id + "Filtered Items"}
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
                      margin: "0.25em 1em 0",
                    }}
                  >
                    <CollapsibleElm
                      key={id + "-collapsible-elm"}
                      id={id + "-collapsible-elm"}
                      styles={{
                        position: "relative",
                      }}
                      maxHeight={"0"}
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
                        left: "24em",
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
                        key={id + "Filtered Items"}
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
            {!props.hideShowAllButton && (
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
                  Add to <span>{toTitleCase(id, true)}</span>
                </PushButton>
              </div>
            )}
            <CollapsibleElm
              key={id + "-collapsible-elm"}
              id={id + "-collapsible-elm"}
              styles={{
                position: "relative",
              }}
              maxHeight={
                props.maxCollapsableElmHeight
                  ? props.maxCollapsableElmHeight
                  : "7em"
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
              {Object.keys(formInputData).length > 0 && (
                <div
                  className={styles["sort-button-container"]}
                  type={typeName}
                >
                  {!props.hideShowAllButton && (
                    <div
                      key={id}
                      id="list-button-container"
                      className={styles["list-button-container"]}
                    >
                      {!showListResetButton && (
                        <Fragment>
                          <PushButton
                            key={id}
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
                            Show All Goals, Steps & Holds
                          </PushButton>
                        </Fragment>
                      )}
                      {showListResetButton && (
                        <PushButton
                          key={id}
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
                  )}
                  <label
                    key={id + sortMethod}
                    className={styles["sort-button-wrap"]}
                  >
                    Sort by:
                    <select
                      key={id + sortMethod}
                      className={styles["new-form-button"]}
                      data-parentmasterid={id}
                      onChange={sortMethodButtonHandler}
                      value={sortMethod}
                    >
                      {Object.entries(studyItemSortOptions)
                        .sort((a, b) =>
                          a[1].toLowerCase().localeCompare(b[1].toLowerCase())
                        )
                        .map((entry) => (
                          <Fragment key={"1+r" + entry[0] + entry[1]}>
                            {" "}
                            <option
                              key={"1" + entry[0] + entry[1]}
                              value={entry[0]}
                            >
                              {entry[1]}
                            </option>{" "}
                            <option
                              key={"r" + entry[0] + entry[1]}
                              value={entry[0] + "-reverse"}
                            >
                              {"Reverse " + entry[1]}
                            </option>
                          </Fragment>
                        ))}
                    </select>{" "}
                  </label>
                </div>
              )}
              {Object.keys(formInputData).length <= 0 &&
                outputName.includes("Goal") && (
                  <div className={styles["instructions-container"]}>
                    <p>
                      It appears you are missing your main goal. :( It is very
                      important to start with one main large goal. Everything
                      should lead to this main goal, so there should only be one
                      goal (and no more) in this "Goals and Curriculum" section.
                      Opening that goal, should reveal all of the sub-goals and
                      steps supporting this goal.
                    </p>
                    <h4>To do this: </h4>
                    <ol>
                      <li key="studyPlan">
                        Open the new entry form with:{" "}
                        {
                          <StudyPlanItems
                            key="studyPlan"
                            id="studyPlan"
                            onlyAddToButton={true}
                          />
                        }
                      </li>
                      <li key={2}>
                        Mark it as "Goal" in the "Type" section of the form.
                      </li>
                      <li key={3}>Save the main goal</li>
                      <li key={4}>
                        Then, make sure every single goal and step added after
                        that is connected either to this main goal or to another
                        goal or step (which would be in support of the main
                        goal). This is set in the "Goal or Step this Directly
                        Works Towards" setting. It will be empty when making
                        your original main goal, but with each subsequent goal
                        or step all previous goals or steps will be available to
                        select.{" "}
                      </li>
                    </ol>
                    <p key={5}>
                      <b>IMPORTANT NOTE</b>:{" "}
                      <i>
                        If you find yourself adding something that does not
                        actually support an existing goal or step, either do not
                        add it (because it is not actually helping you) or mark
                        the "Type" setting as "Hold" until you figure where it
                        fits into this journey to the one main goal. When it is
                        time to add it to the flow, just change the Type to a
                        Step or Goal.
                      </i>
                    </p>
                  </div>
                )}

              {Object.keys(formInputData).length <= 0 &&
                Object.hasOwn(studyPlanMetadata, "_id") &&
                studyPlanMetadata._id.length > 0 &&
                !outputName.includes("Goal") &&
                !outputName.includes("Holding") && (
                  <div
                    key={typeName + "sno-items-text"}
                    id="no-items-text"
                    className={styles["no-items-text"]}
                    type={typeName}
                  >
                    <h3>
                      Hmmmm...unfortunately, there are no steps yet. See below
                      for how to add steps towards your main goal.
                    </h3>
                    <Welcome onlyInstructions={true} />
                  </div>
                )}
              {formInputData &&
                refresh &&
                Object.keys(formInputData).length > 0 && (
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
              {newFormJSX && (
                <div
                  key={typeName + "new-form-modal"}
                  id="new-form-modal"
                  className={styles["new-form-modal"]}
                  type={typeName}
                >
                  <form>{newFormJSX}</form>
                </div>
              )}
            </CollapsibleElm>
          </ul>
        )}
    </Fragment>
  );
};

export default StudyPlanItems;
