import { createAsyncThunk } from '@reduxjs/toolkit';
import { getApi } from '../lib/axiosInstance';

// Get renewal reminders (invoices expiring within N days)
export const getRenewalReminders = createAsyncThunk(
  'renewalReminder/getRenewalReminders',
  async (data, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (data?.days) {
        queryParams.append('days', data.days);
      }

      const url = `api/billing/renewalreminder${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await getApi({ url: url });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

