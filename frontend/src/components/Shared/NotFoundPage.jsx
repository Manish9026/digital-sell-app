import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-lg mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-7xl font-extrabold text-pink-500 mb-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "loop" }}
        >
          404
        </motion.h1>

        <motion.p
          className="mt-4 text-2xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Oops! Page not found
        </motion.p>

        <motion.p
          className="mt-2 text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-pink-600 hover:bg-pink-700 transition rounded-xl shadow-md text-white font-medium"
          >
            <FaArrowLeft />
            Go Home
          </Link>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <img
            src="https://illustrations.popsy.co/gray/web-error.svg"
            alt="404 illustration"
            className="w-full max-w-xs mx-auto"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
