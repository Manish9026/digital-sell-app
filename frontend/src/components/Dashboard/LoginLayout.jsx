// import { ReactNode } from "react";
import { Shield } from "lucide-react";
// import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner"


import { useNavigate, useLocation, Link } from "react-router-dom";
import { Smartphone, Key, QrCode } from "lucide-react";
import { Mail, Lock } from "lucide-react";

// This is the login layout component

const LoginLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 light:from-slate-200  light:to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="absolute top-0 left-0 w-full h-64 bg-shield-primary/20 dark:bg-shield-primary/10 -z-10" />
      
      <div className="absolute top-4 right-4">
        {/* <ThemeToggle /> */}
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3  rounded-full dark:bg-shield-primary/20 bg-shield-light/50  mb-4">
            <Shield className="h-8 w-8 text-shield-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1 text-center">{subtitle}</p>}
        </div>
        
        <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent -translate-x-full animate-shimmer" />
          <div className="p-6 light:bg-light dark:bg-primary dark:text-light light:text-black">
            {children}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Protected by Login Shield &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};


// This is the login form component
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Example validation - in a real app this would be authenticated via backend
      if (email.includes("@") && password.length >= 6) {
        toast({
          title: "Verification required",
          description: "Please enter the code sent to your device",
        });
        
        // Since login was successful, navigate to 2FA page
        navigate("/2fa", { state: { email } });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
        <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
      
      <div className="flex items-center justify-between pt-2">
        <Link 
          to="/forgot-password"
          className="text-sm text-shield-primary hover:text-shield-secondary transition-colors"
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
  );
};



// this is the 2FA form component
// This component is used to verify the 2FA code sent to the user's device
const TwoFactorForm = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
//   const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your account";

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
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Example validation - in a real app this would verify via backend
      if (code === "123456" || code === "000000") {
        toast({
          title: "Success",
          description: "You have been successfully authenticated",
        });
        
        // Navigate to dashboard or home page after successful 2FA
        navigate("/dashboard");
      } else {
        toast({
          title: "Verification failed",
          description: "Invalid code. Please try again",
          variant: "destructive",
        });
      }
    }, 1500);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-center mb-4">
        <div className="h-12 w-12 rounded-full bg-shield-light/50 flex items-center justify-center">
          <Smartphone className="h-6 w-6 text-shield-primary" />
        </div>
      </div>
      
      <p className="text-center text-gray-600 dark:text-gray-400">
        We've sent a verification code to {email}. Please enter it below.
      </p>
      
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
          className="text-center text-lg font-mono tracking-widest border-gray-300 focus:border-shield-primary focus:ring-shield-primary/20"
          maxLength={6}
        />
      </div>
      
      <div className="space-y-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-shield-primary hover:bg-shield-secondary"
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
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => navigate("/otp-setup")}
          >
            <QrCode className="h-4 w-4" />
            Set up authenticator app
          </Button>
          <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
            Don't want to receive SMS codes? Set up an authenticator app instead.
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => navigate("/")}
        >
          Back to login
        </Button>
      </div>
    </form>
  );
};





import {  RefreshCcw, ArrowLeft } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
// import { toast } from "sonner";

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
    <>
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
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>
          </div>
        </form>
      )}
    </>
  );
};


export { LoginForm, LoginLayout,TwoFactorForm ,ForgotPasswordForm};
export default {LoginForm,LoginLayout,TwoFactorForm,ForgotPasswordForm};


