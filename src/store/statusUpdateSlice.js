import { createSlice } from "@reduxjs/toolkit";

function InitState() {
    const initialState = {};
    initialState.status = null;
    return initialState;
  }

  export const StatusUpdateSlice = createSlice({
    name: "statusUpdate",
    initialState: InitState(),
    reducers:  {
updateStatus: (state, action) => {
    state.status = action.payload;
  },
    }
  })

// Action creators are generated for each case reducer function
export const statusUpdateActions = StatusUpdateSlice.actions;

export default StatusUpdateSlice.reducer;