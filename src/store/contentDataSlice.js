import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.content = null;
  initialState.contentMetadata = null;
  initialState.socialConnections = null;
  return initialState;
}

export const contentDataSlice = createSlice({
  name: "contentData",
  initialState: InitState(),
  reducers: {
    initState: (state, action) => {
      const payload = action.payload;
      state.content = payload.content;
      state.contentMetadata = payload.contentMetadata;
      state.socialConnections = payload.socialConnections;
    },
  },
});

// Action creators are generated for each case reducer function
export const contentDataActions = contentDataSlice.actions;

export default contentDataSlice.reducer;
