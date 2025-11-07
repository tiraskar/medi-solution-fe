import { createSlice } from '@reduxjs/toolkit';
import {
    createUser,
    updateUser,
    deleteUser,
    getAllUserList
} from '../../api/user.api';

const initialValues = {
    loading: false,
    isError: false,
    isSuccess: false,
    usersList: [],
    error: null,
    selectedUser: null,
    searchFilter: {
        searchStatus: 'active',
        username: ''
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0
    },
    isCreateModelOpen: false,
};

const userSlice = createSlice({
    name: 'users',
    initialState: initialValues,
    reducers: {
        clearError: (state) => {
            state.isError = false;
            state.error = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
        toggleSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        updateUserSearchFilter: (state, action) => {
            const { name, value } = action.payload;
            state.searchFilter[name] = value;
        },
        updatePagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        toggleUserCreateModelOpen: (state, action) => {
            state.isCreateModelOpen = action.payload;
        },
        resetUserSearchFilter: (state) => {
            state.searchFilter = {
                searchStatus: 'active',
                username: ''
            };
        }

    },
    extraReducers: (builder) => {

        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });

        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
        builder.addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.isError = false;
            state.isSuccess = false;
            state.error = null;
        })
            .addCase(deleteUser.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });

        builder
            .addCase(getAllUserList.pending, (state) => {
                state.loading = true;
                state.isSuccess = false;
            })
            .addCase(getAllUserList.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.usersList = action.payload;
            })
            .addCase(getAllUserList.rejected, (state) => {
                state.loading = false;
                state.isSuccess = false;
            });
    },
});

export const { clearError, clearSuccess, toggleSelectedUser, updateUserSearchFilter, resetUserSearchFilter,
    updatePagination, toggleUserCreateModelOpen,
} = userSlice.actions;
export default userSlice.reducer;
