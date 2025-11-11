import { createAsyncThunk } from "@reduxjs/toolkit";
import { getApi, postApi, putApi, deleteApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import {
  toggleCreateModal,
  toggleSelectedGroup,
} from "../store/slices/testGroupSlice";

// Fetch all test groups
export const fetchTestGroups = createAsyncThunk(
  "testGroup/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getApi({ url: "api/testgroup/group" });
      //   console.log(response);

      return [response];
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Fetch paginated test groups
export const fetchTestGroupPagination = createAsyncThunk(
  "testGroup/fetchPagination",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState().testGroup;
      const { pagination, searchFilters } = state;
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        keyword: searchFilters.keyword || "",
      };
      const response = await getApi({
        url: "api/testgroup/pagination",
        params,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Create a new test group
export const addTestGroup = createAsyncThunk(
  "testGroup/add",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await postApi({ url: "api/testgroup", body: data });
      toast.success("Test group created successfully!");
      dispatch(toggleCreateModal(false));
      dispatch(toggleSelectedGroup(null));
      dispatch(fetchTestGroups());
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create test group"
      );
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Update existing test group
export const updateTestGroup = createAsyncThunk(
  "testGroup/update",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await putApi({ url: `api/testgroup/${id}`, body: data });
      toast.success("Test group updated successfully!");
      dispatch(toggleCreateModal(false));
      dispatch(toggleSelectedGroup(null));
      dispatch(fetchTestGroups());
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update test group"
      );
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Delete a test group
export const deleteTestGroup = createAsyncThunk(
  "testGroup/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await deleteApi({ url: `api/testgroup/${id}` });
      toast.success("Test group deleted successfully!");
      dispatch(fetchTestGroupPagination());
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete test group"
      );
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
