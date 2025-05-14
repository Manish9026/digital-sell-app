import React from 'react'

import { AppSidebar } from "@/components/MainSidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"
import { Outlet } from 'react-router-dom'
import ThemeToggleButton from '../../components/Shared/ThemeToggleButton'



const DashboardLayout = () => {
  return (
    <div className='min-w-screen min-h-screen '>
<SidebarProvider >
      <AppSidebar variant="inset" />
      <SidebarInset>
          {/* <ThemeToggleButton/> */}
        <SiteHeader />

       <Outlet/>
      </SidebarInset>
    </SidebarProvider>

    </div>
  )
}

export default DashboardLayout