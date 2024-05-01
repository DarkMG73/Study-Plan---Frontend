import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.studyPlan = null;
  initialState.studyPlanMetadata = null;
  initialState.updateStudyPlan = null;
  initialState.schema = null;
  initialState.reGatherStudyPlan = null;
  initialState.expandedItems = null;
  return initialState;
}

export const studyPlanDataSlice = createSlice({
  name: "studyPlanData",
  initialState: InitState(),
  reducers: {
    initState: (state, action) => {
      const payload = action.payload;

      state.studyPlan = payload.studyPlan;
      state.studyPlanMetadata = payload.studyPlanMetadata;
      state.updateStudyPlan = payload.updateStudyPlan;
      state.schema = payload.schema;
      state.reGatherStudyPlan = payload.reGatherStudyPlan;
      state.expandedItems = {};
    },

    updateOneStudyPlanItem: (state, action) => {
      const newStudyPlan = { ...state.studyPlan };

      newStudyPlan[action.payload._id] = action.payload.item;
      newStudyPlan["count"] = Object.hasOwn(newStudyPlan, "count")
        ? [...newStudyPlan.count, action.payload._id]
        : [action.payload._id];
      state.studyPlan = newStudyPlan;
    },

    updateStudyPlanDB: (state, action) => {
      if (action.payload && !Object.hasOwn(action.payload, "itemWithNewEdits"))
        alert(
          "There is a problem with missing data. Please alert the website admin.",
        );

      const output = {
        itemWithNewEdits: action.payload.itemWithNewEdits,
        user: action.payload.user ? action.payload.user : false,
        parentSection: action.payload.parentSection
          ? action.payload.parentSection
          : false,
      };

      state.updateStudyPlan = output;
    },
    resetUpdateStudyPlan: (state) => {
      state.updateStudyPlan = false;
    },
    updateSchema: (state, action) => {
      state.schema = { ...action.payload };
    },
    reGatherStudyPlan: (state, action) => {
      state.reGatherStudyPlan = action.payload;
    },
    toggleExpandedItems: (state, action) => {
      const newState = { ...state.expandedItems };
      const { section, id } = action.payload;

      if (Object.keys(newState).includes(section)) {
        if (newState[section].includes(id)) {
          newState[section].splice(newState[section].indexOf(id), 1);

          state.expandedItems = newState;
        } else {
          newState[section].push(id);
        }
      } else {
        newState[section] = [id];
      }

      state.expandedItems = { ...newState };
    },
  },
});

// Action creators are generated for each case reducer function
export const studyPlanDataActions = studyPlanDataSlice.actions;

export default studyPlanDataSlice.reducer;
