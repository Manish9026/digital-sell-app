

import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom'
import 'keen-slider/keen-slider.min.css';

import Layout from './Layout'
import ProtectedRoute from './ProtectedRoute'




// import { store } from './store'
/* ------------------------------Shared compmonent import statement------------------- */

const ScrollToTop = lazy(() => import('./components/Shared/ScrollTop').then(module => ({ default: module.ScrollToTop })));
const LoadingScreen = lazy(() => import('./components/Shared/LoadingComponent').then(module => ({ default: module.LoadingScreen })));

/* ------------------------------Dashboard compmonent import statement------------------- */

const AddProductPage = lazy(() => import('./pages/dasboard/AddProduct').then(module => ({ default: module.AddProduct })));
const AuthPage = lazy(() => import('./pages/dasboard/AuthPage').then(module => ({ default: module.AuthPage })));
import { AuthDashboard, DashboardSetting, LazyLoadingDashboard } from './components/Dashboard/LazyComponent';
const DashboardLayout = lazy(() => import('./pages/dasboard/Layout'));
const DashboardHome = lazy(() => import('./pages/dasboard/Home'));
const DashboardSettingLayout = lazy(() => import('./pages/dasboard/SettingPage').then(module => ({ default: module.SettingLayout })));


/* ------------------------------Store compmonent import statement------------------- */
const StoreHome = lazy(() => import('./pages/store/Home'));
const ProfilePage = lazy(() => import('./pages/store/ProfilePage'));
const CartPage = lazy(() => import('./pages/store/CartPage'));
const ProductPage = lazy(() => import('./pages/store/ProductPage').then(module => ({ default: module.ProductPage })));
const LoginForm = lazy(() => import('./components/Store/AuthForm').then(module => ({ default: module.LoginForm })));
const RegistrationForm = lazy(() => import('./components/Store/AuthForm').then(module => ({ default: module.RegistrationForm })));
// payment pages
const PaymentSuccessPage = lazy(() => import('./components/PaymentSuccess').then(module => ({ default: module.PaymentSuccessPage })));
const PaymentWaiting = lazy(() => import('./components/PaymentSuccess').then(module => ({ default: module.PaymentWaiting })));

// NotFoundPage
const NotFoundPage = lazy(() => import('./components/Shared/NotFoundPage'));

/* <-------------------------------------layouts-----------------------------------> */
const DashboardProtectedLayout = () => {
  return (
    <Suspense fallback={<LazyLoadingDashboard />}>
      <ScrollToTop />

      <DashboardLayout />

    </Suspense>

  );
};
const StoreProtectedLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["store"]}>
      <ScrollToTop />
      <Layout role="store" />
    </ProtectedRoute>
  );
};


/* <-------------------------------------Routes-----------------------------------> */
export function RoutesProvider() {

  // const loaction=useLocation();
  const router = createBrowserRouter([{
    path: "",
    children: [

      {
        path: '',
        element: <StoreProtectedLayout />,
        children: [{
          path: "",
          element: <StoreHome />
        },
        {
          path: "user/cart",
          element: <CartPage />,

        },
        {
          path: "/user/profile",
          element: <ProfilePage />,
        },
        {
          path: "/user/login",
          element: <LoginForm />
        },
        {
          path: "/user/register",
          element: <RegistrationForm />
        },
        {
          path: "/product/:prdId",
          element: <ProductPage />,
          // loader:()=>userLoader
        },
        {
          path: "/user/payment-success",
          element: <PaymentSuccessPage />
        },
        {
          path: "/user/payment-waiting",
          element: <PaymentWaiting />
        },

        {
          path: '/loading/:prdId',
          element: <ProductPage />,
          loader: async ({ params }) => {

            console.log(params, "data");

          }


        },
        {
          path: "*",
          element: <NotFoundPage />
        }]

      },
      {
        path: 'dashboard',
        element: <DashboardProtectedLayout />,
        children: [
          {
            path: '',
            element: <DashboardHome />
          },
          {
            path: "product",
            element: <AddProductPage />
          },
          {
            path: "setting",
            element: <DashboardSettingLayout />,
            children: [{
              path: "",
              element: <DashboardSetting.Setting />
            },

            {
              path: "authentication",
              children:[{
                path:"",
                element:<DashboardSetting.Authentication/>,
              },
              {
                path:"setup_2FA",
                element:<AuthDashboard.OTPSetupForm/>
              }
            ]
              
            },
            {
              path:"login-activity",
              element:<DashboardSetting.LoginActivity/>

            },

            {
              path: "drive-setup",
              element: <DashboardSetting.DriveSetting/>,
            },
             {
              path: "notification",
              element: <div className='center flex-1'>Notification</div>,
            },
            {
              path: "network",
              element: <div className='center flex-1'>Network</div>,
            },

            ]
          }

          ,

          {
            path: "*",
            element: <NotFoundPage />
          }
        ]
      }, {
        path: "dashboard/admin-auth",
        element: <AuthPage />,
        children: [{
          path: "",
          element: <AuthDashboard.LoginForm />,
        }, {
          path: "2fa-verify",
          element: <AuthDashboard.TwoFactorForm />
        },
        {
          path: "reset-password",
          element: <AuthDashboard.ForgotPasswordForm />
        },
        {
          path: "new-password",
          element: <AuthDashboard.NewPasswordForm />
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
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
  // </Suspense>
  // return  <RouterProvider router={router}/>
}