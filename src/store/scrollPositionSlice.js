import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.welcomeScrollPosition = null;
  return initialState;
}

export const scrollPositionSlice = createSlice({
  name: "scrollPosition",
  initialState: InitState(),
  reducers: {
    updateWelcomeScrollPosition: (state, action) => {
      state.welcomeScrollPosition = action.payload;
    },
  },
});

export const scrollPositionActions = scrollPositionSlice.actions;

export default scrollPositionSlice.reducer;
