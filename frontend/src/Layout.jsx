import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './component/Store/Navbar'

function Layout({role}) {
  return (
    role=="store"?
    <div className='bg-slate-100 overflow-auto  min-h-screen min-w-screen scroll-hide'>

    <Navbar/>
    <Outlet/>

    </div>
    :
    <div className='bg-slate-100 scroll-auto min-h-screen min-w-screen'>
    {/* <h1>dashboard</h1> */}
    <Navbar/>
        <Outlet/>
    </div>
  )
}

export default Layout