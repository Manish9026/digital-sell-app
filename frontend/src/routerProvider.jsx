

import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import PaymentSuccessPage, { PaymentWaiting } from './component/PaymentSuccess'
import  Layout  from './Layout'
export function RoutesProvider() {

      const router=createBrowserRouter([{
        path:"",
        element:<Layout/>,
        loader:()=>{
        //   dispatch(isVerified())
          return null
        },
        
        children:[{
          path:'/',
          element:<App/>,

        },
        ,{
          path:"/user/payment-success",
          element:<PaymentSuccessPage/>
        },
        {
            path:"/user/payment-waiting",
            element:<PaymentWaiting/>
          }
        ]
      
      }])
    
      return <Suspense fallback={<div className='flex center w-full h-screen primary-bg '>
    
        <span className='size-[200px] center flex-col text-sky-200 text-xl'>
        {/* <Lottie animationData={pageLoad} loop={true} /> */}
        Loading...
        </span>
      </div>}>
    <RouterProvider router={router}/>
    </Suspense>
    // return  <RouterProvider router={router}/>
    }