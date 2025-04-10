import React from 'react'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='min-h-screen min-w-screen'>

        <Outlet/>
    </div>
  )
}

export default Layout