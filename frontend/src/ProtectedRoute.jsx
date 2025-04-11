import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { getUser } from "../auth";
export const getUser = () => {
  return {
    isAuthenticated: true,
    role: 'store', // or 'dashboard'
  };
};
const ProtectedRoute = ({ allowedRoles ,children},) => {
  const { isAuthenticated, role } = getUser();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
console.log(path);


  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // if (!allowedRoles.includes(role)) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    children
  );
};

export default ProtectedRoute;