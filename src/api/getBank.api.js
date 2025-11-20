// src/api/bank.api.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getApi } from "../lib/axiosInstance";

// Fetch all banks
export const fetchBanksApi = createAsyncThunk(
  "banks/fetchBanks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getApi({url:"api/accounting/getledgerinfo"}); // Your backend endpoint
      return response.data; // Expecting an array of banks [{id, name}]
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch banks");
    }
  }
);
