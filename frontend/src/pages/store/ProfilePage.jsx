import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  PackageSearch,
  ShoppingCart,
  UploadCloud,
  KeyRound,
  Phone,
  MapPin,
  Info,
  Lock,
  MailCheck
} from "lucide-react";
import { useSelector } from "react-redux";

import { FileText, PlayCircle, Download, ShoppingBag } from "lucide-react";
import { CheckCircle, Hourglass, CreditCard } from "lucide-react";

 function Orders() {
  const orders = [
    {
      orderId: "1234",
      productName: "React Native Course",
      price: "₹799",
      status: "Completed",
      statusColor: "green",
      icon: <ShoppingCart className="w-8 h-8 text-blue-500" />,
    },
    {
      orderId: "1235",
      productName: "UI Design Kit",
      price: "₹299",
      status: "Pending",
      statusColor: "yellow",
      icon: <Hourglass className="w-8 h-8 text-orange-500" />,
    },
    {
      orderId: "1236",
      productName: "JavaScript Mastery eBook",
      price: "₹199",
      status: "Completed",
      statusColor: "green",
      icon: <CreditCard className="w-8 h-8 text-red-500" />,
    },
    ,
    {
      orderId: "1235",
      productName: "UI Design Kit",
      price: "₹299",
      status: "Pending",
      statusColor: "yellow",
      icon: <Hourglass className="w-8 h-8 text-orange-500" />,
    },
    {
      orderId: "1236",
      productName: "JavaScript Mastery eBook",
      price: "₹199",
      status: "Completed",
      statusColor: "green",
      icon: <CreditCard className="w-8 h-8 text-red-500" />,
    },
    ,
    {
      orderId: "1235",
      productName: "UI Design Kit",
      price: "₹299",
      status: "Pending",
      statusColor: "yellow",
      icon: <Hourglass className="w-8 h-8 text-orange-500" />,
    },
    {
      orderId: "1236",
      productName: "JavaScript Mastery eBook",
      price: "₹199",
      status: "Completed",
      statusColor: "green",
      icon: <CreditCard className="w-8 h-8 text-red-500" />,
    },
  ];

  return (
    <div className="grid xs:grid-cols-2 xs:gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {orders.map((order, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-100/40 dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <div className="p-6 flex flex-col items-center">
            <div className="mb-4">{order.icon}</div>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
              Order #{order.orderId}
            </h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-300">
              {order.productName}
            </p>
            <p className="text-md font-bold text-center text-gray-800 dark:text-white">
              {order.price}
            </p>
            <p
              className={`text-sm text-center font-semibold text-${order.statusColor}-600 dark:text-${order.statusColor}-400`}
            >
              {order.status}
            </p>
            <div className="mt-4 flex gap-2">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-200">
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

 function MyProducts() {
  const products = [
    {
      name: "JavaScript Mastery eBook",
      downloads: 150,
      icon: <FileText className="w-8 h-8 text-blue-500" />,
    },
    {
      name: "React Native Course",
      downloads: 95,
      icon: <PlayCircle className="w-8 h-8 text-green-500" />,
    },
    {
      name: "UI Design Kit",
      downloads: 300,
      icon: <Download className="w-8 h-8 text-yellow-500" />,
    },
    {
      name: "Creative Product Design Templates",
      downloads: 120,
      icon: <ShoppingBag className="w-8 h-8 text-red-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-6">
      {products.map((product, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className="light:bg-slate-100/40 dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <div className="p-6 flex flex-col items-center">
            <div className="mb-4">{product.icon}</div>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
              {product.name}
            </h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-300">
              {product.downloads} Downloads
            </p>
            <div className="mt-4 flex gap-2">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-200">
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Profile({user}){
    const [isEditing, setIsEditing] = useState(false);
    const [showOtpBox, setShowOtpBox] = useState(false);
    const [otp, setOtp] = useState("");
    const [formData, setFormData] = useState({
      name: user?.firstName + " " + user?.lastName,
      email: user?.userEmail,
      phone: "9876543210",
      address: "Varanasi, India",
      bio: "Passionate creator and developer.",
      role: "Creator",
      password: "",
      photo: null,
      photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handlePhotoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          photo: file,
          photoURL: URL.createObjectURL(file),
        });
      }
    };
  
    const handleSave = () => {
      setIsEditing(false);
      console.log("Saved profile:", formData);
    };
  
    const handlePasswordReset = () => {
      setShowOtpBox(true);
    };
  
    const handleVerifyOtp = () => {
      console.log("Verifying OTP:", otp);
      setShowOtpBox(false);
    };
  
    const inputBaseClass = "w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white shadow-sky-200/30 shadow-sm hover:shadow-md transition";
  
    return(
        isEditing ? (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
             className="space-y-6 max-w-xl mx-auto bg-slate-100/40 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex flex-col items-center center gap-3">
                <img
                  src={formData.photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-600 center shadow-lg"
                />
                <label className="cursor-pointer text-sm text-blue-600 flex items-center gap-1">
                  <UploadCloud className="w-4 h-4" /> Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
              {[ 
                { label: "Username / Display Name", name: "name" },
                { label: "Email", name: "email" },
                { label: "Phone Number", name: "phone", icon: <Phone className="w-4 h-4 mr-1" /> },
                { label: "Address / Location", name: "address", icon: <MapPin className="w-4 h-4 mr-1" /> },
                { label: "Bio / About Me", name: "bio", icon: <Info className="w-4 h-4 mr-1" />, textarea: true },
              ].map(({ label, name, icon, textarea }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-1">{label}</label>
                  <div className="relative">
                    {icon && <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>}
                    {textarea ? (
                      <textarea
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        rows={3}
                        className={`${inputBaseClass} pl-10`}
                      />
                    ) : (
                      <input
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        type="text"
                        className={`${inputBaseClass} ${icon ? 'pl-10' : ''}`}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className="space-y-2">
                <button
                  onClick={handlePasswordReset}
                  className="w-full bg-yellow-500 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-600 shadow hover:shadow-md"
                >
                  <Lock className="w-4 h-4" /> Reset Password via Gmail
                </button>
                {showOtpBox && (
                  <div className="space-y-2 mt-3 p-4 border rounded-xl bg-slate-50 dark:bg-slate-900 shadow">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">Enter OTP sent to your email</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className={inputBaseClass}
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 shadow hover:shadow-md"
                    >
                      <MailCheck className="w-4 h-4 inline mr-1" /> Verify OTP
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleSave}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow hover:shadow-lg"
              >
                Save Changes
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4 max-w-md mx-auto text-center bg-slate-100/40 dark:bg-slate-800 p-6  rounded-2xl shadow-xl">
              <img
                src={formData.photoURL}
                alt="Profile"
                className="w-24 h-24 center rounded-full object-cover border-4 border-blue-600 mx-auto shadow-md"
              />
              <div className="space-y-2 text-left">
                <p><strong>Username:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Address:</strong> {formData.address}</p>
                <p><strong>Bio:</strong> {formData.bio}</p>
                <p><strong>Role:</strong> {formData.role}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 shadow hover:shadow-lg"
              >
                Edit Profile
              </button>
            </div>
          )
    )
}
const tabs = [
  { name: "Profile", icon: <User className="w-5 h-5 mr-2" /> },
  { name: "My Products", icon: <PackageSearch className="w-5 h-5 mr-2" /> },
  { name: "Orders", icon: <ShoppingCart className="w-5 h-5 mr-2" /> },
];

export default function ProfileTabs() {
    const {user}=useSelector((state) => state.authReducer);
    const [activeTab, setActiveTab] = useState("Profile");
  
  const tabContent = {
    Profile:<Profile user={user}/>,
    "My Products": (
     <MyProducts />
    ),
    Orders: (
      <Orders />
    ),
  };

  return (
    <div className="flex flex-col max-w-5xl flex-1 w-full mx-auto p-4  light:bg-light dark:bg-primary">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab.name
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-slate-100/40  dark:bg-slate-700 text-gray-800 dark:text-gray-100"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      <div className="relative min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + "-view"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-gray-800 dark:text-gray-100 text-base"
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
