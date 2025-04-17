
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { url } from '../../utils/service';
import { useThrottle } from '../../hooks/useThrottleClick';
import CustomText from '../../component/Shared/CustomText';
import { useGetProductsQuery, useGetSingleProductQuery } from '../../services/store/productServices';
import Image from '../../component/Shared/ImageLoading';
import { usePaymentOrderMutation } from '../../services/store/paymentServices';
export function ProductCard({product,className}) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const useThrottleClick = useThrottle(1000);
  const [paymentOrder,{isLoading,}]=usePaymentOrderMutation();
  const [addCart,{isLoading:cartLoading}]=useAddToCartMutation();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleBuyNow = async () => {


    try {
      paymentOrder({productId:product?._id,fileId:product?.files[0]?.id,amount:parseInt(product?.actualPrice),productName:product?.title,navigate}).unwrap()
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing your request.");
    }
  }
  const handleCart=async ()=>{
    await addCart({productId:product?.prdId});
  }
  const shortDescription =
    "Steven Holm is a financial writer and former professional trader with many years of experience in financial markets specializing in commodities";
  const fullDescription =
    shortDescription +
    "  His expertise extends to market analysis and strategy, grounded in a strong academic background in Finance and Economics. As a Senior Writer, Steven offers valuable insights through his clear and practical financial reports on all things trading. Beyond work, he has a keen interest in digital currencies and financial history.";

  return (
    <Link to={{
      pathname:`/product/${product?.prdId}`,
      // search:`?prdId=${product?._id}`
      
    }} state={{prdId:product?._id}} className={className +"max-w-[250px] min-w-[160px] flex-col flex  md:max-h-[400px] max-h-[350px] flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transform transition-transform  duration-300 hover:shadow-xl"}>
      {/* Thumbnail */}
      {/* <img
        src={ `${url}/api/dashboard/product/files/${product?.thumbnails[0]?.id}?mimeType=${product?.thumbnails[0]?.mimeType}` || `https://drive.google.com/thumbnail?id=${product?.thumbnails[0]?.id}` || "https://www.morpher.com/blog/optimizedImages/httpsi0wpcommorpherhomewpcomstagingcomwpcontentuploads202407Untitleddesign6pngw600h380.webp"}
        alt="Product Thumbnail"
        loading='lazy'
        className="w-full md:max-h-[120px] max-h-[100px]  object-contain bg-gray-400/20"
        onLoad={(e)=>{console.log(e)
        }}
      /> */}
      <Image containerClassName={'w-full md:max-h-[120px] max-h-[100px] min-h-[100px]'} imageClassName={"w-full h-full object-contain bg-gray-400/20"} src={ `${url}/api/dashboard/product/files/${product?.thumbnails[0]?.id}?mimeType=${product?.thumbnails[0]?.mimeType}` || `https://drive.google.com/thumbnail?id=${product?.thumbnails[0]?.id}` || "https://www.morpher.com/blog/optimizedImages/httpsi0wpcommorpherhomewpcomstagingcomwpcontentuploads202407Untitleddesign6pngw600h380.webp"} alt="Product Thumbnail"
        loading='lazy'/>

      <div className="p-4 flex-1 flex flex-col gap-2 md:max-xl:gap-4">
        {/* Title */}
        <CustomText size='h5' title={product?.title} className='text-start font-semibold capitalize text-gray-800' />

        {/* Description (short with toggle) */}
        {/* <div className="text-sm  text-gray-600">
          <AnimatePresence initial={false}>
            {showFullDescription ? (
              <motion.p
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {fullDescription}
              </motion.p>
            ) : (
              <motion.p
                key="short"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {shortDescription}{" "}
                <span
                  onClick={() => setShowFullDescription(true)}
                  className="text-indigo-500 cursor-pointer underline"
                >
                  ...more
                </span>
              </motion.p>
            )}
          </AnimatePresence>

          {showFullDescription && (
            <button
              className="text-sm text-indigo-500 underline mt-1 hover:text-indigo-700"
              onClick={() => setShowFullDescription(false)}
            >
              Show less
            </button>
          )}
        </div> */}

        {/* Price Section */}
        <div className="flex flex-wrap items-center justify-between ">
          <CustomText size='h4' title={`₹${product?.actualPrice}` || "₹899" }className='text-xl font-bold text-indigo-600' />
          <CustomText title={`₹${product?.price}` || "₹1299"} className='text-sm text-gray-400 line-through' />
          {/* <p className="text-sm text-gray-400 line-through">₹1299</p> */}
          <CustomText title={`${product?.discountPercent}% OFF` || "30% OFF"} className='text-sm font-semibold text-green-600' />
        </div>

        {/* <span className=""></span> */}
        {/* <input type="email" placeholder='Ex: username@gmail.com' className='placeholder:text-slate-200 text-slate-200 bg-slate-600 outline-hidden w-full p-2 rounded-md' onChange={(e)=>setUserEmail(e.target.value)} value={userEmail} /> */}
        {/* Buttons */}
        <div className="flex gap-2 md:flex-row flex-col">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="flex-1 inline-flex items-center justify-center bg-indigo-600 text-white py-2 px-4 max-h-[50px] rounded-xl transition-all duration-300 font-medium "
            onClick={(e) => {e.stopPropagation() ;e.preventDefault();useThrottleClick(handleBuyNow)}}
          >
            Buy Now
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            className="flex-1 inline-flex items-center justify-center border border-indigo-600 text-indigo-600 py-2 px-4 rounded-xl transition-all duration-300 font-medium will-change-transform max-h-[50px]  bg-white hover:bg-indigo-50"
            onClick={(e) => {e.stopPropagation();e.preventDefault(); ;useThrottleClick(handleCart)}}
          >
            <CustomText title="Add to Cart" className='text-indigo-600 text-sm font-medium' />
          </motion.button>
        </div>
      </div>
    </Link>
  );
}
const RazorpayButton = () => {


  return <button onClick={handlePayment}>Pay with Razorpay</button>;
};


