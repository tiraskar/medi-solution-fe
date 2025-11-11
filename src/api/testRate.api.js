// src/api/testRate.api.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getApi, postFileApi, deleteApi, putFileApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";

// Fetch all test rates
export const fetchTestRatesApi = createAsyncThunk(
  "testRates/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getApi({ url: "api/test" });
    //   console.log(data);
      
      return data;
    } catch (error) {
      toast.error("Failed to fetch test rates");
      return rejectWithValue(error.message);
    }
  }
);

// Create new test rate
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

// Delete test rate
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