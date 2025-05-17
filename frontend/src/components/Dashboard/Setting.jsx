import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";


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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
// import { Authenticated } from "./IsAuthenticated";


export const Setting = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggle2FA = () => setIs2FAEnabled((prev) => !prev);
  

  return (
    <div
      className={` transition-colors duration-300 ${
           "light:bg-light  light:text-primary dark:bg-primary dark:text-white "
      }`}
    >
      <div className="max-w-3xl  py-12 primary-p">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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

          {/* Notifications */}
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