// import { useState } from 'react';
// import { motion } from 'framer-motion';

// const tabs = ['Overview', 'Courses', 'Reviews'];
const tabs = ['Overview', 'Courses', 'Reviews'];



function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 p-6">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Tabs */}
          <div className="relative flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 flex-1 text-center px-4 py-2 font-semibold transition-colors duration-300 rounded-lg ${activeTab === tab
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                  }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-lg z-0"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-5 rounded-xl shadow bg-white dark:bg-gray-800"
          >
            {activeTab === 'Overview' && <p>This is the Overview tab content.</p>}
            {activeTab === 'Courses' && <p>All your Courses are listed here.</p>}
            {activeTab === 'Reviews' && <p>Check out Reviews here.</p>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}


const ProductSection=()=>{
 const { data, refetch,isLoading } = useGetProductsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: false,
  })

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1.2, spacing: 15 },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2.5, spacing: 20 },
      },
    },
  });
  // console.log(data);
  

  return(
    <section className=' flex relative  overflow-hidden primary-p flex-col w-full my-10  gap-4'>
 <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-semibold text-center mb-10"
        >
          Our Exclusive Products
        </motion.h2>
  <span ref={sliderRef} className='flex gap-4 flex-1 w-full flex-wrap '>
  { isLoading?<span   className=' keen-slider flex-1 center w-full h-[200px]'> Loading ....</span>:
     data && data?.data?.product.map((product,id)=>{

        return <ProductCard key={id}  product={product}/>
      })
    }
  </span>
   
    </section>
  )
}
function Home() {
// const {data}=useGetSingleProductQuery("67fc44645889c2c5950b7fd1", {
//   refetchOnFocus: true,
//   refetchOnMountOrArgChange: false,
// })
  return (
    <div className='flex-1  flex min-h-full flex-col pb-10 light:text-slate-800 light:bg-light dark:bg-primary dark:text-slate-200 '>
      {/* <h1 className='text-2xl font-bold text-center  mt-10'>Welcome to the Home Page</h1>

<button onClick={()=>window.location.assign("/dashboard")}>go dashboard</button> */}
      {/* <img src='https://drive.google.com/thumbnail?id=148MIv8M7SpkB4b0NzD---xBREwR2M3Ey' className='flex'/> */}

      {/* <div className="flex flex-wrap gap-4 justify-center mt-10">
      <ProductSection/>
        
        <AnimatedTabs />
      </div> */}

<HomePage/>

    </div>
  )
}

