
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utils/service';
import { useThrottle } from '../../hooks/useThrottleClick';
import CustomText from '../../component/Shared/CustomText';
export  function ProductCard() {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const useThrottleClick=useThrottle(1000);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const handlePayment = async (email,productName,fileId) => {
    const { data: order } = await axios.post(`${url}/api/payment/create-order`, {
      amount: 1,
    },{withCredentials:true});
console.log(order,import.meta.env.VITE_RAZORPAY_KEY_ID);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from env
      amount: order.amount,
      currency: "INR",
      name: "My Store",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response) {
        navigate("/user/payment-waiting",{
          loading:true
        })
       const result= await axios.post(`${url}/api/payment/verify-order`, {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          email,
          productName,
          fileId
        });
        if(result.data.status){
          navigate("/user/payment-success",{
            state:{
              email,
              productName,orderId:response.razorpay_order_id,
            }
          })
        }
        // alert("Payment successful. Check your email.");
      },
      // callbackurl: "http://localhost:2000/api/payment/verify-order",
      prefill: {
        name: "John Doe",
        email: email,
        contact: "9999999999",
      },
      // method: {
      //   upi: true, // ✅ explicitly enable UPI (optional)
      // },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const handleBuyNow = async () => {``
    const email = prompt("Please enter your email address:");
    if (!email) {
      alert("Email is required to proceed.");
      return;
    }
    // const email="ashishmaurya061155@gmail.com"
    try {
      handlePayment(email,"candle_patern","148MIv8M7SpkB4b0NzD---xBREwR2M3Ey");
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing your request.");
    }
  }
  const shortDescription =
    "Steven Holm is a financial writer and former professional trader with many years of experience in financial markets specializing in commodities";
  const fullDescription =
    shortDescription +
    "  His expertise extends to market analysis and strategy, grounded in a strong academic background in Finance and Economics. As a Senior Writer, Steven offers valuable insights through his clear and practical financial reports on all things trading. Beyond work, he has a keen interest in digital currencies and financial history.";

  return (
    <div className="max-w-[250px]  flex-col flex  md:max-h-[400px] max-h-[500px] flex-1 mx-auto mt-10 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transform transition-transform duration-300 hover:shadow-xl">
      {/* Thumbnail */}
      <img
        src="https://www.morpher.com/blog/optimizedImages/httpsi0wpcommorpherhomewpcomstagingcomwpcontentuploads202407Untitleddesign6pngw600h380.webp"
        alt="Product Thumbnail"
        className="w-full min-h-[100px] max-h-[50%] object-fill"
      />

      <div className="p-4 flex-1 flex flex-col gap-2 md:max-xl:gap-4">
        {/* Title */}
        <CustomText size='h5' title="full candle pattern book" className='text-start font-semibold capitalize text-gray-800'/>

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
          <CustomText size='h4' title="₹899" className='text-xl font-bold text-indigo-600'/>
          <CustomText  title="₹1299" className='text-sm text-gray-400 line-through'/>
          {/* <p className="text-sm text-gray-400 line-through">₹1299</p> */}
          <CustomText  title="30% OFF" className='text-sm font-semibold text-green-600'/>
        </div>

  {/* <span className=""></span> */}
  {/* <input type="email" placeholder='Ex: username@gmail.com' className='placeholder:text-slate-200 text-slate-200 bg-slate-600 outline-hidden w-full p-2 rounded-md' onChange={(e)=>setUserEmail(e.target.value)} value={userEmail} /> */}
        {/* Buttons */}
        <div className="flex gap-2 md:flex-row flex-col">
  <motion.button
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.05 }}
    className="flex-1 inline-flex items-center justify-center bg-indigo-600 text-white py-2 px-4 max-h-[50px] rounded-xl transition-all duration-300 font-medium "
    onClick={()=>useThrottleClick(handleBuyNow)}
  >
    Buy Now
  </motion.button>

  <motion.button
    whileTap={{ scale: 0.97 }}
    whileHover={{ scale: 1.03 }}
    className="flex-1 inline-flex items-center justify-center border border-indigo-600 text-indigo-600 py-2 px-4 rounded-xl transition-all duration-300 font-medium will-change-transform max-h-[50px]  bg-white hover:bg-indigo-50"
  >
   <CustomText title="Add to Cart" className='text-indigo-600 text-sm font-medium'/>
  </motion.button>
</div>
      </div>
    </div>
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
                className={`relative z-10 flex-1 text-center px-4 py-2 font-semibold transition-colors duration-300 rounded-lg ${
                  activeTab === tab
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

function Home() {

  return (
    <div className='flex-1 p-5 flex min-h-full flex-col pb-10 light:text-slate-800 light:bg-light dark:bg-primary dark:text-slate-200 '>
        <h1 className='text-2xl font-bold text-center  mt-10'>Welcome to the Home Page</h1>
       
 {/* <img src='https://drive.google.com/thumbnail?id=148MIv8M7SpkB4b0NzD---xBREwR2M3Ey' className='flex'/> */}

<div className="flex flex-wrap gap-4 justify-center mt-10">
<ProductCard/>
<ProductCard/>
<AnimatedTabs/>
</div>
      

    </div>
  )
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