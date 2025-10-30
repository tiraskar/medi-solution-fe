// store/slice/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getUserDetailsById, loginUser } from '../../api/auth.api';

const initialValues = {
    loading: false,
    isError: false,
    isLoggedIn: false,
    userInfo: null,
    isEconomicYearSetUp: false,
    isBranchSetup: false,
    economicYear: null,
    branch: null,
    ledgerMapped: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialValues,
    reducers: {
        logout: () => {
            return initialValues; // reset state to initial
        },
        toggleEconomicYearSetUp: (state, action) => {
            state.isEconomicYearSetUp = action.payload;
        },
        toggleBranchSetUp: (state, action) => {
            state.isBranchSetup = action.payload;
        },
        toggleEconomicYear: (state, action) => {
            state.economicYear = action.payload;
        },
        toggleBranch: (state, action) => {
            state.branch = action.payload;
        },
        toggleLedgerMapped: (state, action) => {
            state.ledgerMapped = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isLoggedIn = false;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
                state.isError = true;
            });

        builder
            .addCase(getUserDetailsById.pending, (state) => {
                state.loading = true;
                state.isError = false;
            })
            .addCase(getUserDetailsById.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(getUserDetailsById.rejected, (state) => {
                state.loading = false;
                state.isError = true;
            });
    },
});

export const { logout, toggleBranchSetUp, toggleEconomicYearSetUp, toggleEconomicYear,
    toggleBranch, toggleLedgerMapped
} = authSlice.actions;
export default authSlice.reducer;
