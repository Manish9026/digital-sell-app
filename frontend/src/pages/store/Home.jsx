
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { url } from '../../utils/service';
import { useThrottle } from '../../hooks/useThrottleClick';
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
  const handleBuyNow = async () => {
    // const email = prompt("Please enter your email address:");
    if (!userEmail) {
      alert("Email is required to proceed.");
      return;
    }
    // const email="ashishmaurya061155@gmail.com"
    try {
      handlePayment(userEmail,"candle_patern","148MIv8M7SpkB4b0NzD---xBREwR2M3Ey");
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

      <div className="p-4 flex-1 space-y-4">
        {/* Title */}
        <h2 className="sm:text-lg font-semibold text-start capitalize text-gray-800">
         full candle pattern book
        </h2>

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
        <div className="flex items-center space-x-4">
          <p className="text-xl font-bold text-indigo-600">₹899</p>
          <p className="text-sm text-gray-400 line-through">₹1299</p>
          <span className="text-green-600 text-sm font-semibold">30% OFF</span>
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
    Add to Cart
  </motion.button>
</div>
      </div>
    </div>
  );
}
const RazorpayButton = () => {
 

  return <button onClick={handlePayment}>Pay with Razorpay</button>;
};
function Home() {

  return (
    <div className='flex-1 p-5 flex min-h-full flex-col pb-10 light:bg-white light:text-slate-400 dark:bg-gray-800 '>
        <h1 className='text-1xl font-bold text-center  mt-10'>Welcome to the Home Page</h1>

<div className="flex flex-wrap gap-4 justify-center mt-10">
<ProductCard/>
<ProductCard/>
</div>
      

    </div>
  )
}

export default Home