import { createSlice } from '@reduxjs/toolkit';
import { getIndividualLedgerReport, getVehicleExpiryReport } from '../../api/vehicleExpiryReport.api';

const initialState = {
  data: [],
  loading: false,
  error: null,
  lastFetchDate: null,
  individualReport: [],
};

const vehicleExpiryReportSlice = createSlice({
  name: 'vehicleExpiryReport',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.data = [];
      state.lastFetchDate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehicleExpiryReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVehicleExpiryReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
        state.error = null;
      })
      .addCase(getVehicleExpiryReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch vehicle expiry report';
        state.data = [];
      });

    builder
      .addCase(getIndividualLedgerReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIndividualLedgerReport.fulfilled, (state, action) => {
        state.loading = false;
        state.individualReport = action.payload || [];
        state.error = null;
      })
      .addCase(getIndividualLedgerReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch vehicle expiry report';
        state.data = [];
      });
  },
});

export const { clearError, clearData } = vehicleExpiryReportSlice.actions;
export default vehicleExpiryReportSlice.reducer;