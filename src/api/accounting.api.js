import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteApi, getApi, postApi, putApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { toggleCreateModelOpen, toggleSelectedLedger, toggleSelectedLedgerMapping } from "../store/slices/accountingSlice";
import { checkBillingTitleMapped } from "./billingTitle.api";

// Ledger Group APIs
export const fetchLedgerGroupList = createAsyncThunk(
    'ledger/fetchGroupList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/accounting/getledgergrouplist' });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllLedgerList = createAsyncThunk(
    'ledger/getAllLedgerList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/accounting/getallledgerlist' });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchLedgerSubGroupList = createAsyncThunk(
    'ledger/fetchSubGroupList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/accounting/getledgersubgrouplist' });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Ledger CRUD APIs
export const saveLedger = createAsyncThunk(
    'ledger/save',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: 'api/accounting/saveledger', body: data });
            toast.success('Ledger created successfully!!!');
            dispatch(toggleCreateModelOpen(false));
            dispatch(toggleSelectedLedger(null));
            dispatch(fetchLedgerPagination());
            return response;
        } catch (error) {
            const backendMessage = error?.data?.message || error?.message || 'Ledger update failed!!!';
            toast.error(backendMessage);
            return rejectWithValue(error?.data || error);
        }
    }
);

export const fetchLedgerPagination = createAsyncThunk(
    'ledger/fetchPagination',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState().accounting;
            const { searchFilters, pagination } = state;
            const params = { status: searchFilters.searchStatus, page: pagination.page, limit: pagination.limit, ledgerName: searchFilters.ledgerName };
            const response = await getApi({ url: 'api/accounting/getledgerpagination', params });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateLedger = createAsyncThunk(
    'ledger/update',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await putApi({ url: 'api/accounting/updateledger', body: data });
            toast.success('Ledger updated successfully!!!');
            dispatch(toggleCreateModelOpen(false));
            dispatch(toggleSelectedLedger(null));
            dispatch(fetchLedgerPagination());
            return response;
        } catch (error) {

            const backendMessage = error?.data?.message || error?.message || 'Ledger update failed!!!';
            toast.error(backendMessage);

            return rejectWithValue(error?.data || error);
        }
    }
);

export const fetchActiveLedger = createAsyncThunk(
    'ledger/fetchActive',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/accounting/getactiveledger' });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteLedger = createAsyncThunk(
    'ledger/delete',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await deleteApi({ url: `api/accounting/deleteledger/${data.id}` });
            toast.success('Ledger deleted successfully!!!');
            dispatch(fetchLedgerPagination());
            return response;
        } catch (error) {
            toast.error('Ledger delete failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);

// Ledger Mapping APIs
export const saveLedgerMapping = createAsyncThunk(
    'ledgerMapping/save',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await putApi({ url: 'api/accounting/saveledgermapping', body: data });
            toast.success('Ledger mapped successfully!!!');
            dispatch(toggleSelectedLedgerMapping(null))
            dispatch(fetchLedgerMappingPagination());
            dispatch(checkBillingTitleMapped());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchLedgerMappingPagination = createAsyncThunk(
    'ledgerMapping/fetchPagination',
    async (params, { rejectWithValue, getState }) => {
        try {
            const state = getState().accounting;
            const { pagination } = state;
            const params = { page: pagination.page, limit: pagination.limit };
            const response = await getApi({ url: 'api/accounting/getledgermappingpagination', params });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
); 

export const fetchBankLedger = createAsyncThunk(
    'ledger/fetchBankLedger',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/accounting/getbankledger' });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);