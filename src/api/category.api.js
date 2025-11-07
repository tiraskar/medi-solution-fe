import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteApi, getApi, postApi, putApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { toggleCreateModelOpen, toggleSelectedCategory, toggleSelectedSubCategory } from "../store/slices/categorySlice";

export const createCategory = createAsyncThunk(
    'category/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: `api/master/createcategory`, body: data });

            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                dispatch(fetchCategories());
                toast.success('Category created successfully!!!');
                dispatch(toggleCreateModelOpen(false));
                return response;
            }
        } catch (error) {
            toast.error('Category creation failed');
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateCategory = createAsyncThunk(
    'category/update',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            const { selectedCategory } = getState().category;
            const response = await putApi({ url: `api/master/updatecategory/${selectedCategory.id}`, body: data });

            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                dispatch(fetchCategories());
                toast.success('Category updated successfully!!!');
                dispatch(toggleCreateModelOpen(false));
                dispatch(toggleSelectedCategory(null));
                return response;
            }
        } catch (error) {
            toast.error('Category update failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'category/delete',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await deleteApi({ url: `api/master/deletecategory/${data.id}` });
            dispatch(fetchCategories());
            toast.success('Category deleted successfully!!!');
            return response;
        } catch (error) {
            toast.error('Category deletion failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'category/fetch',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { pagination, searchFilter } = getState().category;
            const response = await getApi({ url: `api/master/getallcategories?status=${searchFilter.searchStatus}&page=${pagination.page}&limit=${pagination.limit}` });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createSubCategory = createAsyncThunk(
    'subCategory/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: 'api/master/sub-categories', body: data });
            dispatch(fetchSubCategories());
            dispatch(toggleSelectedSubCategory(null));
            dispatch(toggleCreateModelOpen(false));
            toast.success('Sub category created successfully!!!');
            return response;
        } catch (error) {
            toast.error('Sub category creation failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateSubCategory = createAsyncThunk(
    'subCategory/update',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            const { selectedSubCategory } = getState().category;
            const response = await putApi({ url: `api/master/sub-categories/${selectedSubCategory.id}`, body: data });
            dispatch(fetchSubCategories());
            dispatch(toggleSelectedSubCategory(null));
            toast.success('SubCategory updated successfully!!!');
            return response;
        } catch (error) {
            toast.error("SubCategory update failed!!!");
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteSubCategory = createAsyncThunk(
    'subCategory/delete',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await deleteApi({ url: `api/master/sub-categories/${data.id}` });
            dispatch(fetchSubCategories());
            toast.success('SubCategory deleted successfully!!!');
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchSubCategories = createAsyncThunk(
    'subCategory/fetch',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { pagination, searchFilter } = getState().category;
            const response = await getApi({ url: `api/master/sub-categories?status=${searchFilter.searchStatus}&page=${pagination.page}&limit=${pagination.limit}&categoryId=${searchFilter.categoryId}` });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllCategoriesList = createAsyncThunk(
    'category/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/master/categories-all` });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const getAllSubCategoriesList = createAsyncThunk(
    'subCategory/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/master/sub-categories-all` });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getSubCategoryByCategory = createAsyncThunk(
    'subCategory/getByCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: `api/master/sub-category-by-category/${categoryId}` });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

