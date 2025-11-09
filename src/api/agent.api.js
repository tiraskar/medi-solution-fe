import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  deleteApi,
  getApi,
  postApi,
  postFileApi,
  putFileApi,
} from "../lib/axiosInstance";
import { clearSelectedAgent } from "../store/slices/agentSlice";

// 🟢 Get all agents
export const getAllAgents = createAsyncThunk(
  "agent/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getApi({ url: "api/agent" });
      return data;
    } catch (error) {
      toast.error("Failed to fetch agents");
      return rejectWithValue(error.message);
    }
  }
);

// 🔍 Search agents
export const getSearchAgents = createAsyncThunk(
  "agent/getSearchAgents",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { searchFilter, pagination } = getState().agent;

      const params = {};
      if (searchFilter.keyword) params.keyword = searchFilter.keyword;
      if (pagination.page) params.page = pagination.page;
      if (pagination.limit) params.limit = pagination.limit;

      const data = await getApi({
        url: "api/agent/search",
        params,
      });

      return data;
    } catch (error) {
      toast.error("Failed to fetch agents");
      return rejectWithValue(error.message);
    }
  }
);

// 🧾 Get single agent by ID
export const getAgentById = createAsyncThunk(
  "agent/getById",
  async (agentId, { rejectWithValue }) => {
    try {
      const data = await getApi({
        url: `api/agent/${agentId}`,
      });
      return data;
    } catch (error) {
      toast.error("Failed to fetch agent details");
      return rejectWithValue(error.message);
    }
  }
);

// ➕ Add a new agent
export const addAgent = createAsyncThunk(
  "agent/add",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const res = await postApi({
        url: "api/agent",
        body: data,
      });

      toast.success("Agent added successfully");
      dispatch(getAllAgents());
      return res;
    } catch (error) {
      toast.error("Failed to add agent");
      return rejectWithValue(error.message);
    }
  }
);

// ✏️ Update agent
export const updateAgent = createAsyncThunk(
  "agent/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await putFileApi({
        url: `api/agent/${id}`,
        body: data,
      });

      toast.success("Agent updated successfully");
      dispatch(clearSelectedAgent());
      return res;
    } catch (error) {
      toast.error("Failed to update agent");
      return rejectWithValue(error.message);
    }
  }
);

// ❌ Delete agent
export const deleteAgent = createAsyncThunk(
  "agent/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteApi({
        url: `api/agent/${id}`,
      });

      toast.success("Agent deleted successfully");
      dispatch(getAllAgents());
      return id;
    } catch (error) {
      toast.error("Failed to delete agent");
      return rejectWithValue(error.message);
    }
  }
);
