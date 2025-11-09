import { createSlice } from "@reduxjs/toolkit";
import {
  getAllAgents,
  addAgent,
  updateAgent,
  deleteAgent,
  getAgentById,
  getSearchAgents,
} from "../../api/agent.api";

const agentSlice = createSlice({
  name: "agent",
  initialState: {
    agents: [], // list of agents
    selectedAgent: null,
    loading: false,
    searchFilter: {
      keyword: "",
    },
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
  reducers: {
    toggleSelectedAgent: (state, action) => {
      state.selectedAgent = action.payload;
    },
    clearSelectedAgent: (state) => {
      state.selectedAgent = null;
    },
    updateSearchFilter: (state, action) => {
      const { name, value } = action.payload;
      state.searchFilter[name] = value;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get All Agents
      .addCase(getAllAgents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(getAllAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Get Agent by ID
      .addCase(getAgentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAgentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAgent = action.payload;
      })
      .addCase(getAgentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Add Agent
      .addCase(addAgent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.agents.push(action.payload);
      })
      .addCase(addAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add agent";
      })

      // ✅ Update Agent
      .addCase(updateAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.agents.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.agents[index] = action.payload;
        }
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update agent";
      })

      // ✅ Delete Agent
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.agents = state.agents.filter((a) => a.id !== action.payload);
      })

      // ✅ Search Agents
      .addCase(getSearchAgents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSearchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload;
      })
      .addCase(getSearchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  toggleSelectedAgent,
  clearSelectedAgent,
  updateSearchFilter,
  updatePagination,
} = agentSlice.actions;

export default agentSlice.reducer;
