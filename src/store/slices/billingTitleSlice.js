

import { createSlice } from '@reduxjs/toolkit';
import { createBillingTitle, createBillingTitleMapping, deleteBillingTitle, deleteBillingTitleMapping, getAllBillingTitleList, getAllLabelList, getBillingTitleList, getBillingTitleMappingList, updateBillingTitle, updateBillingTitleMapping } from '../../api/billingTitle.api';


const initialValues = {
    loading: false,
    isError: false,
    isSuccess: false,
    billingTitles: [],
    billingTitleMappingList: [],
    error: null,
    selectedBillingTitle: null,
    searchFilter: {
        searchStatus: 1,
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0
    },
    isCreateModelOpen: false,
    billingTitlesOptions: [],
    selectedBillingTitleMapping: null,
    billingTitleOptions: [],
    labelOptions: []

};

const billingTitleSlice = createSlice({
    name: 'billingTitle',
    initialState: initialValues,
    reducers: {
        clearError: (state) => {
            state.isError = false;
            state.error = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
        toggleSelectedBillingTitle: (state, action) => {
            state.selectedBillingTitle = action.payload;
        },
        updateSearchFilter: (state, action) => {
            const { name, value } = action.payload;
            state.searchFilter[name] = value;
        },
        updatePagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        toggleCreateModelOpen: (state, action) => {
            state.isCreateModelOpen = action.payload;
        },
        toggleSelectedBillingTitleMapping: (state, action) => {
            state.selectedBillingTitleMapping = action.payload;
        },
        resetSearchFilter: (state) => {
            state.searchFilter = {
                searchStatus: 'active',
            };
        }

    },
    extraReducers: (builder) => {
        // Category operations
        builder
            .addCase(createBillingTitle.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(createBillingTitle.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(createBillingTitle.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(updateBillingTitle.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(updateBillingTitle.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(updateBillingTitle.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(deleteBillingTitle.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(deleteBillingTitle.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(deleteBillingTitle.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(getBillingTitleList.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(getBillingTitleList.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.billingTitles = action.payload.data || [];
                state.pagination.page = action.payload.page || 1;
                state.pagination.total = action.payload.total || 0;
            })
            .addCase(getBillingTitleList.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            // SubCategory operations
            .addCase(createBillingTitleMapping.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(createBillingTitleMapping.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(createBillingTitleMapping.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(updateBillingTitleMapping.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(updateBillingTitleMapping.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(updateBillingTitleMapping.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(deleteBillingTitleMapping.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(deleteBillingTitleMapping.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(deleteBillingTitleMapping.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(getBillingTitleMappingList.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(getBillingTitleMappingList.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.billingTitleMappingList = action.payload.data || [];
                state.pagination.total = action.payload.total || 0;
            })
            .addCase(getBillingTitleMappingList.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
        builder
            .addCase(getAllBillingTitleList.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(getAllBillingTitleList.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.error = null;
                state.billingTitleOptions = action.payload;
            })
            .addCase(getAllBillingTitleList.rejected, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            });
        builder
            .addCase(getAllLabelList.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(getAllLabelList.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.error = null;
                state.labelOptions = action.payload;
            })
            .addCase(getAllLabelList.rejected, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })

    },
});

export const { clearError, clearSuccess, toggleSelectedBillingTitle, updateSearchFilter, resetSearchFilter,
    updatePagination, toggleCreateModelOpen, toggleSelectedBillingTitleMapping
} = billingTitleSlice.actions;
export default billingTitleSlice.reducer;
