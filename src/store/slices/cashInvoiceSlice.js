import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCashInvoiceList,
    createCashInvoice,
    updateCashInvoice,
    deleteCashInvoice,
    getCashInvoiceById
} from "../../api/cashInvoice.api";

const initialState = {
    loading: false,
    isError: false,
    isSuccess: false,
    cashInvoices: [],
    selectedCashInvoice: null,
    searchFilter: {
        searchStatus: 1,
        payment_method: '',
        search: ''
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
    },
    error: null,
    isCreateModalOpen: false,
    printCashInvoiceData: null
};

const cashInvoiceSlice = createSlice({
    name: "cashInvoice",
    initialState,
    reducers: {
        toggleCreateModalOpen: (state, action) => {
            state.isCreateModalOpen = action.payload;
        },
        toggleSelectedCashInvoice: (state, action) => {
            state.selectedCashInvoice = action.payload;
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
        printCashInvoice: (state, action) => {
            state.printCashInvoiceData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch list
            .addCase(fetchCashInvoiceList.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(fetchCashInvoiceList.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.cashInvoices = action.payload?.data?.cashInvoices || [];
                state.pagination.total = action.payload?.data?.total || 0;
            })
            .addCase(fetchCashInvoiceList.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            // Create
            .addCase(createCashInvoice.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(createCashInvoice.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(createCashInvoice.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            // Update
            .addCase(updateCashInvoice.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(updateCashInvoice.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(updateCashInvoice.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteCashInvoice.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(deleteCashInvoice.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(deleteCashInvoice.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
        builder
            .addCase(getCashInvoiceById.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(getCashInvoiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
                state.printCashInvoiceData = action.payload;
            })
            .addCase(getCashInvoiceById.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
    },
});

export const {
    toggleCreateModalOpen,
    toggleSelectedCashInvoice,
    updatePagination,
    updateSearchFilter,
    clearError,
    clearSuccess,
    printCashInvoice
} = cashInvoiceSlice.actions;

export default cashInvoiceSlice.reducer;
