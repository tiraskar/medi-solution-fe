import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// reducers
import authReducer from "./slices/authSlice";
import doctorReducer from "./slices/doctorSlice"; // ✅ different name
import agentReducer from "./slices/agentSlice";
import testRateReducer from "./slices/testRateSlice";

import patientReducer from "./slices/patientSlice";
import categoryReducer from "./slices/categorySlice";
import masterReducer from "./slices/masterSlice";
import accountingReducer from "./slices/accountingSlice";
import userReducer from "./slices/usersSlice";
import billingTitleReducer from "./slices/billingTitleSlice";
import testReducer from "./slices/testSlice";
import testGroupReducer from "./slices/testGroupSlice";
import vehicleReducer from "./slices/vehicleSlice";
import vehicleInvoiceReducer from "./slices/vehicleInvoiceSlice";
import cashInvoiceReducer from "./slices/cashInvoiceSlice";
import vehicleExpiryReportReducer from "./slices/vehicleExpiryReportSlice";
import renewalReminderReducer from "./slices/renewalReminderSlice";


// 👉 custom storage wrapper
import storageWithMidnightExpiry from "./storageWithMidnightExpiry";

const authPersistConfig = {
  key: "auth",
  storage: storageWithMidnightExpiry,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  doctor: doctorReducer, // ✅ added doctor slice here
  agent: agentReducer,
  patient: patientReducer,
  test: testReducer,
  testGroup: testGroupReducer,
  category: categoryReducer,
  master: masterReducer,
  accounting: accountingReducer,
  users: userReducer,
  testRates :testRateReducer,
  billingTitle: billingTitleReducer,
  vehicle: vehicleReducer,
  vehicleInvoice: vehicleInvoiceReducer,
  cashInvoice: cashInvoiceReducer,
  vehicleExpiryReport: vehicleExpiryReportReducer,
  renewalReminder: renewalReminderReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ["register"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
