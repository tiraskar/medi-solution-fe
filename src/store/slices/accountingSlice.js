import { createSlice } from "@reduxjs/toolkit";
import {
  fetchLedgerGroupList,
  fetchLedgerSubGroupList,
  saveLedger,
  fetchLedgerPagination,
  updateLedger,
  fetchActiveLedger,
  deleteLedger,
  saveLedgerMapping,
  fetchLedgerMappingPagination,
  getAllLedgerList,
  fetchBankLedger,
  fetchLedger,
} from "../../api/accounting.api";

const initialValues = {
  loading: false,
  isError: false,
  isSuccess: false,
  ledgerGroups: [],
  ledgerSubGroups: [],
  ledgers: [],
  activeLedgers: [],
  ledgerMappings: [],
  searchFilters: {
    searchStatus: 1,
    ledgerName: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  error: null,
  isCreateModelOpen: false,
  selectedLedger: null,
  selectedLedgerMapping: null,
  ledgerOptions: [],
  bankLedgers: [],
};

const accountingSlice = createSlice({
  name: "accounting",
  initialState: initialValues,
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.error = null;
    },
    clearSuccess: (state) => {
      state.isSuccess = false;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    toggleCreateModelOpen: (state, action) => {
      state.isCreateModelOpen = action.payload;
    },
    toggleSelectedLedger: (state, action) => {
      state.selectedLedger = action.payload;
    },
    toggleSelectedLedgerMapping: (state, action) => {
      state.selectedLedgerMapping = action.payload;
    },
    updatePagination: (state, action) => {
      // console.log("payload", action.payload);

      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Ledger Group operations
    builder
      .addCase(fetchLedgerGroupList.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchLedgerGroupList.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.ledgerGroups = action.payload || [];
      })
      .addCase(fetchLedgerGroupList.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchLedgerSubGroupList.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchLedgerSubGroupList.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.ledgerSubGroups = action.payload || [];
      })
      .addCase(fetchLedgerSubGroupList.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      })
      // Ledger CRUD operations
      .addCase(saveLedger.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(saveLedger.fulfilled, (state) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(saveLedger.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchLedger.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.ledgers = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
      })
      .addCase(fetchLedger.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchLedgerPagination.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchLedgerPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.ledgers = action.payload.data || [];
        state.pagination.total = action.payload.total || 0;
      })
      .addCase(fetchLedgerPagination.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(updateLedger.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(updateLedger.fulfilled, (state) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateLedger.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchActiveLedger.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchActiveLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.activeLedgers = action.payload.data || [];
      })
      .addCase(fetchActiveLedger.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(deleteLedger.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(deleteLedger.fulfilled, (state) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(deleteLedger.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      })
      // Ledger Mapping operations
      .addCase(saveLedgerMapping.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(saveLedgerMapping.fulfilled, (state) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(saveLedgerMapping.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchLedgerMappingPagination.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchLedgerMappingPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.ledgerMappings = action.payload.data?.rows || [];
        state.pagination.total = action.payload.data?.total || 0;
      })
      .addCase(fetchLedgerMappingPagination.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      });
    builder
      .addCase(getAllLedgerList.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getAllLedgerList.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.ledgerOptions = action.payload || [];
      })
      .addCase(getAllLedgerList.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      });

    builder
      .addCase(fetchBankLedger.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchBankLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.bankLedgers = action.payload || [];
      })
      .addCase(fetchBankLedger.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setPagination,
  toggleCreateModelOpen,
  toggleSelectedLedger,
  updatePagination,
  toggleSelectedLedgerMapping,
} = accountingSlice.actions;
export default accountingSlice.reducer;
