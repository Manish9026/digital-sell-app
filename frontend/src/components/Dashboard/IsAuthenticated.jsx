import React, {  useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import  {useLocation, useNavigate} from 'react-router-dom'
import { loginSuccess, setFirstRequest, setNeed2FA } from '../../slices/dashboard/adminSlice';
import { useLazyVerifyAdminQuery } from '../../services/dashboad/adminAuthServices';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { toast } from '../Shared/Toast';
import { useRef } from 'react';

export const CheckingAuth = () => {
  return (
    <div className="fixed dark:bg-primary light:bg-light  w-full h-full  flex items-center justify-center z-50 dark:text-white light:text-primary p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="inline-block will-change-transform p-4 rounded-full dark:bg-slate-800/50 light:bg-blue-500  shadow-xl"
        >
          <ShieldCheck size={48} className="text-green-400" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl font-semibold"
        >
          Checking authentication...
        </motion.h2>

        <p className="text-sm md:text-base light:text-slate-500 dark:text-slate-600">
          Please wait while we verify your admin credentials.
        </p>
      </motion.div>
    </div>
  );
};




const IsAuthenticated = ({ navigatePath, children,isAuth=false }) => {
  const { isLoggedIn,need_2fa,firstRequest } = useSelector((state) => state.adminReducer);
  const [trigger, { data, isLoading, isError }] = useLazyVerifyAdminQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location=useLocation();
  const allowedPaths = [
"2fa-verify",
"reset-password",
    "new-password"]

  // console.log(location.pathname.split('/')?.some(path=>allowedPaths.includes(path)),"location.pathname");
  // location.pathname.includes("dashboard/admin-auth/2fa-verify")
  const pathArray=location.pathname.split('/');
  useEffect(() => {


    
    let timer=setTimeout(()=>{
     
if (!(isLoggedIn || (pathArray?.some(path=>allowedPaths.includes(path)) && firstRequest))) {
  // hasRun.current=false
      trigger()
        .unwrap()
        .then((res) => {
            // console.log(res,"response");
            dispatch(setFirstRequest(true))
               if (res?.need_2fa) {
                       
                  navigate("/dashboard/admin-auth/2fa-verify");
                  dispatch(setNeed2FA(true));
                  return toast({
                      title: "Verification required",
                      description: "Please enter the code sent to your device",
                      toastType:""
                    });
            }
          // Assuming response is valid if token/session is valid
          dispatch(loginSuccess(res));
        })
        .catch((err) => {



            // console.log(err,"error");
            dispatch(setFirstRequest(true))
            
          // console.error('Auth failed:', err);
          if(!pathArray?.includes("admin-auth")){
          navigate('/dashboard/admin-auth');
                    return toast({
                      title: "Validations Error!",
                      description: err?.data?.message,
                      toastType:"error"
                    });}
        });
    }
    else{

        if(isLoggedIn && navigatePath){
            navigate(navigatePath)
        }
    }

    },1000)
    
    return ()=>clearTimeout(timer);
  }, [isLoggedIn, trigger, dispatch, navigate]);

  if ( !isLoggedIn || isLoading) {
    if(isAuth)
    return <>{children}</>; 
    return <CheckingAuth/>
  }
    // return <CheckingAuth/>
 
 
    if(isLoggedIn)
    return <>{children}</>;
};

const Authenticated=({children})=>{
const { isLoggedIn,admin } = useSelector((state) => state.adminReducer);

if (!isLoggedIn) return null;

  // Render prop pattern: if `children` is a function, call it
  console.log(typeof children);
  
  if (typeof children === 'function') {
    return children({ admin });
  }

  return <>{children}</>;
}

const UnAuthenticated=({children})=>{
const { isLoggedIn,admin } = useSelector((state) => state.adminReducer);


    if(!isLoggedIn) {
        // return <>{children}</>
        return React.Children.map(children, child =>
    React.cloneElement(child, { admin })
  );
    }
    
}

export { IsAuthenticated, Authenticated, UnAuthenticated };
// export default { IsAuthenticated, Authenticated, UnAuthenticated};