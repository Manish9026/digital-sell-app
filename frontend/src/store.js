// import {} from 

import {configureStore} from '@reduxjs/toolkit'
import {authReducer} from './slices/store/authSlice'
import { authApi } from './services/store/authServices'
import { productApi } from './services/store/productServices'
export const store=configureStore({
    reducer:{
        authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]:productApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([authApi.middleware,productApi.middleware]),
    devTools: import.meta.VITE_NODE_ENV !== 'production' || false,
    })