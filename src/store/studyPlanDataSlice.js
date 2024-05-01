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
      const newState = [...state.expandedItems];
      console.log(
        "%c⚪️►►►► %cline:65%cnewState",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px",
        newState,
      );
      console.log(
        "%c⚪️►►►► %cline:65%caction.payload",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
        action.payload,
      );
      console.log(
        "%c⚪️►►►► %cline:80%cnewState.includes(action.payload)",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
        newState.includes(action.payload),
      );

      const { section, id } = action.payload;
      if (newState.includes(section)) {
        if (newState.section.includes(id)) {
          newState.section.splice(newState.indexOf(id), 1);
          console.log(
            "%c⚪️►►►► %cline:68%creducedNewState",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
            newState,
          );
          state.expandedItems = newState;
        } else {
          newState.section.push(id);
        }
      } else {
        newState.section = [id];
      }
      state.expandedItems = { ...newState };
    },
  },
});

// Action creators are generated for each case reducer function
export const studyPlanDataActions = studyPlanDataSlice.actions;

export default studyPlanDataSlice.reducer;
