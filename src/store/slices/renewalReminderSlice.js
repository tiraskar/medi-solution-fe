import { createSlice } from '@reduxjs/toolkit';
import { getRenewalReminders } from '../../api/renewalReminder.api';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const renewalReminderSlice = createSlice({
  name: 'renewalReminder',
  initialState,
  reducers: {
    clearRenewalReminderError: (state) => {
      state.error = null;
    },
    clearRenewalReminderData: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRenewalReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRenewalReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.invoices || [];
      })
      .addCase(getRenewalReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch renewal reminders';
        state.data = [];
      });
  },
});

export const { clearRenewalReminderError, clearRenewalReminderData } = renewalReminderSlice.actions;
export default renewalReminderSlice.reducer;

