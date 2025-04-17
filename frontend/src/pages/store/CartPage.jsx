// Install dependencies before using:
// npm install framer-motion @heroicons/react

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useFetchCartQuery, useRemoveCartMutation } from "../../services/store/cartServices";
import { useSelector } from "react-redux";
import Image from "../../component/Shared/ImageLoading";
import { url } from "../../utils/service";
import { ImSpinner2 } from 'react-icons/im';
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

  const [loading, setLoading] = useState(false);
  // const 

  const {data,isLoading,refetch}=useFetchCartQuery(undefined,{
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })
  const cards=data?.data?.products;
  useEffect(() => {
  
    // setCart(cart);
    // console.log(data);

    // console.log(cart);
    
    // setTimeout(() => {
    //   setCart(sampleCart);
    //   setLoading(false);
    // }, 1500);
  }, [data]);
// console.log(cards);



  return (
    <div className="min-h-screen bg-light dark:bg-primary text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
        <ShoppingCartIcon className="h-7 w-7" /> Your Cart
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-slate-700 rounded-xl h-36" />
          ))}
        </div>
      ) : cards?.length === 0 ? (
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
          {cards?.map((item,indx) => (
            <ProductCard key={indx} item={item} refetch={refetch}/>
          ))}
        </div>
      )}
    </div>
  );
}


const ProductCard=({item,refetch})=>{
  const [removeCart,{isLoading:removeLoading}]=useRemoveCartMutation();
 
  const removeFromCart = async(productId) => {
    const res=await removeCart({productId}).unwrap();
    console.log(res,'res');
    if(res?.status){
      await refetch()
    }
    
  };
  return(
    <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex relative overflow-hidden bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md items-center gap-4"
            >
              <Image src={ `${url}/api/dashboard/product/files/${item?.thumbnails[0]?.id}?mimeType=${item?.thumbnails[0]?.mimeType}`} imageClassName={'w-24 h-24 rounded-lg object-contain'}/>
              {/* <img
                src={item?.thumbnail[0]}
                alt={item?.title}
                className="w-24 h-24 rounded-lg object-cover"
              /> */}
              <div className="flex-1 capitalize">
                <h3 className="text-lg font-bold">{item?.title}</h3>
                <p className="text-sm uppercase text-gray-600 dark:text-gray-300">{item?.category}</p>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">${item?.actualPrice}</span>
                <span className="text-green-600 ml-4 dark:text-green-400 font-semibold text-xs mt-1 line-through">${item?.price}</span>
              </div>
              <button
                onClick={() => removeFromCart(item?.prdId)}
                className="text-red-500 hover:text-red-600 transition"
              >
                <TrashIcon className="h-6 w-6" />
              </button>

             {removeLoading && <motion.span
              className="absolute center top-0 left-0 w-full h-full light:bg-slate-200/80 dark:bg-slate-400/60"
              >
                 <ImSpinner2 className="animate-spin text-white mr-2" /> Deleting...
              </motion.span>}
            </motion.div>
  )
}