// import {} from 

import {configureStore} from '@reduxjs/toolkit'
import {authReducer} from './slices/store/authSlice'
import { authApi } from './services/store/authServices'
export const store=configureStore({
    reducer:{
        authReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([authApi.middleware]),
    devTools: import.meta.VITE_NODE_ENV !== 'production' || false,
    })