import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const LoadingScreen = ({title,colorTheme,containerTheme}) => {
  return (
    <div className={` absolute inset-0 z-50 flex items-center justify-center backdrop-blur  ${containerTheme?containerTheme:'bg-black/30'} `}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`p-8 rounded-2xl shadow-2xl ${colorTheme?colorTheme:'bg-white/10'}  border-2 border-white/20 flex flex-col items-center space-y-4`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 size={48} className="text-white" />
        </motion.div>
        <p className="text-white text-lg font-semibold tracking-wide">
          {title || "Loading, please wait..."}
        </p>
      </motion.div>
    </div>
  );
};

export {LoadingScreen}
export default {LoadingScreen};
