import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCases } from "@/services/caseService";
import { CaseModelItem } from "@/models/CaseModel";

interface CaseState {
  case: CaseModelItem | null;
  caseLoading: boolean;
  caseError: string | null;
}

const initialState: CaseState = {
  case: null,
  caseLoading: false,
  caseError: null,
};

// Fetch case data from an API
export const fetchCaseData = createAsyncThunk(
  "case/fetchCaseData",
  async () => {
    return await fetchCases();
  },
);

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle loading state for fetching case data
      .addCase(fetchCaseData.pending, (state) => {
        state.caseLoading = true;
        state.caseError = null;
      })
      // Handle successful result data fetching
      .addCase(fetchCaseData.fulfilled, (state, action) => {
        state.caseLoading = false;
        state.case = action.payload;
      })
      // Handle failed case data fetching
      .addCase(fetchCaseData.rejected, (state, action) => {
        state.caseLoading = false;
        state.caseError = action.error.message || "Failed to fetch case data";
      });
  },
});

export default caseSlice.reducer;
