import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTests,
  getTestById,
  addTest,
  updateTest,
  deleteTest,
} from "../../api/test.api";

const testSlice = createSlice({
  name: "test",
  initialState: {
    tests: [],
    selectedTest: null,
    loading: false,
    error: null,
    searchFilter: { keyword: "" },
    pagination: { page: 1, limit: 10, total: 0 },
  },
  reducers: {
    clearSelectedTest: (state) => {
      state.selectedTest = null;
    },
    updateSearchFilter: (state, action) => {
      const { name, value } = action.payload;
      state.searchFilter[name] = value;
    },
    updatePagination: (state, action) => {
      // console.log(action.payload);

      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch all tests
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
        state.pagination.total = action.payload?.total;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Get test by ID
      .addCase(getTestById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTest = action.payload;
      })
      .addCase(getTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Add test
      .addCase(addTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests.push(action.payload);
      })
      .addCase(addTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add test";
      })

      // ✅ Update test
      .addCase(updateTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tests.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tests[index] = action.payload;
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update test";
      })

      // ✅ Delete test
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.tests = state.tests.filter((t) => t.id !== action.payload);
      });
  },
});

export const { clearSelectedTest, updateSearchFilter, updatePagination } =
  testSlice.actions;
export default testSlice.reducer;