// Install dependencies before using:
// npm install keen-slider framer-motion
// import 'keen-slider/keen-slider.min.css';

// import React, { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// Install dependencies before using:
// npm install keen-slider framer-motion
// import 'keen-slider/keen-slider.min.css';

// import React, { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useAddToCartMutation } from '../../services/store/cartServices';

const products = [
  { title: "Mastering React", type: "eBook", image: "https://m.media-amazon.com/images/I/613i1dMgs1L._UF1000,1000_QL80_.jpg" },
  { title: "UI Design Kit", type: "Design File", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD2vG-s87IN3CaLkDF1jmPlFpN_TQzoTeERg&s" },
  { title: "Pro Coding Course", type: "Video", image: "https://royaledu.co.in/wp-content/uploads/2022/08/programming-language-2-1024x483.png" },
  { title: "Ultimate Templates", type: "File Bundle", image: "https://designshack.net/wp-content/uploads/mobile-app-template-368x246.jpg" },
];

function HomePage() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1.2, spacing: 15 },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2.5, spacing: 20 },
      },
    },
  });

  const cursorRef = useRef(null);

  useEffect(() => {
  
    const cursor = cursorRef.current;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  const moveCursor = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  const animate = () => {
    // Lerp toward mouse position
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    if (cursor) {
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animate);
  };

  // window.addEventListener("mousemove", moveCursor);
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);

    window.addEventListener("mousemove", moveCursor);
  animate();

    return () =>{ window.removeEventListener("mousemove", moveCursor);
      clearInterval(interval); // Cleanup the interval on component unmount
    }
  }, []);

  return (
    <div className="light:bg-light  text-gray-900 dark:text-white min-h-screen overflow-x-hidden relative">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none  fixed z-0 h-50 w-50 rounded-full bg-indigo-500/20 backdrop-blur-lg transform -translate-x-0  -translate-y-1/2 transition-transform duration-300 ease-out"
      ></div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Discover, Buy & Download Digital Products
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-6 max-w-2xl"
        >
          From eBooks to design kits – everything you need in one place.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg shadow-md">
            Browse Products
          </button>
        </motion.div>
      </section>

      {/* Carousel Section */}
      <section className="px-6 pb-5 relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-semibold text-center mb-10"
        >
          Featured Products
        </motion.h2>

        <div ref={sliderRef} className="keen-slider">
          {products.map((product, index) => (
            <motion.div
              key={index}
              className="keen-slider__slide bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-bold mb-1">{product.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">{product.type}</p>
            </motion.div>
          ))}
        </div>
      </section>

<ProductSection/>

      {/* How It Works Section */}
      <motion.section className="px-6 py-20 bg-sky-100 overflow-hidden dark:bg-primary/70 relative z-10">

      <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }} 
          className='absolute bg-pink-500 hover:scale-[500%] top-0 left-0 w-[100px] h-[100px] rounded-br-[100%] z-[-10] tansition-all duration-300 ease-out'
          >

          </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-semibold text-center mb-12"
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {["Choose", "Pay", "Download"].map((step, idx) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-700 p-8 rounded-xl shadow-lg text-center"
            >
              <h3 className="text-xl font-bold mb-3">Step {idx + 1}: {step}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {step === "Choose" && "Select your favorite digital item."}
                {step === "Pay" && "Securely checkout using preferred methods."}
                {step === "Download" && "Instantly download your purchase."}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <section className="px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-indigo-600 text-white p-10 rounded-2xl shadow-lg text-center"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Stay Updated</h2>
          <p className="mb-6">Get the latest updates and exclusive deals directly to your inbox.</p>
          <form
            action="https://formspree.io/f/xwkgnznl"
            method="POST"
            className="flex flex-col md:flex-row justify-center gap-4"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-indigo-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}



export default Home


{/* <span className='center flex-col gap-2'>
          <h1 className='h1'>Lorem, ipsum dolor.</h1>
          <h2 className='h2'>Lorem, ipsum dolor.</h2>
          <h3 className='h3'>Lorem, ipsum dolor.</h3>
          <h4 className='h4'>Lorem, ipsum dolor.</h4>
          <h5 className='h5'>Lorem, ipsum dolor.</h5>
          <h6 className='h6'>Lorem, ipsum dolor.</h6>
        </span> */}