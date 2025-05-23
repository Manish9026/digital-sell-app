import { createSlice } from "@reduxjs/toolkit";

let initialState={
    cartFly:{
    from: null, // { x, y }
    start: false,
    },
    cartQty:5
    
}
const globleSlice=createSlice({
    name:"globle",
    initialState,
    reducers: {
    triggerFly(state, action) {
      state.cartFly.from = action.payload;
      state.cartFly.start = true;
    },
    clearFly(state) {
      state.cartFly.from = null;
      state.cartFly.start = false;
    },
    setCartQyt(state,{payload}){
      if(payload)
      state.cartQty=payload;
      else
       state.cartQty += 1
    }
  },
})

export const { triggerFly, clearFly,setCartQyt } = globleSlice.actions;
export const globleReducer= globleSlice.reducer;