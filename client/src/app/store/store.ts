import {configureStore, legacy_createStore} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { catalogApi } from "../../features/catalog/catalogApi";
import { uiSlice } from "../layout/uiSlice";
import {catalogSlice} from "../../features/catalog/catalogSlice.ts";
import {accountApi} from "../../features/account/accountApi.ts";
import {orderApi} from "../../features/orders/orderApi.ts";
import {adminApi} from "../../features/admin/adminApi.ts";
import counterReducer from "../../features/contact/counterReducer.ts";

export function configureTheStore() {
    return legacy_createStore(counterReducer)
}

export const store = configureStore({
    reducer: {
        [catalogApi.reducerPath]: catalogApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        ui: uiSlice.reducer,
        catalog: catalogSlice.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            catalogApi.middleware, 
            accountApi.middleware,
            orderApi.middleware,
            adminApi.middleware
        )
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()