import React, { memo, useEffect, useState } from "react";
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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
// import { Authenticated } from "./IsAuthenticated";

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

      <SettingCards delaytime={1}>
        <div className="flex items-center flex-wrap gap-3 mb-4">
          <Link to={'./setup_2FA'}>
          <button type="button"  className={cn(styleButton)}>
            <SettingsIcon className="text-indigo-500" />
            Setup 2FA
          </button>
          </Link>
          
          <button type="button" className={cn(styleButton)}>
            <Code className="text-indigo-500" />
            HLPEMUHHDYN7937
          </button>
        </div>
      </SettingCards>




      <SettingCards delaytime={2} isActive={true} title={"Change Password"} subTitle={"Change your password to enhance security."} icons={<KeyRound />}>

        <form className="">
          <input type="password" placeholder="Old Password" className="border border-slate-300 dark:border-slate-700 p-3 rounded-lg shadow-md w-full mb-4" />
          <input type="password" placeholder="New Password" className="border border-slate-300 dark:border-slate-700 p-3 rounded-lg shadow-md w-full mb-4" />

          <span className="flex items-center gap-3">
            <button type="button" className={cn(styleButton,)}>Change</button>
            <button type="reset" className={cn(styleButton,)}>Reset</button>
          </span>
        </form>


      </SettingCards>

    </motion.section>

  )
}



// login-activity component 

// import { motion } from "framer-motion";
import { LogOut, MonitorSmartphone, MapPin, Globe } from "lucide-react";

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

export function LoginActivity() {
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

      <div className="flex gap-4 items-center flex-wrap ">
        {sessions.map((session, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className={`flex flex-1 items-center justify-between p-4 rounded-lg border max-w-xl ${session.current
                ? "border-indigo-300 bg-indigo-50 dark:bg-slate-700/30"
                : "border-slate-200 dark:border-slate-600"
              }`}
          >
            <div className="flex flex-1 items-start gap-4">
              <MonitorSmartphone className="w-6 h-6 mt-1 text-indigo-500" />
              <div>
                <p className="font-medium flex items-center text-slate-800 dark:text-white">
                  {session.device}{session.current && (
                    <span className="text-[10px] ml-2  text-green-500 font-medium">( Current Device )</span>
                  )}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {session.location} · <Globe className="w-4 h-4" /> {session.ip}
                </p>

              </div>
            </div>
            {!session.current && (
              <button className="text-red-500 hover:underline text-sm flex items-center gap-1">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}
          </motion.div>
        ))}
      </div>
      <div className="text-right mt-6">
        <button className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1">
          <LogOut className="w-4 h-4" /> Logout from all devices
        </button>
      </div>
    </motion.div>
  );
}


