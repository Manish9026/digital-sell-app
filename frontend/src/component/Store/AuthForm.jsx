import React, { useEffect, useRef, useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { FaGoogle, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';
import { Link } from 'react-router-dom';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [stars, setStars] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      const { offsetWidth, offsetHeight } = formRef.current;
      const newStars = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * offsetWidth,
        y: Math.random() * offsetHeight,
        duration: Math.random() * 20 + 5
      }));
      setStars(newStars);
    }
  }, []);

  const validate = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Registration successful');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div  ref={formRef} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {stars.map((star, i) => (
            <motion.div
              key={i}
              initial={{ x: star.x, y: star.y, opacity: 0 }}
              animate={{ x: Math.random() * 300, y: Math.random() * 400, opacity: 1 }}
              transition={{ duration: star.duration, repeat: Infinity, repeatType: 'mirror' }}
              className="w-1 h-1 bg-white rounded-full absolute"
              style={{ left: 0, top: 0 }}
            />
          ))}
        </div>
      <motion.div
       
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 shadow-2xl rounded-2xl p-8 w-full max-w-md bg-gradient-to-tr light:from-slate-500 light:via-indigo-100 light:to-slate-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
      >
        

        <h2 className="text-3xl font-bold text-center text-gray-800 light:text-gray-800 dark:text-white mb-6">
          Create Account
        </h2>

        <form className="space-y-4 relative z-10" onSubmit={handleSubmit} noValidate>
          <div className="flex gap-3">
            <div className="relative w-1/2">
              <MdPerson className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full rounded-lg light:border-slate-500  border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300 light:border-gray-300 dark:border-gray-700'
                } light:bg-slate-300 dark:bg-gray-800 light:text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 
                  `}
              />
              <AnimatePresence>
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-red-500 mt-1 ml-1"
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="relative w-1/2">
              <MdPerson className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300 light:border-gray-300 dark:border-gray-700'
                } light:bg-slate-300 
                light:border-slate-500  dark:bg-gray-800 light:text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
              <AnimatePresence>
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-red-500 mt-1 ml-1"
                  >
                    {errors.lastName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative">
            <MdEmail className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300 light:border-gray-300 dark:border-gray-700'
              } light:bg-slate-300 dark:bg-gray-800 light:text-gray-800 light:border-slate-500
              dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-500 mt-1 ml-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <MdLock className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300 light:border-gray-300 dark:border-gray-700'
              } light:bg-slate-300 dark:bg-gray-800 light:text-gray-800 light:border-slate-500 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            />
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-500 mt-1 ml-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <MdLock className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300 light:border-gray-300 dark:border-gray-700'
              } light:bg-slate-300 dark:bg-gray-800 light:text-gray-800 light:border-slate-500 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            />
            <AnimatePresence>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-500 mt-1 ml-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-300"
          >
            Register
          </button>
        </form>

<HandleLink type="register"/>

<LineBreaker title="Register with" />
       

        <div className="mt-4 flex justify-center gap-4 relative z-10">
          <button
            type="button"
            onClick={() => alert('Continue with Google')}
            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
          >
            <FaGoogle />
          </button>
          <button
            type="button"
            onClick={() => alert('Continue with Facebook')}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
          >
            <FaFacebookF />
          </button>
          <button
            type="button"
            onClick={() => alert('Continue with Instagram')}
            className="p-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90 text-white rounded-full transition"
          >
            <FaInstagram />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [stars, setStars] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      const { offsetWidth, offsetHeight } = formRef.current;
      const newStars = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * offsetWidth,
        y: Math.random() * offsetHeight,
        duration: Math.random() * 20 + 5
      }));
      setStars(newStars);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Login successful');
    }
  };

  return (
    <div ref={formRef} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-800 dark:via-gray-900 dark:to-black">
       <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {stars.map((star, i) => (
            <motion.div
              key={i}
              initial={{ x: star.x, y: star.y, opacity: 0 }}
              animate={{ x: Math.random() * 300, y: Math.random() * 400, opacity: 1 }}
              transition={{ duration: star.duration, repeat: Infinity, repeatType: 'mirror' }}
              className=" rounded-full absolute"
              style={{ left: 0, top: 0 }}
              children={"*"}
            />
          ))}
        </div>
      <motion.div
        
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 shadow-2xl rounded-2xl p-8 w-full max-w-md bg-gradient-to-tr light:from-slate-500 light:via-indigo-100 light:to-slate-500  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
      >
       

        <h2 className="text-3xl font-bold text-center light:text-gray-800 dark:text-white mb-6">
          Welcome Back
        </h2>

        <form className="space-y-4 relative z-10" onSubmit={handleSubmit} noValidate>
          <div className="relative">
            <MdEmail className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300 light:border-gray-300 dark:border-gray-700'
              } light:bg-slate-300 dark:bg-gray-800 light:text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-500 mt-1 ml-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative light:text-gray-800">
            <MdLock className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300 light:border-gray-500 dark:border-gray-700'
              } light:bg-slate-300 dark:bg-gray-800 light:text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            />
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-500 mt-1 ml-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-300"
          >
            Login
          </button>
        </form>
<HandleLink/>
<LineBreaker title="Login with" />


        <div className="mt-4 flex justify-center gap-4 relative z-10">
          <button className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition">
            <FaGoogle />
          </button>
          <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition">
            <FaFacebookF />
          </button>
          <button className="p-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90 text-white rounded-full transition">
            <FaInstagram />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const HandleLink=({type="login"})=>{
  return (
    <span>
      {type==="register" ?
        <Link to={"/user/login"} className="text-indigo-600 hover:text-indigo-700 center p-2">Already have an account? Login</Link> :
        
        <Link to="/user/register" className="text-indigo-600  hover:text-indigo-700 center mt-4">Don't have an account? Register</Link>

      }

    </span>
  )
}
const LineBreaker=({title})=>{
  return (

      <div className="flex items-center my-6">
  <div className="flex-grow border-t border-dashed border-gray-400 dark:border-gray-600"></div>
  <span className="px-4 text-sm text-gray-500 dark:text-gray-400">{title}</span>
  <div className="flex-grow border-t border-dashed border-gray-400 dark:border-gray-600"></div>
</div>
    
  )
}
export  {RegistrationForm,LoginForm};
export default {RegistrationForm,LoginForm};
