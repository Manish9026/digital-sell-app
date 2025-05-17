// PaymentSuccess.tsx
// import { CheckCircle } from "lucide-react";

 function PaymentSuccess( {
  userEmail,
  orderId,
  productName
}) {
  const handleBack = () => {
    window.location.href = "/";
  };

  const handleOpenMail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center animate-fade-in">
        {/* <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" /> */}
        <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Thank you for your purchase 🎉</p>

        <div className="text-left bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-2 mb-6">
          <p><strong>📧 Email:</strong> {userEmail}</p>
          <p><strong>🛒 Product:</strong> {productName}</p>
          <p><strong>🧾 Order ID:</strong> {orderId}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleOpenMail}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md"
          >
            📬 View Email
          </button>
          <button
            onClick={handleBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all shadow-md"
          >
            🔙 Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
// PaymentSuccessPage.tsx
import { useLocation, useSearchParams } from "react-router-dom";
// PaymentWaiting.tsx
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export  function PaymentWaiting() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center animate-fade-in">
        <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Processing Payment...</h2>
        <p className="text-gray-600 mb-6">Please wait while we confirm your payment. This may take a few seconds.</p>

        <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-900">
          🔒 Do not refresh or close this page
        </div>
      </div>
    </div>
  );
}

export  function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const location=useLocation();
console.log(location);
const [userData, setUserData] = useState({email:"not-found@example.com",orderId:"unknown",productName:"Unnamed Product"});
//   const userEmail = params.get("email") || "not-found@example.com";
//   const orderId = params.get("orderId") || "unknown";
//   const productName = params.get("product") || "Unnamed Product";
useEffect(() => {
 if(location.state){
  setUserData(location.state)
};
}, [location.state])

  return (
    <PaymentSuccess
      userEmail={userData.email}
      orderId={userData.orderId}
      productName={userData.productName}
    />
  );
}
