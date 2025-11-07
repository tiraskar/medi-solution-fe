import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPatients,
  getSearchPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
} from "../../api/patient.api";

const initialState = {
  patients: [],
  selectedPatient: null,
  searchFilter: { keyword: "" },
  pagination: { page: 1, limit: 10, total: 0 },
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    clearSelectedPatient(state) {
      state.selectedPatient = null;
    },
    updateSearchFilter: (state, action) => {
      const { name, value } = action.payload;
      state.searchFilter[name] = value;
    },
    updatePagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllPatients
      .addCase(getAllPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.data || action.payload; // handle both formats
        if (action.payload.total) {
          state.pagination.total = action.payload.total;
        }
      })
      .addCase(getAllPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getSearchPatients
      .addCase(getSearchPatients.fulfilled, (state, action) => {
        state.patients = action.payload.data || action.payload;
      })

      // getPatientById
      .addCase(getPatientById.fulfilled, (state, action) => {
        state.selectedPatient = action.payload;
      })

      // addPatient
      .addCase(addPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPatient.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updatePatient
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePatient.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePatient.rejected, (state) => {
        state.loading = false;
      })

      // deletePatient
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patients = state.patients.filter((p) => p.id !== action.payload);
      });
  },
});

export const {
  clearSelectedPatient,
  updateSearchFilter,
  updatePagination, // ✅ now available
} = patientSlice.actions;

export default patientSlice.reducer;
