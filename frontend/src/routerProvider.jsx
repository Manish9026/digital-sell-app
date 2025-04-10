

import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import PaymentSuccessPage, { PaymentWaiting } from './component/PaymentSuccess'
import  Layout  from './Layout'
import ProtectedRoute from './ProtectedRoute'
const DashboardHome=lazy(()=>import('./pages/dasboard/Home'));
const StoreHome=lazy(()=>import('./pages/store/Home'));
// NotFoundPage
const NotFoundPage=lazy(()=>import('./component/Shared/NotFoundPage'));
const DashboardProtectedLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["dashboard"]}>
      <Layout role="dashboard" />
    </ProtectedRoute>
  );
};
const StoreProtectedLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["store"]}>
      <Layout role="store" />
    </ProtectedRoute>
  );
};
export function RoutesProvider() {

      const router=createBrowserRouter([{
        path:"",
        children:[
          
          {
          path:'',
          element:<StoreProtectedLayout/>,
          children:[{
            path:"",
            element:<StoreHome/>
          },
          {
            path:"/user/payment-success",
            element:<PaymentSuccessPage/>
          },
          {
              path:"/user/payment-waiting",
              element:<PaymentWaiting/>
            },{
              path:"*",
              element:<NotFoundPage/>
            }]

        },
        {
          path:'dashboard',
          element:<DashboardProtectedLayout/>,
          children:[
            {
              path:'',
              element:<DashboardHome/>
            },{
              path:"*",
              element:<NotFoundPage/>
            }
          ]
        }
        
        ]
      
      }])
    
      // return <Suspense fallback={<div className='flex center w-full h-screen primary-bg '>
    
      //   <span className='size-[200px] center flex-col text-sky-200 text-xl'>
      //   {/* <Lottie animationData={pageLoad} loop={true} /> */}
      //   Loading...
      //   </span>
      // </div>}>
   return  <RouterProvider router={router}  fallbackElement={<p>Loading...</p>}/>
    // </Suspense>
    // return  <RouterProvider router={router}/>
    }