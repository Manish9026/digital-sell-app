import React, { lazy, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

// interface CelebrationAnimationProps {
//   isVisible: boolean;
//   onComplete?: () => void;
// }

const CelebrationAnimation = ({ isVisible, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 40,
        color: [
          '#FF6B6B', '#4ECDC4', '#FF8C42', '#6A0572', 
          '#AB83A1', '#F15BB5', '#9B5DE5', '#00BBF9'
        ][Math.floor(Math.random() * 8)]
      }));
      
      setParticles(newParticles);
      
      // Hide celebration after animation completes
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Center burst */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 0.7 }}
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 shadow-lg">
          <PartyPopper className="h-8 w-8 text-white" />
        </div>
      </motion.div>
      
      {/* Message */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 bg-white px-6 py-3 rounded-full shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Coupon Applied!
        </span>
      </motion.div>
      
      {/* Confetti particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-md"
          style={{ backgroundColor: particle.color, left: `${particle.x}%` }}
          initial={{ y: particle.y, rotate: 0, opacity: 1 }}
          animate={{ 
            y: window.innerHeight,
            rotate: Math.random() > 0.5 ? 360 : -360,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 2 + Math.random() * 2,
            ease: "easeOut" 
          }}
        />
      ))}
    </motion.div>
  );
};


import { 
  CreditCard, 
  ShoppingBag, 
  Check, 
  X, 
  Tag, 
  Lock, 
  Star,
  Gift,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '../../components/Shared/Toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePaymentOrderMutation } from '../../services/store/paymentServices';
import { useGetSingleProductQuery } from '../../services/store/productServices';
import { url } from '../../utils/service';
const IsUserAuthenticated=lazy(()=>import("../../components/Store/IsUserAuthenticated").then(m=>({default:m.IsUserAuthenticated})));

// import { toast } from '@/hooks/use-toast';

// interface Coupon {
//   code: string;
//   discount: number;
//   type: 'percentage' | 'fixed';
//   description: string;
// }

const validCoupons= [
  { code: 'SAVE20', discount: 20, type: 'percentage', description: '20% off your order' },
  { code: 'WELCOME10', discount: 10, type: 'fixed', description: '$10 off your first order' },
  { code: 'PREMIUM50', discount: 50, type: 'percentage', description: '50% off premium features' },
];

const PreventReload=({children})=>{

  const [show,sets]=useState(false);
 const [allowBack, setAllowBack] = useState(true);
//  const {}=useSelector(state=)
useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome
        sets(true)
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

 useEffect(() => {
    const handlePopState = (event) => {
      if (!allowBack) {
        event.preventDefault();
        sets(true);
        window.history.pushState(null, null, location.pathname); // push back to stay on page
      }
    };

    // Fake a new history entry so back triggers popstate
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [allowBack]);

  const handleStay = () => {
    sets(false);
  };

  const handleConfirmBack = () => {
    setAllowBack(true);
    navigate(-1); // Go back
  };
    return (
        <>
         {show && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 shadow-md text-center">
            <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
            <p className="mb-4">Going back will cancel the payment process.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleStay}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Stay on Page
              </button>
              <button
                onClick={handleConfirmBack}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Go Back Anyway
              </button>
            </div>
          </div>
        </div>}
        {children}
        </>
    )
  
}

export const PaymentInfo = () => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
    const [paymentOrder, { isLoading, }] = usePaymentOrderMutation();
  const navigate=useNavigate();
  const location =useLocation();
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    contact: '',
    postalCode: '',
    name: ''
  });
//   const { prdId } = useParams();
  const queryParams = new URLSearchParams(location.search);
    const prdId = queryParams.get('prdId');
  const {data, refetch, isLoading:prdLoading } = useGetSingleProductQuery(prdId, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: false,
      })
    const product = data?.['data']?.product;
// const queryParams = new URLSearchParams(location.search);
// console.log(product,prdId);

// // Example: Get a param by name
// const prdId = queryParams.get('prdId');
  const basePrice = product?.actualPrice || 0;
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.type === 'percentage' 
      ? (basePrice * appliedCoupon.discount) / 100
      : appliedCoupon.discount;
  };

  const finalPrice = basePrice - calculateDiscount();

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundCoupon = validCoupons.find(
      coupon => coupon.code.toLowerCase() === couponCode.toLowerCase()
    );
    
    if (foundCoupon) {
      setAppliedCoupon(foundCoupon);
      setShowCelebration(true);
      toast({
        title: "Coupon Applied!",
        description: foundCoupon.description,
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please check your coupon code and try again.",
        variant: "destructive",
      });
    }
    
    setIsValidating(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast({
      title: "Coupon Removed",
      description: "Your coupon has been removed from this order.",
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    console.log(formData);
    try {
     await  paymentOrder({ productId: product?._id, fileId: product?.files[0]?.id, amount: parseInt(product?.actualPrice), productName: product?.title, navigate }).unwrap()
      toast({
      title: "Payment Processing",
      description: "Your payment is being processed...",
    });

    } catch (error) {
      console.error(error);
      alert("An error occurred while processing your request.");
    }
    
  };


 const handleBuyNow = async () => {


    
  }

' bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
  return (
    <IsUserAuthenticated>
      <PreventReload>
        <div className="min-h-screen dark:bg-primary dark:text-light light:text-primary light:bg-light p-4">

       
      <CelebrationAnimation 
        isVisible={showCelebration} 
        onComplete={() => setShowCelebration(false)}
      />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Premium Checkout
            </h1>
            <Sparkles className="h-8 w-8 text-pink-600" />
          </motion.div>
          <p className="text-gray-600 text-lg">Complete your purchase securely</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Summary */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden border-0 shadow-xl light:bg-white/80 dark:bg-slate-900 backdrop-blur-sm p-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 md:p-6">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="dark:bg-slate-800 border light:bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 mb-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      {/* <Star className="h-8 w-8 text-white" /> */}
                      <img src={`${url}/api/dashboard/product/files/${product?.thumbnails[0]?.id}?mimeType=${product?.thumbnails[0]?.mimeType}`} alt="" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl light:text-primary dark:text-blue-200">{product?.title || "Premium Plan"}</h3>
                      <p className="light:text-gray-600 dark:text-blue-200/50">Unlock all features</p>
                      <Badge variant="secondary" className="mt-1">
                        <Gift className="h-3 w-3 mr-1" />
                        Best Value
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${basePrice.toFixed(2)}</span>
                    </div>
                    
                    <AnimatePresence>
                      {appliedCoupon && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between items-center text-green-600"
                        >
                          <span className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            Discount ({appliedCoupon.code})
                          </span>
                          <span className="font-semibold">-${calculateDiscount().toFixed(2)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-bold text-lg">Total</span>
                      <motion.span
                        key={finalPrice}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                      >
                        ${finalPrice.toFixed(2)}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>

                {/* Coupon Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-purple-600" />
                    Have a coupon code?
                  </h4>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                      disabled={!!appliedCoupon}
                    />
                    <AnimatePresence mode="wait">
                      {!appliedCoupon ? (
                        <motion.div
                          key="apply"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Button
                            onClick={validateCoupon}
                            disabled={isValidating || !couponCode.trim()}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            {isValidating ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              'Apply'
                            )}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="remove"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Button
                            onClick={removeCoupon}
                            variant="outline"
                            size="icon"
                            className="border-red-200 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {appliedCoupon && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 text-green-700">
                          <Check className="h-4 w-4" />
                          <span className="font-medium">{appliedCoupon.description}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl light:bg-white/80 dark:bg-slate-900 backdrop-blur-sm p-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-medium mb-2">Billing Name</label>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-medium mb-2">Enter your billing location </label>
                    <Input
                      placeholder="Ex. Mayur vihar,new Delhi"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <label className="block text-sm font-medium mb-2">Contact No</label>
                      <Input
                        placeholder="Ex. +91 923447857"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      <label className="block text-sm font-medium mb-2">Pin/ zip code</label>
                      <Input
                        placeholder="Ex. 110001"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        required
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 text-blue-700 text-sm">
                      <Lock className="h-4 w-4" />
                      <span>Your information is encrypted and secure</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg shadow-lg"
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-5 w-5" />
                        Complete Payment ${finalPrice.toFixed(2)}
                      </motion.span>
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 mb-4">Trusted by thousands of customers worldwide</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                className="w-12 h-8 bg-gray-300 rounded"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div> 
    </PreventReload>
    </IsUserAuthenticated>
    
   
  );
};

