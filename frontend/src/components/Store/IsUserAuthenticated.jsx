

import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { useLazyVerifyQuery } from '../../services/store/authServices';
import { CheckingAuth } from '../Dashboard/IsAuthenticated';
import { setCredentials } from '../../slices/store/authSlice';

const IsUserAuthenticated = ({navigatePath, children,isAuth=false}) => {
const navigate=useNavigate();
const location=useLocation();
const {isAuthenticated}=useSelector(state=>state.authReducer);
const [trigger,{isLoading}]=useLazyVerifyQuery();
const dispatch=useDispatch();
useEffect(()=>{
if(!isAuthenticated){

    trigger().unwrap().then(res=>{

        console.log(res,"res");
    if(res?.status){
        dispatch(setCredentials(res?.data))
    } 
    }).catch(err=>{

        navigate("/user/login")    
    })
}else{
 console.log();
    navigatePath && navigate(navigatePath || "/")
    
}


},[isAuthenticated])

if(isLoading || !isAuthenticated){
    if(isAuth)
    return <>{children}</>  
    return <CheckingAuth/>
}
  
 if(isAuthenticated){
//   if (typeof children === 'function') {
//     return children({ user });
//   }

    return <>{children}</>
}


}


const UserAuthenticated=({children})=>{
const { isAuthenticated,user } = useSelector((state) => state.authReducer);

if (!isAuthenticated) return null;

  // Render prop pattern: if `children` is a function, call it
  console.log(typeof children);
  
  if (typeof children === 'function') {
    return children({ user });
  }

  return <>{children}</>;
}

const UserUnAuthenticated=({children})=>{
const { isAuthenticated,user } = useSelector((state) => state.authReducer);


    if(!isLoggedIn) {
        // return <>{children}</>
        return React.Children.map(children, child =>
    React.cloneElement(child, { admin })
  );
    }
    
}
export  {IsUserAuthenticated,UserAuthenticated,UserUnAuthenticated}