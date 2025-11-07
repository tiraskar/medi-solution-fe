import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteApi, getApi, postApi, putApi } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { toggleSelectedUser, toggleUserCreateModelOpen } from "../store/slices/usersSlice";

export const createUser = createAsyncThunk(
    'user/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await postApi({ url: `api/master/user`, body: data });
            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                dispatch(getAllUserList());
                toast.success('User created successfully!!!');
                dispatch(toggleUserCreateModelOpen(false));
                return response;
            }
        } catch (error) {
            toast.error('User creation failed');
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            const { selectedUser } = getState().users;
            const response = await putApi({ url: `api/master/user/${selectedUser.user_id}`, body: data });

            if (response.status == false) {
                toast.error(response.message);
                return response;
            } else {
                dispatch(getAllUserList());
                toast.success('User updated successfully!!!');
                dispatch(toggleUserCreateModelOpen(false));
                dispatch(toggleSelectedUser(null));
                return response;
            }
        } catch (error) {
            toast.error('User update failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await deleteApi({ url: `api/master/user/${data.user_id}` });
            dispatch(getAllUserList());
            toast.success('User deleted successfully!!!');
            return response;
        } catch (error) {
            toast.error('User deletion failed!!!');
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllUserList = createAsyncThunk(
    'user/getAll',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { pagination, searchFilter } = getState().users;
            const status = searchFilter?.searchStatus == 'active' ? 1 : 0;
            const response = await getApi({ url: `api/master/user?page=${pagination.page}&limit=${pagination.limit}&status=${status}&name=${searchFilter.username}` });
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

