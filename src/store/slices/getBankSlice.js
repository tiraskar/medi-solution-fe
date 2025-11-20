// src/store/slices/bankSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchBanksApi } from "../../api/getBank.api";

const initialState = {
  banks: [],
  loading: false,
  isError: false,
  message: ""
};

const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanksApi.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchBanksApi.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBanksApi.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch banks";
      });
  },
});

export default bankSlice.reducer;
