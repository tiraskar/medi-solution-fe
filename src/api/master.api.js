import { createAsyncThunk } from "@reduxjs/toolkit";
import { getApi, postApi, putApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { toggleCreateUpdateBranchModel, toggleSelectedBranch } from "../store/slices/masterSlice";
import { logout, toggleBranchSetUp, toggleEconomicYear, toggleEconomicYearSetUp } from "../store/slices/authSlice";
import { getUserDetailsById } from "./auth.api";

// Economic Year APIs
export const setupEconomicYear = createAsyncThunk(
    'economicYear/setup',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: 'api/master/economicyearsetup', body: data });
            dispatch(fetchEconomicYearList());
            toast.success("Economic year setup successfully!!!");
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const adDateToCustomDate = createAsyncThunk(
    'economicYear/adDateToCustomDate',
    async (adDate, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/master/addatetocustomdate?adDate=${adDate}` });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchEconomicYearList = createAsyncThunk(
    'economicYear/fetch',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await getApi({ url: 'api/master/geteconomicyearlist' });
            dispatch(toggleEconomicYearSetUp(response.data.length > 0 ? true : false));
            response?.data.length > 0 && dispatch(toggleEconomicYear(response.data[0]));
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// SMS Setting Info APIs
export const upsertSmsSetting = createAsyncThunk(
    'smsSetting/upsert',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: 'api/master/smssettinginfo', body: data });
            dispatch(fetchSmsSetting());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchSmsSetting = createAsyncThunk(
    'smsSetting/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/master/smssettinginfo' });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const createBranch = createAsyncThunk(
    'branch/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: 'api/master/branch', body: data });
            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                dispatch(getBranchList());
                toast.success('Branch created successfully!!!');
                dispatch(toggleCreateUpdateBranchModel(false));
                return response;
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getBranchList = createAsyncThunk(
    'branch/fetch',
    async (_, { rejectWithValue, getState, dispatch }) => {
        try {
            const { searchFilter } = getState().master;
            const status = searchFilter.searchStatus == 'active' ? 1 : 0;
            const response = await getApi({ url: `api/master/branch?status=${status}` });
            status == 1 && dispatch(toggleBranchSetUp(response.data?.length > 0 ? true : false));
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const updateBranch = createAsyncThunk(
    'branch/update',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            const { selectedBranch } = getState().master;
            const response = await putApi({ url: `api/master/branch/${selectedBranch.branch_id}`, body: data });

            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                toast.success('Branch updated successfully!!!');
                dispatch(getBranchList());
                dispatch(toggleCreateUpdateBranchModel(false));
                dispatch(toggleSelectedBranch(null));
                return response;
            }
        } catch (error) {
            toast.error('Branch update failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUsersList = createAsyncThunk(
    'users/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/auth/users' });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUserPermission = createAsyncThunk(
    'users/fetchPermission',
    async (id, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/auth/userpermission/${id}` });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const saveUserPermission = createAsyncThunk(
    'users/savePermission',
    async ({ userId, data }, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState().auth;
            const { userInfo } = state;
            const response = await postApi({ url: `api/auth/updateuserpermission/${userId}`, body: data });
            toast.success('User permission updated successfully!!!');
            userInfo?.user_id == userId && dispatch(getUserDetailsById());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const changePassword = createAsyncThunk(
    'users/changePassword',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: 'api/auth/changepassword', body: data });
            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                toast.success('Password changed successfully!!!');
                dispatch(logout());
                return response;
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getDashboardReport = createAsyncThunk(
    'dashboardReport/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/report/getdashboardreport' });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);