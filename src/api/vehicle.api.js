import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteApi, getApi, postApi, putApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { setActiveTab, toggleEditVehicle, toggleSelectedVehicle } from "../store/slices/vehicleSlice";

export const createVehicleRegistration = createAsyncThunk(
    'vechile/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: `api/master/creatememberregistartion`, body: data, contentType: "multipart/form-data" });
            dispatch(getAllVehicleRegistration());
            toast.success('Vehicle registered saved successfully!!!');
            dispatch(setActiveTab('list'));
            return response;
        } catch (error) {
            toast.error('Vehicle registered creation failed');
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateVehicleRegistration = createAsyncThunk(
    'vechile/update',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            const { editVehicle } = getState().vehicle;
            const response = await putApi({ url: `api/master/updatememberregistartion/${editVehicle.id}`, body: data, contentType: "multipart/form-data" });

            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                dispatch(getAllVehicleRegistration());
                dispatch(toggleEditVehicle(null))
                toast.success('Vehicle registered updated successfully!!!');
                dispatch(toggleSelectedVehicle(null));
                dispatch(setActiveTab('list'));
                return response;
            }
        } catch (error) {
            toast.error('Vehicle registered update failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteVehicleRegistration = createAsyncThunk(
    'vechile/delete',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await deleteApi({ url: `api/master/deletememberregistartion/${data.id}` });
            dispatch(getAllVehicleRegistration());
            toast.success('Vehicle registered deleted successfully!!!');
            return response;
        } catch (error) {
            toast.error('Vehicle registered deletion failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllVehicleRegistration = createAsyncThunk(
    'vechile/getAll',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { pagination, searchFilter } = getState().vehicle;
            const status = searchFilter?.searchStatus == 'active' ? 1 : 0;
            const response = await getApi({ url: `api/master/getmemberregistartionpagination?page=${pagination.page}&limit=${pagination.limit}&status=${status}` });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllVehicleList = createAsyncThunk(
    'vechile/getAllOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/master/getvechiles-dropdown` });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

