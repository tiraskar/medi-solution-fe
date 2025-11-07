import { createSlice } from "@reduxjs/toolkit";
import {
    fetchVehicleInvoiceList,
    createVehicleInvoice,
    updateVehicleInvoice,
    deleteVehicleInvoice,
    getVehicleInvoiceById
} from "../../api/vehicleInvoice.api";

const initialState = {
    loading: false,
    isError: false,
    isSuccess: false,
    invoices: [],
    selectedInvoice: null,
    searchFilter: {
        searchStatus: 1,
        paymentStatus: ''
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
    },
    error: null,
    isCreateModalOpen: false,
    printInvoiceData: null
};

const vehicleInvoiceSlice = createSlice({
    name: "vehicleInvoice",
    initialState,
    reducers: {
        toggleCreateModalOpen: (state, action) => {
            state.isCreateModalOpen = action.payload;
        },
        toggleSelectedInvoice: (state, action) => {
            state.selectedInvoice = action.payload;
        },
        updatePagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        updateSearchFilter: (state, action) => {
            const { name, value } = action.payload;
            state.searchFilter[name] = value;
            state.pagination.page = 1;
        },
        clearError: (state) => {
            state.isError = false;
            state.error = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
        printInvoice: (state, action) => {
            state.printInvoiceData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch list
            .addCase(fetchVehicleInvoiceList.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(fetchVehicleInvoiceList.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.invoices = action.payload?.data || [];
                state.pagination.total = action.payload?.total || 0;
            })
            .addCase(fetchVehicleInvoiceList.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            // Create
            .addCase(createVehicleInvoice.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(createVehicleInvoice.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(createVehicleInvoice.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            // Update
            .addCase(updateVehicleInvoice.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(updateVehicleInvoice.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(updateVehicleInvoice.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteVehicleInvoice.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(deleteVehicleInvoice.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(deleteVehicleInvoice.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
        builder
            .addCase(getVehicleInvoiceById.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(getVehicleInvoiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.printInvoiceData = action.payload;
            })
            .addCase(getVehicleInvoiceById.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
    },
});

export const {
    toggleCreateModalOpen,
    toggleSelectedInvoice,
    updatePagination,
    updateSearchFilter,
    clearError,
    clearSuccess,
    printInvoice
} = vehicleInvoiceSlice.actions;

export default vehicleInvoiceSlice.reducer;
