import React, { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './components/Store/Navbar'
// import DashboardLayout from './pages/dasboard/Layout.jsx';
const DashboardLayout = React.lazy(() => import('./pages/dasboard/Layout.jsx'));
import { classSwitch } from './components/Shared/ThemeToggleButton.jsx';
import { useVerifyQuery } from './services/store/authServices.jsx';
import { useDispatch, useSelector } from 'react-redux';
const LazyLoadingDashboard = React.lazy(() => import('./components/Dashboard/LazyComponent.jsx').then(module => ({ default: module.LazyLoadingDashboard })));
function Layout({role}) {

   useEffect(() => {

    const saved = localStorage.getItem("theme");
      document.documentElement.setAttribute("data-theme",saved || "dark");
      classSwitch(saved);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }, []);
 const { data, refetch } = useVerifyQuery(undefined, {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: false,
    })
    const {forceLogout} = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate=useNavigate();

  useEffect(() => {
    if (forceLogout) {
      dispatch({ type: 'auth/clearForceLogout' }); // clear flag
      navigate('/user/login'); // ⬅ redirect
    }
  }, [forceLogout, dispatch, navigate]);

  return (
    <div className='light:bg-light flex  flex-col overflow-auto min-h-screen min-w-screen max-w-screen dark:bg-primary   scroll-hide'>

    <Navbar/>
    <Outlet/>

    </div>
    

  )
}

export default Layout