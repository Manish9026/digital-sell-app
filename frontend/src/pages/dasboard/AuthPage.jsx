import React from 'react'
import AuthDashboard from '../../components/Dashboard/LoginLayout'
import { Outlet } from 'react-router-dom'
// components/AdminAuthHeader.tsx
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import ThemeToggleButton from '../../components/Shared/ThemeToggleButton';

 function AdminAuthHeader() {
  return (
    <motion.header
      className="w-full flex-1 h-full  text-center p-6  flex flex-col items-center justify-center gap-2"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex gap-2 center bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-full shadow-lg">
        <ShieldCheck className="text-white w-8 h-8 animate-pulse" />
        <ThemeToggleButton/>
      </div>
      <h1 className="text-4xl font-bold light:text-gray-800 dark:text-white">
        Admin Portal
      </h1>
      <p className="light:text-gray-600 dark:text-gray-300 text-sm">
        Secure access for administrators. Please log in to continue.
      </p>
    </motion.header>
  );
}


// Reset Your Password

// We'll send you instructions to reset your password

const AuthPage = () => {
  return (
    <div className='center w-full min-h-screen flex-col bg-gradient-to-br from-gray-50 light:from-light light:to-blue-200 dark:from-gray-900 dark:to-gray-950'>
<AdminAuthHeader/>

        <Outlet/>
    </div>
  )
}

export default AuthPage