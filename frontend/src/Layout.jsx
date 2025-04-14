import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './component/Store/Navbar'

function Layout({role}) {

   useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }, []);
  return (
    role=="store"?
    <div className='light:bg-slate-900 flex flex-col overflow-auto  min-h-screen min-w-screen max-w-screen  scroll-hide'>

    <Navbar/>
    <Outlet/>

    </div>
    :
    <div className='bg-slate-100 flex flex-col scroll-auto min-h-screen min-w-screen'>
    {/* <h1>dashboard</h1> */}
    <Navbar/>
        <Outlet/>
    </div>
  )
}

export default Layout