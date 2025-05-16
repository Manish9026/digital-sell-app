import React, { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Store/Navbar'
// import DashboardLayout from './pages/dasboard/Layout.jsx';
const DashboardLayout = React.lazy(() => import('./pages/dasboard/Layout.jsx'));
import { classSwitch } from './components/Shared/ThemeToggleButton.jsx';

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
  return (
    role=="store"?
    <div className='light:bg-light flex  flex-col overflow-auto min-h-screen min-w-screen max-w-screen dark:bg-primary   scroll-hide'>

    <Navbar/>
    <Outlet/>

    </div>
    :
    <div className='light:bg-light flex  flex-col overflow-auto  min-h-screen min-w-screen max-w-screen dark:bg-primary dark:text-light  scroll-hide  light:text-black'>

      <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
    <DashboardLayout/>
      </Suspense>

    </div>
    // <div className='bg-slate-100 flex flex-col scroll-auto min-h-screen min-w-screen'>
    // {/* <h1>dashboard</h1> */}
    // {/* <Navbar/> */}
    //     <Outlet/>
    // </div>
  )
}

export default Layout