// src/api/testBill.api.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApi, postApi } from "../lib/axiosInstance";
import { toast } from "react-toastify"; // Assuming you have toast imported

// Existing createTestBillApi (No changes needed)
export const createTestBillApi = createAsyncThunk(
  "billing/createBill",
  async (billPayload, { rejectWithValue }) => {
    try {
      // Endpoint typically for saving a new transaction/bill
      const data = await postApi({ url: "api/master/addBillingInfoDetails", body: billPayload });
      // This toast message will trigger if the request is successful
      toast.success("Bill saved successfully to SQL database!");
      return data;
    } catch (error) {
      // Ensure you return the proper error message from the backend response
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchAllTestBillsApi = createAsyncThunk(
  "testBill/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getApi({ url: "api/master/getAllBillInfoDetails" });

      // Safely access success property
      const data = response?.data || response; // axios wrapper ले data unwrap गरेको भए
      console.log("💚 API Response:", data);

      if (!data?.success) {
        return rejectWithValue("Failed to fetch bills from API");
      }

      return data; // slice मा result array use हुनेछ
    } catch (error) {
      console.error("🔴 Fetch all bills API error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unknown error"
      );
    }
  }
);
