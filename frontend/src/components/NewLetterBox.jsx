import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { toast } from 'react-toastify';

function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      toast.success('Successfully subscribed to our newsletter!');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 5000);
    }, 1000);
  };

  return (
    <section className="w-full bg-white dark:bg-[#0B0F1A] px-4 py-12 md:py-16 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Checkout-Style Surface Card */}
        <div className="bg-white dark:bg-[#121826] rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 md:p-8 shadow-lg">
          
          {isSubscribed ? (
            // Success State
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/20">
                <FaCheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Subscription Confirmed
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                You'll receive exclusive offers and updates in your inbox
              </p>
            </div>
          ) : (
            // Email Capture Form
            <>
              <div className="mb-5">
                <label className="block text-gray-900 dark:text-white font-semibold text-base md:text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Stay Updated
                </label>
                <p className="text-gray-500 dark:text-gray-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Get exclusive offers, new arrivals, and shopping updates
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdEmail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#0B0F1A] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 
                      focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] 
                      transition-all duration-200"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    required
                  />
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  By subscribing, you agree to receive promotional emails. You can unsubscribe at any time.
                </p>

                <button
                  type="submit"
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold py-3.5 rounded-xl 
                    transition-all duration-200 shadow-md hover:shadow-lg"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Subscribe
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewsletterBox;