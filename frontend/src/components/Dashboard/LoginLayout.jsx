
import { Shield, Smartphone, Key, QrCode , Mail, Lock,Copy,Eye, EyeOff, CheckCircle,  ArrowRight,RefreshCcw, ArrowLeft, Settings2} from "lucide-react";

// react hooks
import { useState, useEffect, use } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {motion }from 'framer-motion'
//shadcn components 


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "../Shared/Toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent } from "@/components/ui/card";



// services && api
import { useConfirm_2FAMutation, useLoginAdminMutation, useSetup_2FAMutation, useVerify_2FAMutation } from "../../services/dashboad/adminAuthServices";
import {IsAuthenticated} from "./IsAuthenticated";
import { loginFailure, loginSuccess, logout, setAdmin, setLocationShow, setLocationValue } from "../../slices/dashboard/adminSlice";


 


// This is the login layout component


const LoginLayout = ({ children, title, subtitle,activeChildren="2fa" }) => {

  const {location}=useSelector(state=>state.adminReducer);
  const dispatch =useDispatch();

  // const [coords,setCoords]=useState();
  // const {coords}=useLocationGeo();
  useEffect(()=>{
    if(!location?.value)
    dispatch(setLocationShow(true));    
  },[location?.value])


  return (

    <IsAuthenticated isAuth={true} navigatePath={"/dashboard"}>
    <motion.div 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
     className="flex  w-full items-center justify-center  p-4">
      {/* <div className="absolute top-0 left-0 w-full h-64 bg-shield-primary/20 dark:bg-shield-primary/10 -z-10" /> */}
         <LocationPopup showPopup={location.isvisible }
         onClose={()=>dispatch(setLocationShow(false))}
         onLocationReceived={(value)=>{console.log(value);dispatch(setLocationValue(value))}
         }
         />
      <div className="absolute top-4 right-4">
        {/* <ThemeToggle /> */}
      </div>

    <div className="w-full  relative conic-border  p-2 rounded-xl max-w-md">
{ <div className="flex flex-col items-center mb-6">
          <div className="p-3  rounded-full dark:bg-shield-primary/20 bg-shield-light/50  mb-4">
            <Shield className="h-8 w-8 text-shield-primary" />
          </div>
          <h1 className="text-2xl font-bold  dark:text-gray-100 light:text-gray-900">{title}</h1>
          {subtitle && <p className="light:text-gray-500 dark:text-gray-400 mt-1 text-center">{subtitle}</p>}
        </div>}
        
        <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent light:via-white/30 dark:via-white/5 to-transparent -translate-x-full animate-shimmer z-10" />
          <div className="p-6 light:bg-light dark:bg-primary dark:text-light light:text-black">
        
            {/* <LoginForm/> */}
            <span className="relative z-50">

           {children}
            </span>
             
           
          </div>
        </div>

        <div className="mt-6 text-center text-sm light:text-gray-500  dark:text-gray-400">
          <p>Protected by Login Shield &copy; {new Date().getFullYear()}</p>
        </div>
      </div>

      
    </motion.div>
    </IsAuthenticated>
  );
};


