import { configureStore } from "@reduxjs/toolkit";

import serviceReducer from "./slices/serviceSlice";
import stepReducer from "./slices/stepSlice";
import CaseReducer from "./slices/caseSlice";

export const store = configureStore({
  reducer: {
    service: serviceReducer,
    step: stepReducer,
    case: CaseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
