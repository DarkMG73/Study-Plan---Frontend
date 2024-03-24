import { createSlice } from "@reduxjs/toolkit";

const initState = {
  pendingLoadRequests: false,
};

export const loadingRequestsSlice = createSlice({
  name: "loadingRequests",
  initialState: initState,
  reducers: {
    addToLoadRequest: (state) => {
      const currentValue = state.pendingLoadRequests;
      console.log(
        "%c⚪️►►►► %cline:12%ccurrentValue",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
        currentValue + 1,
      );
      state.pendingLoadRequests = currentValue + 1;
    },
    removeFromLoadRequest: (state) => {
      console.log(
        "%c⚪️►►►► %cline:22%cremoveFromLoadRequest",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px",
        state.pendingLoadRequests,
      );
      const currentValue = state.pendingLoadRequests;

      if (state.pendingLoadRequests > 0) {
        console.log(
          "%c⚪️►►►► %cline:17%ccurrentValue",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
          currentValue - 1,
        );
        state.pendingLoadRequests = currentValue - 1;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const loadingRequestsActions = loadingRequestsSlice.actions;

export default loadingRequestsSlice.reducer;