// This is the login form component
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
const [loginAdmin,{isLoading}]=useLoginAdminMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
 const {location}=useSelector(state=>state.adminReducer) 
  // const [location,setLocation]=useState();




  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // dispatch(setLocationShow(true))

    setTimeout(()=>{

      console.log(location?.value,"location");
    },2000)
  
  // const location=await getLocation ();
 
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }
    
    // setIsLoading(true);
    await loginAdmin({email,password,quardinate:location?.value}).unwrap().then((res)=>{
      console.log(res);
      

        if (res?.need_2fa) {
           
      navigate("/dashboard/admin-auth/2fa-verify");
      return toast({
          title: "Verification required",
          description: "Please enter the code sent to your device",
          toastType:""
        });
}
        toast({
          title: "Login successful",
          description: "You have been successfully logged in",
        });
        navigate("/dashboard");
      
      // console.log(status,data);
      
        // Navigate to dashboard or home page after successful login
      
    }).catch(({status,data})=>{
      if(status===401 || status<=500){
        
        toast({
          title: "Login failed",description:data?.message,toastType:"error"})
      }

      // console.log(err,"error");
      
    })

    // Simulate API call
    // setTimeout(() => {
    //   setIsLoading(false);
      
    //   // Example validation - in a real app this would be authenticated via backend
    //   if (email.includes("@") && password.length >= 6) {
    //     toast({
    //       title: "Verification required",
    //       description: "Please enter the code sent to your device",
    //     });
      
        
    //     // Since login was successful, navigate to 2FA page
    //     navigate("/dashboard/admin-auth/2fa-verify", { state: { email } });
    //   } else {
    //     toast({
    //       title: "Login failed",
    //       description: "Invalid email or password",
    //       variant: "destructive",
    //     });
    //   }
    // }, 1500);
  };

  return (

    <LoginLayout  title="Welcome Back" subtitle="Sign in to access your account">


    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2 light:text-gray-700 dark:text-gray-300">
          <Mail className="h-4 w-4 light:text-gray-500 dark:text-gray-400" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-shield-primary focus:ring-shield-primary/20"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2 light:text-gray-700 dark:text-gray-300">
          <Lock className="h-4 w-4 light:text-gray-500 dark:text-gray-400" />
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-shield-primary focus:ring-shield-primary/20"
        />
      </div>
      
      <div className="flex relative items-center justify-between pt-2 z-50">
        <Link 
          to="/dashboard/admin-auth/reset-password"
          state={{ email }}
          className="text-sm text-shield-primary hover:text-shield-secondary transition-colors"
          onClick={()=>dispatch(logout())}
        >
          Forgot password?
        </Link>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-shield-primary hover:bg-shield-secondary"
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </div>
    </form>
 
    </LoginLayout>
  );
};



// this is the 2FA form component
// This component is used to verify the 2FA code sent to the user's device
const TwoFactorForm = () => {
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verify_2FA,{isLoading}]=useVerify_2FAMutation();
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {location}=useSelector(state=>state.adminReducer) 

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, canResend]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
        toastType:"error"
      });
      return;
    }
    
    await verify_2FA({token:code,quardinate:location?.value}).unwrap().then((res)=>{

      if(res?.status){
      dispatch(loginSuccess(res));
      navigate('/dashboard');
      return toast({
        title:"Login Success.",
        description:res?.message,
        toastType:"success"
      });
    }

    }).catch(err=>{

      return toast({
        title:"Login Failed.",
        description:err.data?.message,
        toastType:"error"
      })
    })
    // setIsLoading(true);
    
    // // Simulate API call
    // setTimeout(() => {
    //   setIsLoading(false);
      
    //   // Example validation - in a real app this would verify via backend
    //   if (code === "123456" || code === "000000") {
    //     toast({
    //       title: "Success",
    //       description: "You have been successfully authenticated",
    //     });
        
    //     // Navigate to dashboard or home page after successful 2FA
    //     navigate("/dashboard");
    //   } else {
    //     toast({
    //       title: "Verification failed",
    //       description: "Invalid code. Please try again",
    //       variant: "destructive",
    //     });
    //   }
    // }, 1500);
  };

  const handleResendCode = () => {
    setCanResend(false);
    setCountdown(60);
    
    toast({
      title: "Code resent",
      description: "A new verification code has been sent",
    });
  };

  return (

    <LoginLayout title={"Two-Factor Authentication"} subtitle={"Verify your identity to continue"}
    >
      <form  onSubmit={handleSubmit} className="space-y-6">
      {/* <div className="flex items-center justify-center mb-4">
        <div className="p-3  rounded-full dark:bg-shield-primary/20 bg-shield-light/50  h-12 w-12">
          <Smartphone className="h-6 w-6 text-shield-primary" />
        </div>
      </div> */}
      
      {/* <p className="text-center light:text-gray-600 dark:text-gray-400">
        We've sent a verification code to {email}. Please enter it below.
      </p>
       */}
      <div className="space-y-2">
        <Label htmlFor="code" className="flex items-center gap-2">
          <Key className="h-4 w-4 text-gray-500" />
          Verification Code
        </Label>
        <Input
          id="code"
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          required
          className="text-center text-lg font-mono tracking-widest border-gray-300 light:border-gray-900  focus:border-shield-primary focus:ring-shield-primary/20"
          maxLength={6}
        />
      </div>
      
      <div className="space-y-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full text-light bg-shield-primary hover:bg-shield-secondary"
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          className="w-full text-shield-primary hover:bg-shield-light/50"
          onClick={handleResendCode}
          disabled={!canResend}
        >
          {canResend ? "Resend code" : `Resend code (${countdown}s)`}
        </Button>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <a href="https://support.microsoft.com/en-us/account-billing/how-to-add-your-accounts-to-microsoft-authenticator-92544b53-7706-4581-a142-30344a2a2a57#id0ebh=signinorgid" target="_blank">
           <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            
          >
            <QrCode className="h-4 w-4" />
            Set up authenticator app
          </Button>
          </a>
         
          <p className="mt-2 text-xs text-center light:text-gray-500 dark:text-gray-400">
            Don't want to receive SMS codes? Set up an authenticator app instead.
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => navigate("/dashboard/admin-auth")}
        >
          Back to login
        </Button>
      </div>
    </form>
    </LoginLayout>
    
  );
};





