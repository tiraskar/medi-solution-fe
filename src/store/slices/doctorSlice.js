import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
  getSearchDoctors, // ✅ import your search thunk
} from "../../api/doctor.api";

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    doctors: [], // list of doctors
    selectedDoctor: null,
    loading: false,
    searchFilter: {
      keyword: "", // ⚡ fixed typo: keayword -> keyword
    },
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
  reducers: {
    toggleSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
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
      // ✅ getAllDoctors
      .addCase(getAllDoctors.pending, (state) => {
        state.loading = true;
      })
.addCase(getAllDoctors.fulfilled, (state, action) => {
  state.loading = false;
  // If payload.data exists, use it; otherwise use payload or empty array
  state.doctors = Array.isArray(action.payload)
    ? action.payload
    : action.payload?.data || [];
})
      .addCase(getAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ getDoctorById
      .addCase(getDoctorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(getDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
.addCase(addDoctor.pending, (state) => {
    state.loading = true;
})
.addCase(addDoctor.fulfilled, (state, action) => {
    state.loading = false;
    state.doctors.push(action.payload);
})
.addCase(addDoctor.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || "Failed to add doctor";
})



.addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.error = null; // reset error
      })
      // Fulfilled
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(state.loading);
            
        const index = state.doctors.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) {
          state.doctors[index] = action.payload; // update doctor
        }
      })
      // Rejected
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update doctor";
      })
      // ✅ deleteDoctor
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(
          (d) => d.doctor_id !== action.payload
        );
      })

      // ✅ getSearchDoctors
      .addCase(getSearchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSearchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload; // replace list with search results
      })
      .addCase(getSearchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  toggleSelectedDoctor,
  clearSelectedDoctor,
  updateSearchFilter,
  updatePagination,
} = doctorSlice.actions;

export default doctorSlice.reducer;
