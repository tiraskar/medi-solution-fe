import { createAsyncThunk } from '@reduxjs/toolkit';
import { postApi, getApi } from '../lib/axiosInstance';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export const loginUser = createAsyncThunk(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postApi({ url: 'api/auth/login', body: data });
            toast.success('Login successful!!!');
            return response;
        } catch (error) {
            toast.error('Invalid username or password');
            return rejectWithValue(error.response.data);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout', async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await postApi({ url: 'api/auth/logout' });
            dispatch(logout());
            toast.success('Logout successful');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

export const getUserDetails = createAsyncThunk(
    'auth/getUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApi({ url: 'api/auth/getuserdetails' });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUserDetailsById = createAsyncThunk(
    'auth/getUserDetailsById',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await getApi({ url: `api/auth/me` });
            // dispatch(getUserPermission(response.user_id)).unwrap().then(res => {
            //     localStorage.setItem('permission', JSON.stringify(res.permission));
            // });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

