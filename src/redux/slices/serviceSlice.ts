import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchServices } from "@/services/serviceService";
import { ServiceModelItem } from "@/models/ServiceModel";

interface ServiceState {
  service: ServiceModelItem | null;
  serviceLoading: boolean;
  serviceError: string | null;
}

const initialState: ServiceState = {
  service: null,
  serviceLoading: false,
  serviceError: null,
};

// Fetch service data from an API

export const fetchServiceData = createAsyncThunk(
  "service/fetchServiceData",
  async () => {
    return await fetchServices();
  },
);

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle loading state for fetching service data
      .addCase(fetchServiceData.pending, (state) => {
        state.serviceLoading = true;
        state.serviceError = null;
      })
      // Handle successful result data fetching
      .addCase(fetchServiceData.fulfilled, (state, action) => {
        state.serviceLoading = false;
        state.service = action.payload;
      })
      // Handle failed service data fetching
      .addCase(fetchServiceData.rejected, (state, action) => {
        state.serviceLoading = false;
        state.serviceError =
          action.error.message || "Failed to fetch service data";
      });
  },
});

export default serviceSlice.reducer;
