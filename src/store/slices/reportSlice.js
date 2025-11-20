import { createSlice } from "@reduxjs/toolkit";
import { getAgentReport, getDoctorReport } from "../../api/report.api";

const initialState = {
  agentReport: [],
  doctorReport: [],
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReports: (state) => {
      state.agentReport = [];
      state.doctorReport = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Agent
      .addCase(getAgentReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAgentReport.fulfilled, (state, action) => {
        state.loading = false;
        state.agentReport = action.payload;
      })
      .addCase(getAgentReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Doctor
      .addCase(getDoctorReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorReport.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorReport = action.payload;
      })
      .addCase(getDoctorReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearReports } = reportSlice.actions;
export default reportSlice.reducer;
