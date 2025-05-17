import React,{ lazy } from 'react';

export  const AuthDashboard = {

    LoginForm: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.LoginForm }))
  ),
  LoginLayout: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.LoginLayout }))
  ),
  ForgotPasswordForm: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.ForgotPasswordForm }))
  ),
  NewPasswordForm:lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.NewPasswordForm }))
  ),
  TwoFactorForm: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.TwoFactorForm }))
  ),
  OTPSetupForm: lazy(() =>
    import('./LoginLayout').then((m) => ({ default: m.OTPSetupForm }))
  ),
};

// import React from "react";
import { motion } from "framer-motion";
import { Loader2, Gauge, BarChart3, Settings } from "lucide-react";

const icons = [Gauge, BarChart3, Settings];

export const LazyLoadingDashboard = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 from-[#f0f4f8] to-[#dbeafe]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-2xl max-w-sm text-center border border-slate-300 dark:border-slate-800"
      >
        <motion.div
          className="flex justify-center mb-6"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-[rgb(127,178,241)] dark:text-indigo-400 animate-spin" />
        </motion.div>

        <h2 className="text-slate-800 dark:text-white text-xl font-semibold mb-2">
          Loading Dashboard...
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Please wait while we prepare your insights.
        </p>

        <div className="flex justify-center gap-6 text-[rgb(127,178,241)] dark:text-indigo-400">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

 



