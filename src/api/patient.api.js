import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  getApi,
  postFileApi,
  putFileApi,
  deleteApi,
  postApi,
  putApi,
} from "../lib/axiosInstance";
import { clearSelectedPatient } from "../store/slices/patientSlice";

// ✅ Get all patients
export const getAllPatients = createAsyncThunk(
  "patient/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getApi({ url: "api/patient" }); // relative path only
      return data;
    } catch (error) {
      toast.error("Failed to fetch patients");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Search patients
export const getSearchPatients = createAsyncThunk(
  "patient/getSearchPatients",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { searchFilter, pagination } = getState().patient;

      const params = {};
      if (searchFilter.keyword) params.keyword = searchFilter.keyword;
      // if (pagination.page) params.page = pagination.page;
      // if (pagination.limit) params.limit = pagination.limit;

      const data = await getApi({
        url: "api/patient/search",
        params,
      });

      return data;
    } catch (error) {
      toast.error("Failed to search patients");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Get single patient by ID
export const getPatientById = createAsyncThunk(
  "patient/getById",
  async (patientId, { rejectWithValue }) => {
    try {
      const data = await getApi({
        url: `api/patient/${patientId}`,
      });
      return data;
    } catch (error) {
      toast.error("Failed to fetch patient details");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Add new patient
export const addPatient = createAsyncThunk(
  "patient/add",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const res = await postApi({
        url: "api/patient",
        body: data,
      });

      toast.success("Patient added successfully");
      //   dispatch(getAllPatients());
      return res;
    } catch (error) {
      toast.error("Failed to add patient");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Update patient
export const updatePatient = createAsyncThunk(
  "patient/update",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await putApi({
        url: `api/patient/${id}`,
        body: data,
      });

      toast.success("Patient updated successfully");
      dispatch(clearSelectedPatient());
      return res;
    } catch (error) {
      toast.error("Failed to update patient");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Delete patient
export const deletePatient = createAsyncThunk(
  "patient/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteApi({
        url: `api/patient/${id}`,
      });

      toast.success("Patient deleted successfully");
      dispatch(getAllPatients());
      return id;
    } catch (error) {
      toast.error("Failed to delete patient");
      return rejectWithValue(error.message);
    }
  }
);
