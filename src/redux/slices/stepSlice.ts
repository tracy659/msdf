import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSteps } from "@/services/stepService";
import { StepModelItem } from "@/models/StepModel";

interface StepState {
  step: StepModelItem | null;
  stepLoading: boolean;
  stepError: string | null;
}

const initialState: StepState = {
  step: null,
  stepLoading: false,
  stepError: null,
};

// Fetch step data from an API
export const fetchStepData = createAsyncThunk(
  "step/fetchStepData",
  async () => {
    return await fetchSteps();
  },
);

const stepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle loading state for fetching step data
      .addCase(fetchStepData.pending, (state) => {
        state.stepLoading = true;
        state.stepError = null;
      })
      // Handle successful result data fetching
      .addCase(fetchStepData.fulfilled, (state, action) => {
        state.stepLoading = false;
        state.step = action.payload;
      })
      // Handle failed step data fetching
      .addCase(fetchStepData.rejected, (state, action) => {
        state.stepLoading = false;
        state.stepError = action.error.message || "Failed to fetch step data";
      });
  },
});

export default stepSlice.reducer;