// This is the forgot password form component
// This component is used to send a password reset link to the user's email
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
//   const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      toast({
        title: "Reset link sent",
        description: "Check your email for instructions to reset your password",
      });
    }, 1500);
  };

  return (
   <LoginLayout title={"Reset Your Password"} subtitle={"We'll send you instructions to reset your password"}>
      {isSubmitted ? (
        <div className="space-y-4 animate-fade-in">
          <Alert className="bg-shield-light/20 border-shield-light">
            <AlertDescription className="text-center">
              We've sent password reset instructions to <strong>{email}</strong>. 
              Please check your inbox and spam folder.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-2 pt-2">
            <Button
              type="button"
              onClick={() => setIsSubmitted(false)}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Try a different email
            </Button>
            
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="bg-shield-primary hover:bg-shield-secondary"
            >
              Return to login
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-300 focus:border-shield-primary focus:ring-shield-primary/20"
            />
            <p className="text-sm text-gray-500">
              Enter the email address associated with your account, and we'll send you a link to reset your password.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-shield-primary hover:bg-shield-secondary"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-2 text-gray-600"
              onClick={() => navigate("/dashboard/admin-auth")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>
          </div>
        </form>
      )}
   </LoginLayout>
  );
};


const passwordStrengthLevels = [
  { level: "weak", color: "bg-red-500" },
  { level: "fair", color: "bg-orange-500" },
  { level: "good", color: "bg-yellow-500" },
  { level: "strong", color: "bg-green-500" },
];

const NewPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const { toast } = useToast();
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, level: "" };
    
    let strength = 0;
    if (pass.length > 6) strength += 1;
    if (pass.length > 10) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    
    const level = passwordStrengthLevels[Math.min(3, Math.floor(strength / 2))];
    return { 
      strength: Math.min(100, strength * 25), 
      level: level?.level || "", 
      color: level?.color || "" 
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in both password fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordStrength.strength < 50) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      toast({
        title: "Success",
        description: "Your password has been reset successfully",
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 1500);
  };

  return (
    <LoginLayout title={"Set New Password"} subtitle={"Create a secure password for your account"}>
      {isSuccess ? (
        <div className="space-y-4 animate-bounce-in">
          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-center">Password Reset Complete!</h3>
          </div>
          
          <Alert className="bg-shield-light/20 border-shield-light">
            <AlertDescription className="text-center">
              Your password has been reset successfully. You will be redirected to the login page in a few seconds.
            </AlertDescription>
          </Alert>
          
          <Button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-shield-primary hover:bg-shield-secondary"
          >
            Return to login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-500" />
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="pr-10 border-gray-300 focus:border-shield-primary focus:ring-shield-primary/20"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {password && (
              <div className="space-y-1 mt-2 animate-fade-in">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength.color} transition-all duration-300 ease-in-out`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 capitalize">
                  {passwordStrength.level ? `Password strength: ${passwordStrength.level}` : "Enter password"}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="pr-10 border-gray-300 focus:border-shield-primary focus:ring-shield-primary/20"
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {password && confirmPassword && (
              <div className="mt-1 text-xs">
                {password === confirmPassword ? (
                  <p className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Passwords match
                  </p>
                ) : (
                  <p className="text-red-600">Passwords don't match</p>
                )}
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-shield-primary hover:bg-shield-secondary"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Setting password...
                </>
              ) : (
                "Set New Password"
              )}
            </Button>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Password requirements:</span> At least 8 characters with a mix of 
              uppercase, lowercase, numbers, and special characters.
            </p>
          </div>
        </form>
      )}
    </LoginLayout>
  );
};



import qr from './qr.png'
import useLocationGeo, { useGeolocation } from "../../hooks/useLocation";
import LocationPermition from "../Shared/LocationPermition";
import LocationPopup from "../Shared/LocationPermition";
import { Tuple } from "@reduxjs/toolkit";

const OTPSetupForm = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const {admin}=useSelector(state=>state.adminReducer);
  const [step, setStep] = useState(1); // 1: Setup, 2: Verification, 3: Success

  const [setup_2FA,{isLoading:qrLoading,isSuccess}]=useSetup_2FAMutation();
  const [confirm_2FA,{isLoading:cLoading}]=useConfirm_2FAMutation();
  const [timeLeft,setTimeLeft]=useState(45);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [secretKey,setSecretKey]=useState('');
  const [qrCodeUrl,setQrCodeUrl]=useState()


  useEffect(() => {

    if(!(admin && admin?.twoFA.enabled)){
    if(step===3){
 let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
     navigate('/dashboard/setting/authentication')
    }

    return () => clearInterval(timer);


    }
    if(step==1 && !secretKey){

       setup_2FA().unwrap().then((res)=>{
      setQrCodeUrl(res.qr);
      setSecretKey(res.secret)
      
    }).catch((error)=>{

      console.log("error",error)
    })
    }}

    else{
      navigate("/dashboard/setting/authentication")
      toast({
        toastType:"info",
        title:"Already Enabled 2FA",
        description:"If you want to change 2FA code,disabled firstly"

      })
      return 
    }
   
  }, [timeLeft,step]);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    toast({
      title: "Secret copied",
      description: "Authentication secret has been copied to clipboard",
    });
  };

  const handleVerify =async () => {
    // In a real app, you would validate this with your backend
      await confirm_2FA({token:verificationCode,secret:secretKey}).unwrap().then((res)=>{


        // console.log(res,'response');
        if(res?.status){
          setStep(3)
          dispatch(setAdmin(res?.admin));
          return toast({
          title: "Success",
          description: "Two-factor authentication has been enabled",
          toastType:"success"
        });
        }
        return toast({
          title: "Success",
          description: res?.message,
          toastType:"success"
        });
        
    }).catch(({data})=>{

      // console.log("error",error)
       toast({
          title: "Verification failed",
          description: data?.message,
          variant: "destructive",
          toastType:"error"
        });
    })
    // setTimeout(() => {
    //   setIsLoading(false);
      
    //   // Demo validation - pretend "123456" is a valid code
    //   if (verificationCode === "123456") {
    //     setStep(3);
    //     toast({
    //       title: "Success",
    //       description: "Two-factor authentication has been enabled",
    //     });
    //   } else {
    //     toast({
    //       title: "Verification failed",
    //       description: "Invalid code. Please try again",
    //       variant: "destructive",
    //     });
    //   }
    // }, 1500);
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };
  const handleContinue=async()=>{

    
    setStep(2)
  }


  return (

<motion.section

className="space-y-6 max-w-[600px] primary-p"
>
  <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-10 flex items-center gap-3"
      >

        <Settings2 className="w-7 h-7 text-indigo-500" />

        Setup-2FA
      </motion.h1>
{
  step===2?
  <div className=" flex flex-col gap-4 animate-fade-in">
        <h3 className="text-lg font-medium">Verify Setup</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enter the verification code from your authenticator app to confirm setup
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <div className="flex justify-center mt-6">


            <InputOTP 
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}

            >
              <InputOTPGroup className="sm:gap-4 gap-2 flex flex-wrap justify-center">
                       {Array.from({ length: 6 }).map((_, index) => (
    <InputOTPSlot key={index} index={index} className="size-[40px] text-xl sm:size-[50px] sm:text-3xl" />
  ))}
              </InputOTPGroup>
      
            </InputOTP>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button
            type="button"
            disabled={cLoading || verificationCode.length < 6}
            className="w-full bg-shield-primary hover:bg-shield-secondary"
            onClick={handleVerify}
          >
            {cLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Verifying...
              </>
            ) : (
              "Verify Setup"
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setStep(1)}
          >
            Back to Setup
          </Button>
        </div>
      </div> 
      :
      step===3?
        <div className="space-y-6 primary-p max-w-[600px] animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="h-16 w-16 light:bg-blue-700 dark:text-shield-primary rounded-full dark:bg-shield-light light:text-white   flex items-center  justify-center animate-bounce-in">
            <Shield className="h-8 w-8 " />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-center">Two-Factor Authentication Enabled</h3>
        <p className="text-center light:text-gray-600 dark:text-gray-400">
          Your account is now more secure with two-factor authentication.
        </p>
        
        <Button 
          onClick={handleComplete}
          className="w-full text-white bg-shield-primary hover:bg-shield-secondary"
        >
          Continue to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="center">Back to Authentication ({timeLeft})</p>
      </div>
      :
   <form className="flex flex-col gap-4">
      <div className="flex items-center justify-center mb-4">
        <div className="h-12 w-12 rounded-full bg-shield-light/50 flex items-center justify-center">
          <QrCode className="h-6 w-6 text-shield-primary" />
        </div>
      </div>
      
      <p className="text-center text-gray-600 dark:text-gray-400">
        Scan this QR code with your authenticator app or enter the setup key manually
      </p>
      
      <Card className="overflow-hidden mx-auto w-full max-w-[300px]  border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="rounded-md p-4 flex items-center justify-center">
            <AspectRatio ratio={1 / 1} className=" h-full ">
             {!qrLoading? <img 
                src={qrCodeUrl || qr}
                alt="QR Code for TOTP setup" 
                className="flex-1 rounded-md object-contain w-full h-full"
              />:
              <span>loding....</span>
              }
            </AspectRatio>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <Label htmlFor="secret" className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          Manual Setup Key
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            id="secret"
            value={secretKey}
            readOnly
            className="font-mono bg-gray-50 dark:bg-gray-800"
          />
          <Button 
            type="button" 
            size="icon" 
            variant="outline" 
            onClick={handleCopySecret}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          If you can't scan the QR code, you can manually enter this secret key into your app
        </p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Setup Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>Install an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator</li>
          <li>Scan the QR code or manually enter the secret key</li>
          <li>Enter the 6-digit code shown in your app to verify setup</li>
        </ol>
      </div>
      
      <Button
        type="button"
        className="w-full bg-shield-primary hover:bg-shield-secondary"
        onClick={() => handleContinue()}
      >
        Continue
      </Button>
    </form>}
</motion.section>
 
  );
};






export {NewPasswordForm, LoginForm, LoginLayout,TwoFactorForm ,ForgotPasswordForm,OTPSetupForm}


// export default AuthDashboard;


