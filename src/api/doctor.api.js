import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  deleteApi,
  getApi,
  postFileApi,
  putFileApi,
} from "../lib/axiosInstance";
import { clearSelectedDoctor } from "../store/slices/doctorSlice";

//  Get all doctors
export const getAllDoctors = createAsyncThunk(
  "doctor/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getApi({ url: "api/doctor" }); // only relative path
      return data;
    } catch (error) {
      toast.error("Failed to fetch doctors");
      return rejectWithValue(error.message);
    }
  }
);

// Search doctors
export const getSearchDoctors = createAsyncThunk(
  "doctor/getSearchDoctors",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { searchFilter, pagination } = getState().doctor;

      const params = {};
      if (searchFilter.keyword) params.keyword = searchFilter.keyword;
      if (pagination.page) params.page = pagination.page;
      if (pagination.limit) params.limit = pagination.limit;

      const data = await getApi({
        url: "api/doctor/search",
        params,
      });

      return data;
    } catch (error) {
      toast.error("Failed to fetch doctors");
      return rejectWithValue(error.message);
    }
  }
);

//  Get single doctor by ID
export const getDoctorById = createAsyncThunk(
  "doctor/getById",
  async (doctorId, { rejectWithValue }) => {
    try {
      const data = await getApi({
        url: `api/doctor/${doctorId}`,
      });
      return data;
    } catch (error) {
      toast.error("Failed to fetch doctor details");
      return rejectWithValue(error.message);
    }
  }
);

//  Add a new doctor
export const addDoctor = createAsyncThunk(
  "doctor/add",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const res = await postFileApi({
        url: "api/doctor", // only relative path
        body: data,
      });

      toast.success("Doctor added successfully");
      dispatch(getAllDoctors());
      return res;
    } catch (error) {
      toast.error("Failed to add doctor");
      return rejectWithValue(error.message);
    }
  }
);

//  Update doctor
export const updateDoctor = createAsyncThunk(
  "doctor/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await putFileApi({
        url: `api/doctor/${id}`,
        body: data,
      });

      toast.success("Doctor updated successfully");
      dispatch(clearSelectedDoctor());
      return res;
    } catch (error) {
      toast.error("Failed to update doctor");
      return rejectWithValue(error.message);
    }
  }
);

// Delete doctor
export const deleteDoctor = createAsyncThunk(
  "doctor/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteApi({
        url: `api/doctor/${id}`,
      });

      toast.success("Doctor deleted successfully");
      dispatch(getAllDoctors());
      return id;
    } catch (error) {
      toast.error("Failed to delete doctor");
      return rejectWithValue(error.message);
    }
  }
);
