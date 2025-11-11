import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTestGroups,
  fetchTestGroupPagination,
  addTestGroup,
  updateTestGroup,
  deleteTestGroup,
} from "../..//api/testgroup.api";

const initialState = {
  loading: false,
  isError: false,
  isSuccess: false,
  testGroups: [],
  searchFilters: {
    keyword: "",
    status: 1,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  error: null,
  isModalOpen: false,
  selectedGroup: null,
};

const testGroupSlice = createSlice({
  name: "testGroup",
  initialState,
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.error = null;
    },
    clearSuccess: (state) => {
      state.isSuccess = false;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    toggleCreateModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    toggleSelectedGroup: (state, action) => {
      //   console.log(action.payload);

      state.selectedGroup = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all test groups
    builder
      .addCase(fetchTestGroups.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchTestGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        // console.log(action.payload);

        state.testGroups = action.payload || [];
      })
      .addCase(fetchTestGroups.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      });

    // Fetch paginated test groups
    builder
      .addCase(fetchTestGroupPagination.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchTestGroupPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.testGroups = action.payload || [];
        state.pagination.total = action.payload.total || 0;
      })
      .addCase(fetchTestGroupPagination.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      });

    // Add test group
    builder
      .addCase(addTestGroup.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(addTestGroup.fulfilled, (state) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(addTestGroup.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      });

    // Update test group
    builder
      .addCase(updateTestGroup.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(updateTestGroup.fulfilled, (state) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateTestGroup.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      });

    // Delete test group
    builder
      .addCase(deleteTestGroup.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(deleteTestGroup.fulfilled, (state) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(deleteTestGroup.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  updatePagination,
  toggleCreateModal,
  toggleSelectedGroup,
} = testGroupSlice.actions;

export default testGroupSlice.reducer;
