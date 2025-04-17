

import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom'
import App from './App'
import 'keen-slider/keen-slider.min.css';
import PaymentSuccessPage, { PaymentWaiting } from './component/PaymentSuccess'
import  Layout  from './Layout'
import ProtectedRoute from './ProtectedRoute'
import LoadingScreen from './component/Shared/LoadingComponent'
import ProductPage from './pages/store/ProductPage'
import { productApi, useGetSingleProductQuery } from './services/store/productServices'
import { store } from './store'
import ScrollToTop from './component/Shared/ScrollTop';
// import CartPage from './pages/store/CartPage';
const CartPage=lazy(()=>import('./pages/store/CartPage'));
// import { LoginForm, RegistrationForm } from './component/Store/AuthForm'
const DashboardHome=lazy(()=>import('./pages/dasboard/Home'));
const LoginForm =lazy(()=>import('./component/Store/AuthForm').then(module=>({default:module.LoginForm})));
const RegistrationForm =lazy(()=>import('./component/Store/AuthForm').then(module=>({default:module.RegistrationForm})));
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
      <ScrollToTop/>
      <Layout role="store" />
    </ProtectedRoute>
  );
};

export async function userLoader({ params }) {
  const promise = store.dispatch(
    productApi.endpoints.getSingleProduct.initiate(params.prdId)
  );

  try {
    const result = await promise.unwrap();
    console.log(result, "result");
    
    return result;
  } finally {
    store.dispatch(productApi.util.resetApiState()); // optional: clean up
  }
}

export function RoutesProvider() {

  // const loaction=useLocation();
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
            path:"user/cart",
            element:<CartPage/>,

          },
          {
            path:"/user/login",
            element:<LoginForm/>
          },
          {
            path:"/user/register",
            element:<RegistrationForm/>
          },
          {
            path:"/product/:prdId",
            element:<ProductPage/>,
            // loader:()=>userLoader
          },
          {
            path:"/user/payment-success",
            element:<PaymentSuccessPage/>
          },
          {
              path:"/user/payment-waiting",
              element:<PaymentWaiting/>
            },

            {
              path:'/loading/:prdId',
              element:<ProductPage/>,
              loader:async ({params})=>{

                console.log(params,"data");
                
              }


            },
            {
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