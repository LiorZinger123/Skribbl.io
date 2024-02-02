import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root',
    storage,
    version: 1
}

export const store = configureStore({
    reducer: {

    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>