// import {} from 

import {configureStore} from '@reduxjs/toolkit'
import {authReducer} from './slices/store/authSlice'
import { authApi } from './services/store/authServices'
import { productApi } from './services/store/productServices'
import { driveServiceApi } from './services/dashboad/driveServices'
import { paymentApi } from './services/store/paymentServices'
export const store=configureStore({
    reducer:{
        authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]:productApi.reducer,
        [driveServiceApi.reducerPath]:driveServiceApi.reducer,
        [paymentApi.reducerPath]:paymentApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([authApi.middleware,productApi.middleware,driveServiceApi.middleware,paymentApi.middleware]),
        devTools: import.meta.VITE_NODE_ENV !== 'production' || false,
    })