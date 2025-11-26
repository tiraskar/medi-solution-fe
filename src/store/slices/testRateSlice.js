// src/store/slices/testRateSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchTestRatesApi, createTestRateApi, deleteTestRateApi } from "../../api/testRate.api";

const initialState = {
  loading: false,
  isError: false,
  testRates: [],
  message: null,
};

const testRateSlice = createSlice({
  name: "testRates",
  initialState,
  reducers: {
    resetTestRateState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchTestRatesApi.pending, (state) => {
        state.loading = true;
        state.isError = false;
      })
      .addCase(fetchTestRatesApi.fulfilled, (state, action) => {
        state.loading = false;
        state.testRates = action.payload;
      })
      .addCase(fetchTestRatesApi.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.message = action.payload;
      });

    // Create
    
    builder
      .addCase(createTestRateApi.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(createTestRateApi.fulfilled, (state, action) => { 
        state.loading = false; 
        state.testRates.push(action.payload); 
      })
      .addCase(createTestRateApi.rejected, (state, action) => { 
        state.loading = false; 
        state.isError = true; 
        state.message = action.payload; 
      });

    // Delete
    builder
      .addCase(deleteTestRateApi.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(deleteTestRateApi.fulfilled, (state, action) => {
        state.loading = false;
        state.testRates = state.testRates.filter(item => item.id !== action.payload);
      })
      .addCase(deleteTestRateApi.rejected, (state, action) => { 
        state.loading = false; 
        state.isError = true; 
        state.message = action.payload; 
      });
  },
});

export const { resetTestRateState } = testRateSlice.actions;
export default testRateSlice.reducer;