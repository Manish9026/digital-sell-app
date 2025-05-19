import React, { memo, useEffect, useState,lazy } from "react";
import { AnimatePresence, delay, motion } from "framer-motion";
import { cn } from '@/lib/utils'

import {
  ShieldCheck,
  LockKeyhole,
  Bell,
  Sun,
  Moon,
  Wifi,
  Settings2,
  ToggleLeft,
  ToggleRight,
  SettingsIcon,
  Code,
  icons,
  KeyRound,
  EyeOff,
  Eye,
  Loader2,
  Phone,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, MonitorSmartphone, MapPin, Globe } from "lucide-react";
import { toast } from "../Shared/Toast";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteSessionMutation, useLazyDisabled_2FAQuery, useSessionsQuery } from "../../services/dashboad/adminAuthServices";
import { setAdmin } from "../../slices/dashboard/adminSlice";
// import { Authenticated } from "./IsAuthenticated";
const Alert=lazy(()=>import('../Shared/Alert').then(m=>({ default: m.Alert })))
const styleButton = "fadein center gap-3 border border-slate-300 dark:border-slate-700 px-3 py-2 min-w-[120px] rounded-lg shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 light:hover:text-light"
export const Setting = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggle2FA = () => setIs2FAEnabled((prev) => !prev);


  return (
    <div
      className={` transition-colors duration-300 ${"light:bg-light  light:text-primary dark:bg-primary dark:text-white "
        }`}
    >
      <div className="max-w-3xl  py-12 primary-p">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-10 flex items-center gap-3"
        >

          <Settings2 className="w-7 h-7 text-indigo-500" />

          Settings
        </motion.h1>
        {/* <BreadcrumbCollapsed/> */}

        <div className="space-y-6">
          {/* Authentication */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="light:bg-light/70 shadow-md dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow"
          >
            <Link to={"./authentication"}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-indigo-500" />
                  <h2 className="text-xl font-semibold">Authentication</h2>
                </div>
                <button
                  onClick={toggle2FA}
                  className="focus:outline-none"
                >
                  {is2FAEnabled ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-sm light:text-slate-700 dark:text-slate-400">
                Enable or disable two-factor authentication to add an extra layer of security to your account.
              </p>
            </Link>
          </motion.div>

          {/* login Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="light:bg-light/70 shadow-md dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow"
          >

            <Link to={"./login-activity"}>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="text-indigo-500" />
                <h2 className="text-xl font-semibold">Login Activity / Session Management</h2>
              </div>
              <p className="text-sm light:text-slate-700 dark:text-slate-400">
                List of active sessions with IP, device, location.
              </p>
            </Link>
          </motion.div>
          {/*  */}{/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="light:bg-light/70 shadow-md dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow"
          >

            <Link to={"./notification"}>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="text-indigo-500" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <p className="text-sm light:text-slate-700 dark:text-slate-400">
                Manage your notification preferences, including email alerts, SMS, and push notifications.
              </p>
            </Link>
          </motion.div>

          {/* Network */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="light:bg-light/70 shadow-md dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow"
          >
            <Link to={"./network"}>
              <div className="flex items-center gap-3 mb-4">
                <Wifi className="text-indigo-500" />
                <h2 className="text-xl font-semibold">Network</h2>
              </div>
              <p className="text-sm light:text-slate-700 dark:text-slate-400">
                Configure connection settings and manage trusted devices.
              </p>
            </Link>
          </motion.div>

          {/* Theme */}

        </div>
      </div>
    </div>
  );
};


const SettingCards = memo(({ title, subTitle, children, icons, isActive, delaytime }) => {
  const [isToggled, setIsToggled] = useState(isActive || false);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggled(!isToggled);
  };

  return (
    <motion.div
      className="transition-all duration-700 ease light:bg-light/70 shadow-md dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-4 rounded-xl shadow mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <p className="text-indigo-500">
            {icons || <ShieldCheck className="text-indigo-500" />}
          </p>
          <h2 className="text-xl font-semibold">{title || "Enable 2FA"}</h2>
        </div>
        <button onClick={handleToggle} className="focus:outline-none">
          {isToggled ? (
            <ToggleRight className="w-6 h-6 text-green-500" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </div>

      <p className="text-sm light:text-slate-700 dark:text-slate-400">
        {subTitle ||
          "Enable or disable two-factor authentication to add an extra layer of security to your account."}
      </p>

      <AnimatePresence initial={false} mode="wait">
        {isToggled && (
          <motion.div
            key="toggled-content"
            // layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="mt-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
})

export const Authentication = () => {

  const [password,setPassword]=useState({
    new:{value:"",isShow:false},
    old:{value:"",isShow:false}
  })
  const dispatch=useDispatch();
  const {admin}=useSelector(state=>state.adminReducer);
  const [disabled_2FA,{isLoading:dLoading}]=useLazyDisabled_2FAQuery();
    const handleCopySecret = (e) => {
      // e.stopPropagation()
      navigator.clipboard.writeText("secret key copied");
      toast({
        title: "Secret copied",
        description: "Authentication secret has been copied to clipboard",
      });
    };
  return (


    <motion.section
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="primary-p overflow-hidden "
    >

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-10 flex items-center gap-3"
      >

        <Settings2 className="w-7 h-7 text-indigo-500" />

        Authentication
      </motion.h1>

      {/* <AnimatePresence mode="sync"  initial={{ opacity: 0, }}  > */}

      <SettingCards isActive={admin?.twoFA.enabled} delaytime={1}>
        <div className="flex items-center flex-wrap gap-3 mb-4">
         { !admin?.twoFA.enabled?<Link to={'./setup_2FA'}>
          <button type="button"  className={cn(styleButton)}>
            <SettingsIcon className="text-indigo-500" />
            Setup 2FA
          </button>
         
          </Link>

:<>

<Alert
 CloseButton={
 <button type="button"  className={cn(styleButton,"dark:border-red-500 text-red-500 dark:hover:bg-red-500/50 dark:hover:text-light ",dLoading && styleButton)}>
           {!dLoading? <SettingsIcon className="text-indigo-500" />:
            <Loader2 className="animate-spin duration-300"/>}
            Disabled 2FA
          </button>

}
btnTitle={"Disabled"}


onAllow={async()=>{
// alert("allow")
await disabled_2FA().unwrap().then(res=>{

  if(res?.status){
    dispatch(setAdmin(res?.admin))
  }
  toast({
    title:"Disabled 2FA successfully",
    toastType:"success"
  })
}).catch((err)=>{

})
}}
/>

<button type="button" onClick={handleCopySecret} className={cn(styleButton,"relative")}>
  <p className="absolute border-b-2 rounded-lg shadow-lg -top-4  bg- left-1/2 dark:bg-slate-800 px-2 light:bg-light/70 -translate-x-1/2 border-slate-200 dark:border-slate-700 ">Secret</p>
            <Code className="text-indigo-500" />
            <input type="password" disabled={true} name="" value={admin?.twoFA.secret} className=" outline-none flex-1" id="" />
          </button>

          
</>
          }
          
          
        </div>
      </SettingCards>




      <SettingCards delaytime={2} isActive={true} title={"Change Password"} subTitle={"Change your password to enhance security."} icons={<KeyRound />}>

        <form className="">

          <label htmlFor="pass1" className="flex items-center border border-slate-300 dark:border-slate-700 p-3 rounded-lg shadow-md w-full mb-4 focus:bg-light">
<input id="pass1" onChange={(e)=>setPassword(prev=>({...prev,old:{value:e.target.value,isShow:false}}))} type={password?.old?.isShow?"text":"password"} value={password?.old.value} placeholder="Old Password" className="flex-1 outline-none" />

<button type="button" className="p-1 " onClick={()=>setPassword(prev=>({...prev,old:{isShow:!prev.old.isShow,value:prev.old.value}}))}>
    {!password?.old?.isShow ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
</button>
        
          </label>
          
          <label htmlFor="pass2" className="flex items-center border border-slate-300 dark:border-slate-700 p-3 rounded-lg shadow-md w-full mb-4 focus:bg-light">
<input id="pass" onChange={(e)=>setPassword(prev=>({...prev,new:{value:e.target.value,isShow:false}}))} type={password?.new?.isShow?"text":"password"} value={password?.new.value} placeholder="New Password" className="flex-1 outline-none" />

<button type="button" className="p-1 " onClick={()=>setPassword(prev=>({...prev,new:{isShow:!prev.new.isShow,value:prev.new.value}}))}>
    {!password?.new?.isShow ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
</button>
        
          </label>

          <span className="flex items-center gap-3">
            <button type="button" onClick={()=>console.log(password)
            } className={cn(styleButton,)}>Change</button>
            <button type="reset" onClick={()=>setPassword({
    new:{value:"",isShow:false},
    old:{value:"",isShow:false}
  })} className={cn(styleButton,)}>Reset</button>
          </span>
        </form>


      </SettingCards>

    </motion.section>

  )
}



// login-activity component 




const sessions = [
  {
    device: "Chrome on Windows",
    location: "New York, USA",
    ip: "192.168.1.12",
    current: true,
  },
  {
    device: "Safari on iPhone",
    location: "Los Angeles, USA",
    ip: "10.0.0.22",
    current: false,
  },
];

// components/DeviceCard.tsx
import { Card, CardContent } from "@/components/ui/card";
// import { motion } from "framer-motion";
import { Monitor , Power, Clock } from "lucide-react";
import { formatRelativeTime } from "../../lib/time";


const deviceIcons={
  tablet:<Tablet className="text-blue-400" size={20} />,
  desktop:<Monitor className="text-blue-400" size={20} />,
  mobile:<Smartphone className="text-blue-400" size={20} />,
  default:""
}
const DeviceCard = ({ data = {},dLoading, onLogout = () => {} }) => {
  const {
    browser = "Unknown",
    os = "Unknown",
    device = "Unknown",
    ip = "Unknown",
    location = "Unknown",
    lastUsed = "Unknown",
    current = false,
    id
  } = data;

    const [deleteSession,{isLoading}]=useDeleteSessionMutation();
 
    const deleteHandle=async()=>{

      await deleteSession(id).unwrap().then(res=>{

        toast({
          title:"Logout Success.",
          description:"You have been successfully logged out.",
          toastType:"success"
        })
      }).catch(err=>{

        toast({
          title:"Logout Failed.",
          description:err?.data?.message || "You have been successfully logged out from the selected session.",
          toastType:"error"
        })
      })

    }

  return (
    <motion.div
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.5 }}
       whileHover={{ scale: 1.02 }}
      className="w-full sm:min-w-[350px] max-w-[450px] flex-1 min-w-[250px]"
    >
      <Card 
            className={`flex p-0 relative flex-1 flex-wrap items-center justify-between rounded-lg border  ${current
                ? "border-indigo-300 bg-indigo-50 dark:bg-slate-700/30"
                : "border-slate-200 dark:border-slate-600"
              }`}>
                {
     current && <span className="absolute z-50 -right-1 -top-1 center flex size-3">  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>  <span className="relative inline-flex size-3  rounded-full bg-green-500"></span></span>}

    {(isLoading || dLoading )&&  <span className="absolute rounded-lg top-0 gap-4 left-0 center flex-1 w-full h-full bg-gray-600/95"><Loader2 className="animate-spin "/>Processing....</span>}
        <CardContent className="p-4 overflow-hidden flex relative flex-1 flex-wrap w-full justify-between items-center gap-4">

          
          <div className="flex items-center gap-3">
            {
               deviceIcons[device.toLowerCase()] || deviceIcons.default

            }
           
            <div className="leading-tight">
              <p className="text-sm font-semibold">{device}</p>
              <p className="text-xs text-slate-400">{browser}</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex flex-col items-start justify-center">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {location}
            </span>
            <span className="flex items-center gap-1">
              <Globe size={12} /> {ip}
            </span>
          </div>

          <div className="text-xs text-slate-400 flex flex-col items-end justify-center">
            <span>{os}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatRelativeTime(lastUsed)}
            </span>
          </div>

          <button onClick={()=>deleteHandle()} className="text-red-500 hover:text-red-400 transition">
            <Power size={18} />
          </button>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeviceCard;


export function LoginActivity() {

  const {admin}=useSelector(state=>state.adminReducer);

  const {data,isLoading}=useSessionsQuery(undefined,{
    refetchOnReconnect:true,
    refetchOnMountOrArgChange:true
  })
  const [deleteSession,{isLoading:dLoading}]=useDeleteSessionMutation();

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="  border-slate-200 dark:border-slate-700 rounded-xl shadow  w-full primary-p"
    >

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}

        className="text-3xl font-bold mb-10 flex items-center gap-3"
      >

        <Settings2 className="w-7 h-7 text-indigo-500" />

        Login Activity
      </motion.h1>

      <div className="flex flex-1 gap-4 items-center flex-wrap ">
        {data && data?.sessions.map((session, index) => (
          // <motion.div
          //   key={index}
          //   whileHover={{ scale: 1.02 }}
          //   className={`flex flex-1 items-center justify-between p-4 rounded-lg border max-w-xl ${session.current
          //       ? "border-indigo-300 bg-indigo-50 dark:bg-slate-700/30"
          //       : "border-slate-200 dark:border-slate-600"
          //     }`}
          // >
          //   <div className="flex flex-1 items-start gap-4">
          //     <MonitorSmartphone className="w-6 h-6 mt-1 text-indigo-500" />
          //     <div>
          //       <p className="font-medium flex items-center text-slate-800 dark:text-white">
          //         {session.device}{session.current && (
          //           <span className="text-[10px] ml-2  text-green-500 font-medium">( Current Device )</span>
          //         )}
          //       </p>
          //       <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
          //         <MapPin className="w-4 h-4" /> {session.location} · <Globe className="w-4 h-4" /> {session.ip}
          //       </p>

          //     </div>
          //   </div>
          //   {!session.current && (
          //     <button className="text-red-500 hover:underline text-sm flex items-center gap-1">
          //       <LogOut className="w-4 h-4" /> Logout
          //     </button>
          //   )}
          // </motion.div>

          <DeviceCard key={index} data={session} dLoading={session?.current?null:dLoading} />
        ))}
      </div>
      <div className="text-right mt-6">
        <button onClick={()=>{

      deleteSession('all-others').unwrap().then(res=>{

        toast({
          title:"Logout Success.",
          description:"You have been successfully logged out from all devices.",
          toastType:"success"
        })
      }).catch(err=>{

        toast({
          title:"Logout Failed.",
          description:err?.data?.message || "You have been successfully logged out from the selected session.",
          toastType:"error"
        })
      })
        }} className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1">
          <LogOut className="w-4 h-4" /> Logout from all devices
        </button>
      </div>
    </motion.div>
  );
}


