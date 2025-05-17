import React, { Suspense } from 'react'

import { AppSidebar } from "@/components/MainSidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"
import { Outlet } from 'react-router-dom'
import ThemeToggleButton from '../../components/Shared/ThemeToggleButton'
import { IsAuthenticated } from '../../components/Dashboard/IsAuthenticated'
import { LazyLoadingDashboard } from '../../components/Dashboard/LazyComponent'



const DashboardLayout = () => {
  return (
    // <Suspense fallback={<LazyLoadingDashboard/>}>
        <IsAuthenticated>
       <div className='light:bg-light flex  flex-col overflow-auto  min-h-screen min-w-screen max-w-screen dark:bg-primary dark:text-light  scroll-hide  light:text-black '>
<SidebarProvider >
      <AppSidebar variant="inset" />
      <SidebarInset>
          {/* <ThemeToggleButton/> */}
        <SiteHeader />

       <Outlet/>
      </SidebarInset>
    </SidebarProvider>

    </div>
    </IsAuthenticated>
    // </Suspense>
  
   
  )
}

export default DashboardLayout