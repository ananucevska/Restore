import {configureStore, legacy_createStore} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { catalogApi } from "../../features/catalog/catalogApi";
import { uiSlice } from "../layout/uiSlice";
import {catalogSlice} from "../../features/catalog/catalogSlice.ts";
import {accountApi} from "../../features/account/accountApi.ts";
import {adminApi} from "../../features/admin/adminApi.ts";
import {messagesApi} from "../../features/messages/messagesApi.ts";
import counterReducer from "../../features/contact/counterReducer.ts";

export function configureTheStore() {
    return legacy_createStore(counterReducer)
}

export const store = configureStore({
    reducer: {
        [catalogApi.reducerPath]: catalogApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [messagesApi.reducerPath]: messagesApi.reducer,
        ui: uiSlice.reducer,
        catalog: catalogSlice.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            catalogApi.middleware, 
            accountApi.middleware,
            adminApi.middleware,
            messagesApi.middleware
        )
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()