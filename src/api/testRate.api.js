// src/api/testRate.api.js

import { createAsyncThunk } from "@reduxjs/toolkit";
// Assuming 'postApi' is your utility for simple JSON POST requests.
import { getApi, postFileApi, deleteApi, putFileApi, postApi } from "../lib/axiosInstance"; 
import toast from "react-hot-toast";

// Fetch all test rates
export const fetchTestRatesApi = createAsyncThunk(
  "testRates/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getApi({ url: "api/test" });
      return data;
    } catch (error) {
      toast.error("Failed to fetch test rates");
      return rejectWithValue(error.message);
    }
  }
);

// Create new test rate (existing code)
export const createTestRateApi = createAsyncThunk(
  "testRates/create",
  async (newItem, { rejectWithValue, dispatch }) => {
    try {
      const data = await postFileApi({ url: "api/test", body: newItem });
      toast.success("Test rate added successfully");
      dispatch(fetchTestRatesApi()); // refresh list
      return data;
    } catch (error) {
      toast.error("Failed to add test rate");
      return rejectWithValue(error.message);
    }
  }
);

// Delete test rate (existing code)
export const deleteTestRateApi = createAsyncThunk(
  "testRates/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteApi({ url: `api/test/${id}` });
      toast.success("Test rate deleted successfully");
      dispatch(fetchTestRatesApi()); // refresh list
      return id;
    } catch (error) {
      toast.error("Failed to delete test rate");
      return rejectWithValue(error.message);
    }
  }
);

// 💰 NEW THUNK TO SAVE THE BILL TO SQL DATABASE
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