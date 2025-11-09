

import { createSlice } from '@reduxjs/toolkit';
import {
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    fetchSubCategories,
    getAllCategoriesList,
    getAllSubCategoriesList,
    getSubCategoryByCategory
} from '../../api/category.api';

const initialValues = {
    loading: false,
    isError: false,
    isSuccess: false,
    categories: [],
    subCategories: [],
    error: null,
    selectedCategory: null,
    searchFilter: {
        searchStatus: 'active',
        categoryId: ''
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0
    },
    isCreateModelOpen: false,
    categoriesOptions: [],
    selectedSubCategory: null,
    subCategoryByCategoryOptions: [],
    subCategoriesOptions: []

};

const categorySlice = createSlice({
    name: 'category',
    initialState: initialValues,
    reducers: {
        clearError: (state) => {
            state.isError = false;
            state.error = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
        toggleSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
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
        toggleSelectedSubCategory: (state, action) => {
            state.selectedSubCategory = action.payload;
        },
        resetSearchFilter: (state) => {
            state.searchFilter = {
                searchStatus: 'active',
                categoryId: ''
            };
        },
        clearSubCategoryByCategory: (state) => {
            state.subCategoryByCategoryOptions = [];
        }

    },
    extraReducers: (builder) => {
        // Category operations
        builder
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.categories = action.payload.data || [];
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total
                };
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            // SubCategory operations
            .addCase(createSubCategory.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(createSubCategory.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(createSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(updateSubCategory.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(updateSubCategory.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(updateSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(deleteSubCategory.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(deleteSubCategory.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(deleteSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(fetchSubCategories.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(fetchSubCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.subCategories = action.payload.data || [];
            })
            .addCase(fetchSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });

        builder
            .addCase(getAllCategoriesList.pending, (state) => {
                state.loading = true;
                state.isSuccess = false;
            })
            .addCase(getAllCategoriesList.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.categoriesOptions = action.payload;
            })
            .addCase(getAllCategoriesList.rejected, (state) => {
                state.loading = false;
                state.isSuccess = false;
            });

        builder
            .addCase(getAllSubCategoriesList.pending, (state) => {
                state.loading = true;
                state.isSuccess = false;
            })
            .addCase(getAllSubCategoriesList.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.subCategoriesOptions = action.payload;
            })
            .addCase(getAllSubCategoriesList.rejected, (state) => {
                state.loading = false;
                state.isSuccess = false;
            });

        builder
            .addCase(getSubCategoryByCategory.pending, (state) => {
                state.loading = true;
                state.isSuccess = false;
            })
            .addCase(getSubCategoryByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.subCategoryByCategoryOptions = action.payload;
            })
            .addCase(getSubCategoryByCategory.rejected, (state) => {
                state.loading = false;
                state.isSuccess = false;
            });
    },
});

export const { clearError, clearSuccess, toggleSelectedCategory, updateSearchFilter, resetSearchFilter,
    updatePagination, toggleCreateModelOpen, toggleSelectedSubCategory, clearSubCategoryByCategory
} = categorySlice.actions;
export default categorySlice.reducer;
