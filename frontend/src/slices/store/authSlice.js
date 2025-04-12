import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:null,
        accessToken:null,
        refreshToken:null,
        isAuthenticated:false,
        role:null,
    },
    reducers:{
        setCredentials:(state,{payload})=>{

            state.user=payload?.user || {};
            state.role=payload?.user?.role || null;
            // state.accessToken=action.payload.accessToken;
            // state.refreshToken=action.payload.refreshToken;
            state.isAuthenticated=payload?.isAuthenticated || false;
        },
        logout:(state)=>{
            state.user={};
            state.isAuthenticated=false;
            state.role=null;
        }
    }
})

export const {setCredentials,logout}=authSlice.actions;
export const LoggedUser=(state)=>state.auth;
export const authReducer= authSlice.reducer;