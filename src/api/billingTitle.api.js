import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteApi, getApi, postApi, putApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { toggleCreateModelOpen, toggleSelectedBillingTitle, toggleSelectedBillingTitleMapping } from "../store/slices/billingTitleSlice";
import { toggleLedgerMapped } from "../store/slices/authSlice";
 
export const createBillingTitle = createAsyncThunk(
    'billingTitle/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: `api/master/createbillingtitle`, body: data });
 
            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                dispatch(getBillingTitleList());
                toast.success('Billing title created successfully!!!');
                dispatch(toggleCreateModelOpen(false));
                return response;
            }
        } catch (error) {
            toast.error('Billing title creation failed');
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const updateBillingTitle = createAsyncThunk(
    'billingTitle/update',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            const { selectedBillingTitle } = getState().billingTitle;
            const response = await putApi({ url: `api/master/updatebillingtitle/${selectedBillingTitle.billing_title_id}`, body: data });
 
            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                dispatch(getBillingTitleList());
                toast.success('Billing title updated successfully!!!');
                dispatch(toggleSelectedBillingTitle(null));
                dispatch(toggleCreateModelOpen(false));
                return response;
            }
        } catch (error) {
            toast.error('Category update failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const deleteBillingTitle = createAsyncThunk(
    'billingTitle/delete',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await deleteApi({ url: `api/master/deletebillingtitle/${data.billing_title_id}` });
            dispatch(getBillingTitleList());
            toast.success('Billing title deleted successfully!!!');
            return response;
        } catch (error) {
            toast.error('Billing title deletion failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const getBillingTitleList = createAsyncThunk(
    'billingTitle/fetch',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { pagination, searchFilter } = getState().billingTitle;
            const response = await getApi({ url: `api/master/getbillingtitlepagination?status=${searchFilter.searchStatus}&page=${pagination.page}&limit=${pagination.limit}` });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const createBillingTitleMapping = createAsyncThunk(
    'billingTitleMapping/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: 'api/master/createbillmapping', body: data });
            dispatch(getBillingTitleMappingList());
            dispatch(toggleSelectedBillingTitle(null));
            dispatch(toggleCreateModelOpen(false));
            toast.success('Sub category created successfully!!!');
            return response;
        } catch (error) {
            toast.error('Sub category creation failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const updateBillingTitleMapping = createAsyncThunk(
    'billingTitleMapping/update',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            const { selectedBillingTitleMapping } = getState().billingTitle;
            const response = await putApi({ url: `api/master/updatebillmapping/${selectedBillingTitleMapping.id}`, body: data });
            dispatch(getBillingTitleMappingList());
            dispatch(toggleSelectedBillingTitleMapping(null));
            toast.success('Billing title mapping updated successfully!!!');
            return response;
        } catch (error) {
            toast.error("Billing title mapping update failed!!!");
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const deleteBillingTitleMapping = createAsyncThunk(
    'billingTitleMapping/delete',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await deleteApi({ url: `api/master/deletebillmapping/${data.id}` });
            dispatch(getBillingTitleMappingList());
            toast.success('SubCategory deleted successfully!!!');
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const getBillingTitleMappingList = createAsyncThunk(
    'billingTitleMapping/fetch',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { pagination, searchFilter } = getState().billingTitle;
            const response = await getApi({ url: `api/master/getallbillmapping?status=${searchFilter.searchStatus}&page=${pagination.page}&limit=${pagination.limit}` });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const getAllBillingTitleList = createAsyncThunk(
    'billingTitle/getAllBillingTitleList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/master/get-billings-title-list` });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const getAllLabelList = createAsyncThunk(
    'billingTitle/getAllLabelList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/master/get-label-list` });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
 
export const checkBillingTitleMapped = createAsyncThunk(
    'billingTitle/checkBillingTitleMapped',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/master/check-billing-tile-mapped` });
 
            const notMapped = response.filter(item => item.ledger_id == 0);
 
            if (notMapped.length === 0) {
                dispatch(toggleLedgerMapped('All'));
            } else {
                const labels = notMapped.map(item => item.label).join(', ');
                dispatch(toggleLedgerMapped(labels));
            }
 
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
 