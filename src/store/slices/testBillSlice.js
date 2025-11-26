// src/redux/slices/billHistory.slice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllTestBillsApi } from "../../api/testBill.api";

const initialState = {
  bills: [],
  loading: false,
  error: null,
};

const billHistorySlice = createSlice({
  name: "billHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all bills pending
      .addCase(fetchAllTestBillsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch all bills fulfilled
      .addCase(fetchAllTestBillsApi.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Assign API result array to bills
        state.bills = Array.isArray(action.payload.result)
          ? action.payload.result
          : [];
        state.error = null;
      })
      // Fetch all bills rejected
      .addCase(fetchAllTestBillsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bill history";
      });
  },
});

export default billHistorySlice.reducer;
