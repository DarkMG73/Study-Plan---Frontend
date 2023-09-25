import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.serviceSelected = null;
  return initialState;
}

export const musicPlayerSlice = createSlice({
  name: "musicPlayer",
  initialState: InitState(),
  reducers: {
    updateServiceSelected: (state, action) => {
      state.serviceSelected = action.payload;
    },
  },
});

export const musicPlayerActions = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
