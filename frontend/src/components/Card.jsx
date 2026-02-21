import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { FaEye, FaHeart, FaShoppingCart, FaStar, FaCheck } from 'react-icons/fa';
import { RiPriceTag3Line } from "react-icons/ri";
import { toast } from 'react-toastify';
import gsap from 'gsap';

function Card({ name, image, id, price, showQuickActions = true, badge, badgeColor = "from-blue-500 to-cyan-500", onCompare, isCompared }) {
  const { currency, addtoCart, addToWishlist } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  // Removed 3D tilt effect for corporate stability
  const handleMouseMove = (e) => {
    // No transform changes - stability over motion
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // No transform changes - stability over motion
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // No transform changes - stability over motion
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Show warning and navigate to product detail where size selection is required
    toast.warning('Please select a size before adding to cart', {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
    // Navigate to product detail page for proper size selection
    navigate(`/productdetail/${id}`);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();

    // Heart animation
    gsap.to(e.currentTarget, {
      scale: 1.5,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'back.out(2)'
    });

    addToWishlist(id);
    toast.success('Added to wishlist! 💖', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/productdetail/${id}`);
  };

  // Generate stable random values based on product id
  const { rating, reviewCount, discountPercent } = useMemo(() => {
    // Use id as seed for deterministic random values
    const seed = typeof id === 'string' ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : id;
    const pseudoRandom = (offset) => ((seed * 9301 + offset * 49297) % 233280) / 233280;
    return {
      rating: (pseudoRandom(1) * 1.5 + 3.5).toFixed(1),
      reviewCount: Math.floor(pseudoRandom(2) * 100) + 15,
      discountPercent: Math.floor(pseudoRandom(3) * 30) + 10,
    };
  }, [id]);
  const originalPrice = (price * 1.3).toFixed(2);

  return (
    <div
      ref={cardRef}
      className="relative bg-white dark:bg-[#121826] rounded-2xl overflow-hidden cursor-pointer group border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-[#2563EB]/50"
      onClick={() => navigate(`/productdetail/${id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Removed dynamic glow effect for commerce stability */}

      {/* Animated Border Gradient - Removed for commerce stability */}

      {/* Image Container */}
      <div className="relative overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        )}

        <img
          src={imageError ? '/fallback.jpg' : image}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true);
            e.target.src = '/fallback.jpg';
          }}
          className={`w-full h-64 object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleQuickView}
            className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all duration-300 shadow-xl"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Quick View
          </button>
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className={`absolute top-4 right-4 flex flex-col gap-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
            }`}>
            <button
              onClick={handleAddToWishlist}
              className="w-11 h-11 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all duration-300 group/wishlist border border-gray-200 dark:border-gray-700 hover:border-rose-400 shadow-md"
              aria-label="Add to wishlist"
            >
              <FaHeart className="text-gray-700 dark:text-gray-300 text-sm group-hover/wishlist:text-rose-500 transition-colors" />
            </button>
            <button
              onClick={handleQuickView}
              className="w-11 h-11 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 group/view border border-gray-200 dark:border-gray-700 hover:border-blue-400 shadow-md"
              aria-label="Quick view"
            >
              <FaEye className="text-gray-700 dark:text-gray-300 text-sm group-hover/view:text-blue-600 transition-colors" />
            </button>

            {onCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare();
                }}
                className={`w-11 h-11 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group/compare border border-white/20 ${isCompared
                    ? 'bg-cyan-500 text-white hover:bg-cyan-400'
                    : 'bg-white/10 hover:bg-cyan-500/40 hover:border-cyan-400/50'
                  }`}
                aria-label={isCompared ? "Remove from comparison" : "Add to compare"}
              >
                <RiPriceTag3Line className={`text-sm transition-colors ${isCompared ? 'text-white' : 'text-white group-hover/compare:text-cyan-400'
                  }`} />
              </button>
            )}
          </div>
        )}

        {/* Discount Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-[#EF4444] text-white text-xs font-bold rounded-full shadow-lg">
            -{discountPercent}%
          </span>
        </div>

        {/* Custom Badge */}
        {badge && (
          <div className="absolute top-14 left-4">
            <span className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-full shadow-lg">
              {badge}
            </span>
          </div>
        )}
        {/* Stock Indicator */}
        <div className="absolute bottom-2 right-2">
          <div className="flex items-center gap-1.5 text-xs text-green-400 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
            <span>In Stock</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 relative z-10">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-sm transition-all duration-300 ${i < Math.floor(rating) ? 'text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]' : 'text-gray-400 dark:text-gray-600'
                  }`}
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
            <span className="text-gray-700 dark:text-white text-sm font-medium ml-1">{rating}</span>
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-xs">({reviewCount})</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 transition-colors duration-300 min-h-[3.5rem]">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <p className="text-gray-900 dark:text-white font-bold text-xl">
            {currency}{price.toLocaleString()}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm line-through font-light">
            {currency}{originalPrice}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${isAddingToCart
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] hover:shadow-lg'
            }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {isAddingToCart ? (
            <>
              <FaCheck className="text-white" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <FaShoppingCart className="transition-transform duration-300" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Hover Effect Border Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{
          boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.3)'
        }}
      />
    </div>
  );
}

export default Card;