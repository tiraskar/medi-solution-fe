import { getApi, postApi, putApi, deleteApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { toggleCreateModalOpen, toggleSelectedInvoice } from "../store/slices/vehicleInvoiceSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all invoices (with pagination)
export const fetchVehicleInvoiceList = createAsyncThunk(
    'vehicleInvoice/fetchList',
    async (_, { rejectWithValue, getState }) => {
        try {

            const state = getState().vehicleInvoice;
            const { searchFilter, pagination } = state;
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                status: searchFilter.searchStatus,
                ...(searchFilter.fromDate && searchFilter.toDate ? {
                    fromDate: searchFilter.fromDate,
                    toDate: searchFilter.toDate
                } : {})
            };
            const response = await getApi({ url: 'api/billing/getallinvoice', params });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Create invoice
export const createVehicleInvoice = createAsyncThunk(
    'vehicleInvoice/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: 'api/billing/createinvoice', body: data });
            toast.success('Invoice created successfully!!!');
            dispatch(toggleCreateModalOpen(false));
            dispatch(toggleSelectedInvoice(null));
            dispatch(fetchVehicleInvoiceList());
            dispatch(getVehicleInvoiceById(response.data.id));
            return response;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to create invoice');
            return rejectWithValue(error?.response?.data);
        }
    }
);

// Update invoice
export const updateVehicleInvoice = createAsyncThunk(
    'vehicleInvoice/update',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await putApi({ url: `api/vehicle-invoice/${data.id}`, body: data });
            toast.success('Invoice updated successfully!!!');
            dispatch(toggleCreateModalOpen(false));
            dispatch(toggleSelectedInvoice(null));
            dispatch(fetchVehicleInvoiceList());
            return response;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update invoice');
            return rejectWithValue(error?.response?.data);
        }
    }
);

// Delete invoice
export const deleteVehicleInvoice = createAsyncThunk(
    'vehicleInvoice/delete',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await deleteApi({ url: `api/billing/invoice/${data.id}` });
            toast.success('Invoice deleted successfully!!!');
            dispatch(fetchVehicleInvoiceList());
            return response;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to delete invoice');
            return rejectWithValue(error?.response?.data);
        }
    }
);

export const getVehicleInvoiceById = createAsyncThunk(
    'vehicleInvoice/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/billing/invoice/${id}` });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
)

export const fetchVehicleList = createAsyncThunk(
    'vehicle/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/vehicle-list' });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchReceiptNo = createAsyncThunk(
    'vehicleInvoice/fetchReceiptNo',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState().auth;
            const { economicYear } = state;
            const response = await getApi({ url: `api/billing/getreceiptno?economic_year_id=${economicYear?.functional_year_id}` });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getVehicleExpiryDate = createAsyncThunk(
    'vehicleInvoice/getVehicleExpiryDate',
    async (data, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/billing/getvehicleexpirydate?vehicle_id=${data.vehicle_id}&billing_title_id=${data.billing_title_id}` });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updatePaymentStatus = createAsyncThunk(
    'vehicleInvoice/updatePaymentStatus',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await putApi({
                url: `api/billing/updatepaymentstatus/${data.id}`, body: {
                    status: data.status
                }
            });
            dispatch(fetchVehicleInvoiceList());
            toast.success('Payment status updated successfully!!!');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);