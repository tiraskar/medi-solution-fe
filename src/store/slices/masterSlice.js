import { createSlice } from '@reduxjs/toolkit';
import {
    setupEconomicYear,
    adDateToCustomDate,
    fetchEconomicYearList,
    upsertSmsSetting,
    fetchSmsSetting,
    createBranch,
    getBranchList,
    getUserPermission,
    getUsersList,
    getDashboardReport,
} from '../../api/master.api';

const initialValues = {
    loading: false,
    isError: false,
    isSuccess: false,
    economicYears: [],
    smsSetting: null,
    customDate: null,
    error: null,
    selectedBranch: null,
    isOpenCreateBranchModel: false,
    searchFilter: {
        searchStatus: 'active',
    },
    branchList: [],
    pagination: {
        page: 1,
        limit: 10,
    },
    usersList: [],
    userPermission: null,
    settingActiveTab: 'profile',
    dashboardData: null
};

const masterSlice = createSlice({
    name: 'master',
    initialState: initialValues,
    reducers: {
        clearError: (state) => {
            state.isError = false;
            state.error = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
        toggleCreateUpdateBranchModel: (state, action) => {
            state.isOpenCreateBranchModel = action.payload;
        },
        toggleSelectedBranch: (state, action) => {
            state.selectedBranch = action.payload;
        },
        updateSearchFilter: (state, action) => {
            const { name, value } = action.payload;
            state.searchFilter[name] = value;
        },
        setSettingActiveTab: (state, action) => {
            state.settingActiveTab = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Economic Year operations
        builder
            .addCase(setupEconomicYear.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(setupEconomicYear.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(setupEconomicYear.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(adDateToCustomDate.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(adDateToCustomDate.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.customDate = action.payload.data;
            })
            .addCase(adDateToCustomDate.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(fetchEconomicYearList.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(fetchEconomicYearList.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.economicYears = action.payload
            })
            .addCase(fetchEconomicYearList.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            // SMS Setting operations
            .addCase(upsertSmsSetting.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(upsertSmsSetting.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(upsertSmsSetting.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })
            .addCase(fetchSmsSetting.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(fetchSmsSetting.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.smsSetting = action.payload.data;
            })
            .addCase(fetchSmsSetting.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
        builder
            .addCase(createBranch.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(createBranch.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
            })
            .addCase(createBranch.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
        builder
            .addCase(getBranchList.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(getBranchList.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.branchList = action.payload;
            })
            .addCase(getBranchList.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
        builder
            .addCase(getUserPermission.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(getUserPermission.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.userPermission = action.payload;
            })
            .addCase(getUserPermission.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });

        builder
            .addCase(getUsersList.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(getUsersList.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.usersList = action.payload;
            })
            .addCase(getUsersList.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });

        builder
            .addCase(getDashboardReport.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(getDashboardReport.fulfilled, (state, action) => {
                state.loading = false;
                state.isError = false;
                state.dashboardData = action.payload;
            })
            .addCase(getDashboardReport.rejected, (state) => {
                state.loading = false;
                state.isError = true;
                state.error = null;
            });

    },
});

export const { clearError, clearSuccess, toggleCreateUpdateBranchModel,
    toggleSelectedBranch, updateSearchFilter, setSettingActiveTab
} = masterSlice.actions;
export default masterSlice.reducer;
