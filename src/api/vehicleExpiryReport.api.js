import { createAsyncThunk } from '@reduxjs/toolkit';
import { getApi } from '../lib/axiosInstance';

// Get vehicle expiry report
export const getVehicleExpiryReport = createAsyncThunk(
  'vehicleExpiryReport/getVehicleExpiryReport',
  async (data, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (data?.toDate) {
        queryParams.append('toDate', data.toDate);
      }

      const url = `api/report/getvehicleexpiryreport${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await getApi({ url: url });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getIndividualLedgerReport = createAsyncThunk(
  'vehicleExpiryReport/getIndividualLedgerReport',
  async (data, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (data?.fromDate) {
        queryParams.append('fromDate', data.fromDate);
      }
      if (data?.toDate) {
        queryParams.append('toDate', data.toDate);
      }
      if (data?.ledgerId) {
        queryParams.append('ledgerId', data.ledgerId);
      }

      const url = `api/report/getindividualledgerreport${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await getApi({ url: url });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);