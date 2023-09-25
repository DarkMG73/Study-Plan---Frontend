import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.studyPlan = null;
  initialState.studyPlanMetadata = null;
  initialState.serviceEmbedJSXObj = null;
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
      state.serviceEmbedJSXObj = payload.serviceEmbedJSXObj;
    },

    // addToHistoryCorrect: (state) => {
    //   const currentQuestionId = state.currentQuestionData.identifier;

    //   // Clear question from history
    //   const {
    //     [currentQuestionId]: idToDiscardUnmarked,
    //     ...newUnmarked
    //   } = state.questionHistory.unmarked;
    //   state.questionHistory.unmarked = newUnmarked;
    //   const {
    //     [currentQuestionId]: idToDiscardIncorrect,
    //     ...newIncorrect
    //   } = state.questionHistory.incorrect;
    //   state.questionHistory.incorrect = newIncorrect;

    //   // Add back to appropriate history
    //   state.questionHistory.correct = {
    //     ...state.questionHistory.correct,
    //     [currentQuestionId]: state.currentQuestionData,
    //   };
    // },
    // addToHistoryIncorrect: (state) => {
    //   const currentQuestionId = state.currentQuestionData.identifier;

    //   // Clear question from history
    //   const {
    //     [currentQuestionId]: idToDiscardUnmarked,
    //     ...newUnmarked
    //   } = state.questionHistory.unmarked;
    //   state.questionHistory.unmarked = newUnmarked;
    //   const {
    //     [currentQuestionId]: idToDiscardCorrect,
    //     ...newCorrect
    //   } = state.questionHistory.correct;
    //   state.questionHistory.correct = newCorrect;

    //   // Add back to appropriate history
    //   state.questionHistory.incorrect = {
    //     ...state.questionHistory.incorrect,
    //     [currentQuestionId]: state.currentQuestionData,
    //   };
    // },
    // addToHistoryUnmarked: (state) => {
    //   const currentQuestionId = state.currentQuestionData.identifier;
    //   // Add to used ID's
    //   const newUsedIdsData = new Set([...state.questionHistory.stats.usedIds]);
    //   if (currentQuestionId) {
    //     newUsedIdsData.add(state.currentQuestionData.identifier);
    //     const newUsedIdsArray = Array.from(newUsedIdsData);
    //     state.questionHistory.stats.usedIds = newUsedIdsArray;
    //   }

    //   // Clear question from history
    //   const {
    //     [currentQuestionId]: idToDiscardIncorrect,
    //     ...newIncorrect
    //   } = state.questionHistory.incorrect;
    //   state.questionHistory.incorrect = newIncorrect;
    //   const {
    //     [currentQuestionId]: idToDiscardCorrect,
    //     ...newCorrect
    //   } = state.questionHistory.correct;
    //   state.questionHistory.correct = newCorrect;

    //   // Add back to appropriate history
    //   state.questionHistory.unmarked = {
    //     ...state.questionHistory.unmarked,
    //     [currentQuestionId]: state.currentQuestionData,
    //   };
    // },
    // updateQuestionHistory: (state, action) => {
    //   const newQuestionHistory = action.payload;
    //   // Update newQuestionHistory
    //   state.questionHistory = newQuestionHistory;
    // },
    // addToQuestionFilters: (state, action) => {
    //   state.currentFilters[action.payload.type] = [
    //     ...state.currentFilters[action.payload.type],
    //     action.payload.value,
    //   ];
    // },
    // removeFromQuestionFilters: (state, action) => {
    //   let newState = [...state.currentFilters[action.payload.type]];

    //   newState.splice(newState.indexOf(action.payload.value), 1);
    //   state.currentFilters[action.payload.type] = newState;
    // },
    // setQuestionFilterIds: (state, action) => {
    //   state.filteredQuestionsIds = [...action.payload];
    // },
    // clearQuestionFilterIds: (state, action) => {
    //   state.filteredQuestionsIds = [];
    // },
    // questionHistoryStorageNeedsUpdate: (state, action) => {
    //   state.questionHistoryStorageNeedsUpdate = action.payload;
    // },
    // currentFilterStorageNeedsUpdate: (state, action) => {
    //   state.currentFilterStorageNeedsUpdate = action.payload;
    // },
    // addStudyTopicID: (state, action) => {
    //   const newStudyTopics = [
    //     ...state.studyNotes.studyTopicsIDs,
    //     action.payload,
    //   ];
    //   // Update newQuestionHistory
    //   state.studyNotes.studyTopicsIDs = newStudyTopics;
    // },
    // clearStudyTopicsIDs: (state, action) => {
    //   state.studyNotes.studyTopicsIDs = [];
    // },
    // updateStudyNotePad: (state, action) => {
    //   state.studyNotes.studyNotePad = [...action.payload];
    // },
    // updateStudyNotes: (state, action) => {
    //   state.studyNotes = { ...action.payload };
    // },
  },
});

// Action creators are generated for each case reducer function
export const studyPlanDataActions = studyPlanDataSlice.actions;

export default studyPlanDataSlice.reducer;
