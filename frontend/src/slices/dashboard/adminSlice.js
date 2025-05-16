import {createSlice} from '@reduxjs/toolkit';






const initialState = {
    admin: {},
    isLoggedIn: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
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
            state.admin = payload;
            state.isError = false;
            state.isSuccess = true;
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
        }, 
    },
});

export const {loginSuccess,loginFailure}= adminSlice.actions;
export const adminReducer = adminSlice.reducer;