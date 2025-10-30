import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
// import storage from "redux-persist/lib/storage"; ❌ no longer needed
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

// reducers
import authReducer from "./slices/authSlice";

// 👉 custom storage wrapper
import storageWithMidnightExpiry from "./storageWithMidnightExpiry";

const authPersistConfig = {
    key: 'auth',
    storage: storageWithMidnightExpiry, // ✅ swapped storage
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
    auth: persistedAuthReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: ['register'],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
