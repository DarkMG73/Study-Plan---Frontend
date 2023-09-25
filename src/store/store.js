import { configureStore } from "@reduxjs/toolkit";
import studyPlanDataReducer from "./studyPlanDataSlice";
import contentDataReducer from "./contentDataSlice";
import authReducer from "./authSlice";
import loadingRequestsReducer from "./loadingRequestsSlice";
import statusUpdateReducer from "./statusUpdateSlice";
import scrollPositionReducer from "./scrollPositionSlice";
import musicPlayerReducer from "./musicPlayerSlice";
import formInputDataReducer from "./formInputDataSlice";

export default configureStore({
  reducer: {
    studyPlanData: studyPlanDataReducer,
    contentData: contentDataReducer,
    auth: authReducer,
    loadingRequests: loadingRequestsReducer,
    statusUpdate: statusUpdateReducer,
    scrollPosition: scrollPositionReducer,
    musicPlayer: musicPlayerReducer,
    formInputData: formInputDataReducer,
  },
});
