import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteApi, getApi, postApi, putApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";

// Create Cash Invoice
export const createCashInvoice = createAsyncThunk(
    "cashInvoice/createCashInvoice",
    async (cashInvoiceData, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState().cashInvoice;
            const { searchFilter, pagination } = state;
            const response = await postApi({ url: "api/cashinvoice/create", body: cashInvoiceData });
            toast.success('Cash invoice created successfully!!!');
            dispatch(getCashInvoiceById(response?.data?.id));
            dispatch(fetchCashInvoiceList({ ...searchFilter, ...pagination }));
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create cash invoice"
            );
        }
    }
);

// Get All Cash Invoices
export const fetchCashInvoiceList = createAsyncThunk(
    "cashInvoice/fetchCashInvoiceList",
    async (filters = {}, { rejectWithValue }) => {
        try {

            const params = new URLSearchParams();

            if (filters.page) params.append("page", filters.page);
            if (filters.limit) params.append("limit", filters.limit);
            if (filters.search) params.append("search", filters.search);
            if (filters.payment_method) params.append("payment_method", filters.payment_method);
            if (filters.status !== undefined) params.append("status", filters.status);
            if (filters.branch_id) params.append("branch_id", filters.branch_id);
            if (filters.functional_year_id) params.append("functional_year_id", filters.functional_year_id);

            const response = await getApi({ url: `api/cashinvoice/list?${params.toString()}` });
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cash invoices"
            );
        }
    }
);

// Get Cash Invoice by ID
export const getCashInvoiceById = createAsyncThunk(
    "cashInvoice/getCashInvoiceById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/cashinvoice/${id}` });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cash invoice"
            );
        }
    }
);

// Update Cash Invoice
export const updateCashInvoice = createAsyncThunk(
    "cashInvoice/updateCashInvoice",
    async ({ id, ...updateData }, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState().cashInvoice;
            const { searchFilter, pagination } = state;
            const response = await putApi({ url: `api/cashinvoice/${id}`, body: updateData });
            toast.success('Cash invoice updated successfully!!!');
            dispatch(fetchCashInvoiceList({ ...searchFilter, ...pagination }));
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update cash invoice"
            );
        }
    }
);

// Delete Cash Invoice
export const deleteCashInvoice = createAsyncThunk(
    "cashInvoice/deleteCashInvoice",
    async (id, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState().cashInvoice;
            const { searchFilter, pagination } = state;
            const response = await deleteApi({ url: `api/cashinvoice/${id}` });
            dispatch(fetchCashInvoiceList({ ...searchFilter, ...pagination }));
            toast.success('Cash invoice deleted successfully!!!');
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete cash invoice"
            );
        }
    }
);

// Get Cash Invoices by Vehicle
export const getCashInvoicesByVehicle = createAsyncThunk(
    "cashInvoice/getCashInvoicesByVehicle",
    async ({ vehicleId, filters = {} }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();

            if (filters.page) params.append("page", filters.page);
            if (filters.limit) params.append("limit", filters.limit);

            const response = await getApi(
                `/cashinvoice/vehicle/${vehicleId}?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch vehicle cash invoices"
            );
        }
    }
);