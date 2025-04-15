// Install dependencies before using:
// npm install framer-motion @heroicons/react

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";

const sampleCart = [
  {
    id: 1,
    title: "Mastering React",
    type: "eBook",
    price: 19.99,
    image: "/images/ebook1.jpg",
  },
  {
    id: 2,
    title: "UI Design Kit",
    type: "Design File",
    price: 29.99,
    image: "/images/design1.jpg",
  },
];

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCart(sampleCart);
      setLoading(false);
    }, 1500);
  }, []);

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-light dark:bg-primary text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
        <ShoppingCartIcon className="h-7 w-7" /> Your Cart
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-slate-700 rounded-xl h-36" />
          ))}
        </div>
      ) : cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-xl">Your cart is empty.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md items-center gap-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.type}</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">${item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-600 transition"
              >
                <TrashIcon className="h-6 w-6" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
