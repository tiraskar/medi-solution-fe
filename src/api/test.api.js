import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  getApi,
  postApi,
  putFileApi,
  deleteApi,
  putApi,
} from "../lib/axiosInstance";
import { clearSelectedTest } from "../store/slices/testSlice";

// Get all tests
export const fetchTests = createAsyncThunk(
  "test/fetchAll",
  async ({ page, limit, keyword } = {}, { rejectWithValue, getState }) => {
    try {
      // const params = { page, limit };
      // if (keyword) params.keyword = keyword;
      const state = getState().test;
      const { pagination, searchFilter } = state;
      const params = {
        keyword: keyword ?? searchFilter?.keyword ?? "",
        page: pagination.page,
        limit: pagination.limit,
      };

      const data = await getApi({ url: "api/test", params });
      return data;
    } catch (error) {
      toast.error("Failed to fetch tests");
      return rejectWithValue(error.message);
    }
  }
);

// Get test by ID
export const getTestById = createAsyncThunk(
  "test/getById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getApi({ url: `api/test/${id}` });
      return data;
    } catch (error) {
      toast.error("Failed to fetch test details");
      return rejectWithValue(error.message);
    }
  }
);

// Add new test
export const addTest = createAsyncThunk(
  "test/add",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await postApi({ url: "api/test", body: data });
      toast.success("Test added successfully");
      dispatch(fetchTests({ page: 1, limit: 10 }));
      return res;
    } catch (error) {
      toast.error("Failed to add test");
      return rejectWithValue(error.message);
    }
  }
);

// Update test
export const updateTest = createAsyncThunk(
  "test/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await putApi({ url: `api/test/${id}`, body: data });
      toast.success("Test updated successfully");
      dispatch(clearSelectedTest());
      return res;
    } catch (error) {
      toast.error("Failed to update test");
      return rejectWithValue(error.message);
    }
  }
);

// Delete test
export const deleteTest = createAsyncThunk(
  "test/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteApi({ url: `api/test/${id}` });
      toast.success("Test deleted successfully");
      dispatch(fetchTests({ page: 1, limit: 10 }));
      return id;
    } catch (error) {
      toast.error("Failed to delete test");
      return rejectWithValue(error.message);
    }
  }
);
