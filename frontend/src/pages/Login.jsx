import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEye, IoMail, IoLockClosed, IoLogoGoogle, IoCheckmarkCircle, IoCart, IoHeart, IoTrendingUp } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { shopDataContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Login() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [preload, setPreload] = useState(true);

  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const { product, cartCount } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Get featured product for background
  const featuredProduct = product && product.length > 0 ? product[0] : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreload(false);
      // Animations after preload
      gsap.fromTo(".login-container",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(".form-element",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      
      toast.success("🎉 Login successful! Welcome back to Riveto");
      setTimeout(() => {
        getCurrentUser();
        navigate("/");
      }, 500);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setGoogleLoading(true);
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      
      await axios.post(
        `${serverUrl}/api/auth/googlelogin`,
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        },
        { withCredentials: true }
      );
      
      toast.success("🎉 Google login successful!");
      setTimeout(() => {
        getCurrentUser();
        navigate("/");
      }, 500);
    } catch (err) {
      toast.error("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (preload) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-cyan-200 text-lg">Loading Riveto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0B0F1A] transition-colors duration-300">
      {/* LEFT PANEL - Journey Reinforcement */}
     <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Product Background Image */}
        {featuredProduct && (
          <div className="absolute inset-0">
            <img 
              src={featuredProduct.image1} 
              alt="Featured product"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.4) blur(2px)' }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A]/80 via-[#0B0F1A]/70 to-[#2563EB]/50" />
          </div>
        )}
        
        {/* Fallback gradient if no product */}
        {!featuredProduct && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-[#1e293b] to-[#2563EB]" />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          {/* Logo */}
          <div 
            onClick={() => navigate("/")}
            className="cursor-pointer mb-12"
            aria-label="Navigate Home"
          >
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Riveto
            </h1>
          </div>

          {/* Journey Reinforcement */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
                Welcome back 👋
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Your saved picks are still in stock.<br />
                <span className="text-cyan-400 font-semibold">Checkout in under 30 seconds.</span>
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <IoCart className="text-cyan-400 text-xl" />
                  </div>
                  <p className="text-2xl font-bold">{cartCount || 0}</p>
                </div>
                <p className="text-sm text-gray-300">Items in cart</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center">
                    <IoHeart className="text-rose-400 text-xl" />
                  </div>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <p className="text-sm text-gray-300">Saved items</p>
              </div>
            </div>

            {/* Retail Benefits */}
            <div className="space-y-3 mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <IoCheckmarkCircle className="text-cyan-400 text-xl flex-shrink-0" />
                <p className="text-gray-300">Checkout faster with saved addresses</p>
              </div>
              <div className="flex items-center gap-3">
                <IoCheckmarkCircle className="text-cyan-400 text-xl flex-shrink-0" />
                <p className="text-gray-300">Save your favourites for later</p>
              </div>
              <div className="flex items-center gap-3">
                <IoCheckmarkCircle className="text-cyan-400 text-xl flex-shrink-0" />
                <p className="text-gray-300">Track your orders in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#0B0F1A]">
        <div className="login-container max-w-md w-full">
          {/* Mobile Logo */}
          <div 
            onClick={() => navigate("/")}
            className="cursor-pointer mb-8 text-center lg:hidden"
            aria-label="Navigate Home"
          >
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Riveto
            </h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Log in to resume checkout and track your orders.
            </p>
          </div>

        {/* Card Container */}
        <div className="space-y-6">
          {/* LAYER 1: Google Login - Primary CTA */}
          <button
            onClick={googleLogin}
            disabled={googleLoading}
            className="form-element w-full flex items-center justify-center gap-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl py-4 px-6 font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FcGoogle className="w-6 h-6" />
            )}
            Continue with Google
          </button>

          {/* Collapsible Email Form */}
          <div>
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-cyan-400 transition-colors font-medium"
            >
              {showEmailForm ? 'Hide email options' : 'Use Email Instead'}
            </button>

            {showEmailForm && (
              <div className="mt-6 space-y-6 animate-fadeIn">
                {/* Divider */}
                <div className="flex items-center">
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                  <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email Field */}
                  <div className="form-element">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <IoMail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Password Field */}
                  <div className="form-element">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <IoLockClosed className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type={show ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-[#2563EB] transition-colors"
                        aria-label={show ? "Hide password" : "Show password"}
                      >
                        {show ? <IoEye className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  {/* Forgot Password */}
                  <div className="form-element text-right">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-[#2563EB] hover:text-[#1d4ed8] text-sm transition-colors font-medium"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* Submit Button - Outcome Driven */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="form-element w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Accessing...
                      </>
                    ) : (
                      "Continue Shopping"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sign Up Link */}
          <div className="form-element text-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
