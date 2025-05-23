// import {} from 

import {configureStore} from '@reduxjs/toolkit'
import {authReducer} from './slices/store/authSlice'
import { authApi } from './services/store/authServices'
import { productApi } from './services/store/productServices'
import { driveServiceApi } from './services/dashboad/driveServices'
import { paymentApi } from './services/store/paymentServices'
import { cartApi } from './services/store/cartServices'
import { adminReducer } from './slices/dashboard/adminSlice'
import { adminAuthApi,driveSetupApi } from './services/dashboad/adminAuthServices'
import { dashProductApi } from './services/dashboad/dashProductServices'
import {globleReducer} from './slices/globleSlice.js';
export const store=configureStore({
    reducer:{
        authReducer,
        globle:globleReducer,
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]:productApi.reducer,
        [driveServiceApi.reducerPath]:driveServiceApi.reducer,
        [paymentApi.reducerPath]:paymentApi.reducer,
        [cartApi.reducerPath]:cartApi.reducer,
//  dashboard reducer
    adminReducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [driveSetupApi.reducerPath]:driveSetupApi.reducer,
        [dashProductApi.reducerPath]:dashProductApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([authApi.middleware,productApi.middleware,driveServiceApi.middleware,paymentApi.middleware,cartApi.middleware,adminAuthApi.middleware,driveSetupApi.middleware,dashProductApi.middleware]),
        devTools: import.meta.VITE_NODE_ENV !== 'production' || false,
    })