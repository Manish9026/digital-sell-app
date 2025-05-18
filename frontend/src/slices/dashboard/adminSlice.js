import {createSlice} from '@reduxjs/toolkit';






const initialState = {
    admin: {},
    isLoggedIn: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    firstRequest:false,
    need_2fa: false,
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, {payload}) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.admin = payload?.admin || {};
            state.isError = false;
            state.isSuccess = true;
            state.need_2fa=false;
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.errorMessage = action.payload;
        },
        logout: (state) => {
            state.admin = {};
            state.isLoggedIn = false;
            state.firstRequest=false;
        }, 
        setNeed2FA: (state, action) => {
            state.need_2fa = action.payload;
        },
        setFirstRequest: (state, action) => {
            state.firstRequest = action.payload;
        },
        setAdmin:(state,{payload})=>{
            state.admin=payload;
        }
    },
});

export const {loginSuccess,loginFailure,setFirstRequest,logout,setNeed2FA,setAdmin}= adminSlice.actions;
export const adminReducer = adminSlice.reducer;