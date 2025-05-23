import React, { useEffect, useState } from "react";
import { Star, StarHalf, ImagePlus, ShoppingCart, BadgeDollarSign, TicketPercent } from "lucide-react";
import { motion } from "framer-motion";
import { useLoaderData ,useLocation, useNavigate, useParams} from "react-router-dom";
import { useGetSingleProductQuery } from "../../services/store/productServices";
import LoadingComponent, { LoadingScreen } from "../../components/Shared/LoadingComponent";
// import Image from "../../components/Shared/ImageLoading";
const Image =React.lazy(()=>import("../../components/Shared/ImageLoading").then(m=>({default:m.Image})));
import { url } from "../../utils/service";
import { usePaymentOrderMutation } from "../../services/store/paymentServices";
const Button = ({
  children,
  variant = "default",
  isLoading = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-400",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const classes = `${baseStyles} ${variants[variant] || variants.default} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  return (
    <button
      className={classes}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full" />
      )}
      {children}
    </button>
  );
};



export const ProductPage = () => {
    const [rating, setRating] = useState(4.5);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [coupon, setCoupon] = useState("");
    const { prdId } = useParams();
  const navigate = useNavigate();

  const [paymentOrder,{isLoading:paymentLoading}]=usePaymentOrderMutation();
    const handlePayment = async (email, productName, fileId) => {
      const { data: order } = await axios.post(`${url}/api/payment/create-order`, {
        amount: 1,
      }, { withCredentials: true });
      console.log(order, import.meta.env.VITE_RAZORPAY_KEY_ID);
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from env
        amount: order.amount,
        currency: "INR",
        name: "My Store",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          navigate("/user/payment-waiting", {
            loading: true
          })
          const result = await axios.post(`${url}/api/payment/verify-order`, {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            email,
            productName,
            fileId
          });
          if (result.data.status) {
            navigate("/user/payment-success", {
              state: {
                email,
                productName, orderId: response.razorpay_order_id,
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
    const {data, refetch, isLoading } = useGetSingleProductQuery(prdId, {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: false,
    })
    const product = data?.['data']?.product;

    const [showCoupons, setShowCoupons] = useState(false);
    const availableCoupons = ["SAVE10", "FREESHIP", "WELCOME25"];
  
    const renderStars = (rate) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        if (rate >= i) {
          stars.push(<Star key={i} className="text-yellow-400" fill="currentColor" />);
        } else if (rate >= i - 0.5) {
          stars.push(<StarHalf key={i} className="text-yellow-400" fill="currentColor" />);
        } else {
          stars.push(<Star key={i} className="text-gray-300" />);
        }
      }
      return stars;
    };
  
    const handleReviewSubmit = (e) => {
      e.preventDefault();
      console.log("Submitted Review:", {
        rating: userRating,
        review: reviewText,
      });
      setReviewText("");
      setUserRating(0);
    };
  
    const handleApplyCoupon = () => {
      alert(`Coupon Applied: ${coupon}`);
    };

    const handleBuyNow = async () => {
      navigate(`/product/payment-info?prdId=${prdId}`)
      // paymentOrder({productId:prdId,fileId:product?.files[0]?.id,amount:parseInt(product?.actualPrice),productName:product?.title,navigate}).unwrap()
    }

  
    return (
      <section className="light:bg-light dark:bg-primary min-h-screen flex items-center justify-center">
      {isLoading &&  <LoadingScreen/>}
        <div className="p-4 md:p-8 max-w-6xl light:text-slate-800 bg-transparent w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="rounded-2xl  overflow-hidden shadow-lg">
              {/* <img
                src="https://www.morpher.com/blog/optimizedImages/httpsi0wpcommorpherhomewpcomstagingcomwpcontentuploads202407Untitleddesign6pngw600h380.webp"
                alt="Product"
                className="w-full object-cover"
              /> */}
              <Image containerClassName={"min-h-[200px] flex md:max-h-[500px] max-h-[300px]"} src={`${url}/api/dashboard/product/files/${product?.thumbnails[0]?.id}?mimeType=${product?.thumbnails[0]?.mimeType}`} imageClassName={"w-full md:object-fill  object-contain bg-gray-400/20"}/>
            </div>
  
            <div className="space-y-4">
              <h1 className="text-3xl font-bold dark:text-gray-300 light:text-slate-800">{product?.title || "Awesome Gadget 3000"}</h1>
              <p className="light:text-gray-600 text-base dark:text-sky-100">
                {product?.description || "This is a great product that you will love. It has all the features you need and more."}
              </p>
  
              <div className="text-2xl font-semibold text-green-600">
                
                ₹{product?.actualPrice} <span className="text-gray-400 line-through text-base ml-2">₹{product?.price}</span>
              </div>
  
              <div className="flex items-center gap-2">
                {renderStars(rating)}
                <span className="text-sm text-gray-500">({rating} stars)</span>
              </div>
  
              <div className="relative">
                <div className="flex gap-2 items-center mt-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter Coupon"
                    className="border rounded-lg px-3 py-2 dark:border-light dark:text-thicksky focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <Button onClick={handleApplyCoupon} className="gap-2">
                    <TicketPercent size={16} /> Apply
                  </Button>
                </div>
                <div className="mt-1 text-sm text-blue-600 cursor-pointer" onClick={() => setShowCoupons(!showCoupons)}>
                  {showCoupons ? "Hide Coupons" : "Show Available Coupons"}
                </div>
                {showCoupons && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="light:bg-white dark:bg-gray-800 border mt-2 rounded-lg p-2 shadow-lg space-y-1"
                  >
                    {availableCoupons.map((c, index) => (
                      <li
                        key={index}
                        className="px-3 py-1 rounded hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => setCoupon(c)}
                      >
                        {c}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
  
              <div className="flex flex-wrap gap-4 mt-4">
                <Button className="flex items-center gap-2">
                  <ShoppingCart size={18} /> Add to Cart
                </Button>
                <Button onClick={()=>handleBuyNow()} variant="secondary" className="flex items-center gap-2">
                  <BadgeDollarSign size={18} /> Buy Now
                </Button>
              </div>
            </div>
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 light:bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg p-6 rounded-2xl shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4 light:text-gray-800 dark:text-slate-200">Leave a Review</h2>
  
            <form className="space-y-4 dark:text-slate-300" onSubmit={handleReviewSubmit}>
              <div>
                <label className="block light:text-gray-700 font-medium mb-1 dark:text-slate-300">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`text-yellow-400 hover:scale-110 transition-transform duration-200 ${
                        userRating >= star ? "fill-current" : ""
                      }`}
                    >
                      <Star fill={userRating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
  
              <div>
                <label className="block light:text-gray-700 font-medium mb-1 dark:text-slate-300">Your Review</label>
                <textarea
                  className="w-full border dark:border-gray-300 light:border-gray-600 rounded-lg p-2 focus:outline-none 
                  light:placeholder:text-slate-500
                  light:placeholder:text-sky-300
                  focus:ring-2 focus:ring-blue-400"
                  rows={4}
                  placeholder="Write your thoughts..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
              </div>
  
              <div>
                <label className="block light:text-gray-700 font-medium mb-1 dark:text-slate-300">Attach Images</label>
                <div className="flex items-center gap-2">
                  <input type="file" accept="image/*" multiple className="hidden" id="upload" />
                  <label htmlFor="upload" className="cursor-pointer p-2 border rounded-lg hover:bg-gray-100 flex items-center gap- light:border-primary light:text-primary">
                    <ImagePlus size={20} /> Upload
                  </label>
                </div>
              </div>
  
              <Button type="submit" className="mt-4">Submit Review</Button>
            </form>
          </motion.div>
        </div>
      </section>
    );
  };

// export default ProductPage;
