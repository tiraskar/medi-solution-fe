import { createSlice } from '@reduxjs/toolkit';
import { createVehicleRegistration, deleteVehicleRegistration, getAllVehicleList, getAllVehicleRegistration, updateVehicleRegistration } from '../../api/vehicle.api';

const initialValues = {
    loading: false,
    isError: false,
    isSuccess: false,
    vehiclesList: [],
    error: null,
    selectedVehicle: null,
    searchFilter: {
        searchStatus: 1,
        fromDate: '',
        toDate: ''
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0
    },
    isCreateModelOpen: false,
    activeTab: 'list',
    vehicleListOptions: [],
    editVehicle: null,
};

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState: initialValues,
    reducers: {
        clearError: (state) => {
            state.isError = false;
            state.error = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
        toggleSelectedVehicle: (state, action) => {
            state.selectedVehicle = action.payload;
        },
        updateVehicleSearchFilter: (state, action) => {
            const { name, value } = action.payload;
            state.searchFilter[name] = value;
        },
        updatePagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },

        resetVehicleSearchFilter: (state) => {
            state.searchFilter = {
                searchStatus: 'active',
            };
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        toggleEditVehicle: (state, action) => {
            state.editVehicle = action.payload;
        }

    },
    extraReducers: (builder) => {

        builder
            .addCase(createVehicleRegistration.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(createVehicleRegistration.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(createVehicleRegistration.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });

        builder
            .addCase(updateVehicleRegistration.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(updateVehicleRegistration.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(updateVehicleRegistration.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });
        builder.addCase(deleteVehicleRegistration.pending, (state) => {
            state.loading = true;
            state.isError = false;
            state.isSuccess = false;
            state.error = null;
        })
            .addCase(deleteVehicleRegistration.fulfilled, (state) => {
                state.loading = false;
                state.isError = false;
                state.isSuccess = true;
            })
            .addCase(deleteVehicleRegistration.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            });

        builder
            .addCase(getAllVehicleRegistration.pending, (state) => {
                state.loading = true;
                state.isSuccess = false;
            })
            .addCase(getAllVehicleRegistration.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.vehiclesList = action.payload.records;
                state.pagination.total = action.payload.total;
            })
            .addCase(getAllVehicleRegistration.rejected, (state) => {
                state.loading = false;
                state.isSuccess = false;
            });

        builder
            .addCase(getAllVehicleList.pending, (state) => {
                state.loading = true;
                state.isSuccess = false;
            })
            .addCase(getAllVehicleList.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.vehicleListOptions = action.payload;
            })
            .addCase(getAllVehicleList.rejected, (state) => {
                state.loading = false;
                state.isSuccess = false;
            });


    },
});

export const { clearError, clearSuccess, toggleSelectedVehicle, updateVehicleSearchFilter, resetVehicleSearchFilter,
    updatePagination, setActiveTab, toggleEditVehicle
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
