import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useVerifyQuery } from "./services/store/authServices";
import { useSelector } from "react-redux";
import { LoggedUser } from "./slices/store/authSlice";
import { useEffect } from "react";
// import { getUser } from "../auth";
export const getUser = () => {
  return {
    isAuthenticated: true,
    role: 'store', // or 'dashboard'
  };
};
const ProtectedRoute = ({ allowedRoles ,children},) => {
  // const { isAuthenticated, role } = getUser();
  const { isAuthenticated, role } = useSelector(state=>state.authReducer);
  // const verifyUser=useVerifyQuery();
  const { data, refetch } = useVerifyQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: false,
  })
  
  const navigate=useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
// console.log("hello",data,isAuthenticated,role,path);
// && !location?.pathname=="/user/login"
useEffect(() => {
   
  if(isAuthenticated){
    location.pathname=="/user/login" && navigate("/");
    // navigate(`/user/login`,);
  }
  else{
    // location.pathname!=="/user/login" && navigate("/user/login");
    // navigate(`/user/login`);
  }
  
  console.log(data?.isAuthenticated,location,data);
  return () => {

  }
}, [isAuthenticated])
// const { pathname } = useLocation();

useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' }); // or remove behavior for instant scroll
}, [location?.pathname]);




  // if (!allowedRoles.includes(role)) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    children
  );
};

export default ProtectedRoute;