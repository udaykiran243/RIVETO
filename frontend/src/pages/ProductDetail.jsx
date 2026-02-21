import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import RelatedProduct from '../components/RelatedProduct';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaShoppingCart, FaHeart, FaShare, FaStar, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';

function ProductDetail() {
  const { productId } = useParams();
  const { product, currency, addtoCart, addToWishlist } = useContext(shopDataContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [size, setSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const found = product.find(item => item._id === productId);
    if (found) {
      setProductData(found);
      setSelectedImage(found.image1);
    }
  }, [productId, product]);

  const handleAddToCart = () => {
    if (!size) {
      toast.warning('Please select a size before adding to cart.');
      return;
    }
    addtoCart(productData._id, size, quantity);
    toast.success(`${quantity} x ${productData.name} added to cart!`);
  };

  const handleAddToWishlist = () => {
    addToWishlist(productData._id);
    toast.success('Added to wishlist! 💖');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.name,
          text: `Check out ${productData.name} on our store!`,
          url: window.location.href,
        });
        toast.success('Product shared successfully!');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    const images = [productData.image1, productData.image2, productData.image3, productData.image4].filter(Boolean);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setSelectedImage(images[(currentImageIndex + 1) % images.length]);
  };

  const prevImage = () => {
    const images = [productData.image1, productData.image2, productData.image3, productData.image4].filter(Boolean);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setSelectedImage(images[(currentImageIndex - 1 + images.length) % images.length]);
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex items-center justify-center pt-20">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  const images = [productData.image1, productData.image2, productData.image3, productData.image4].filter(Boolean);
  const rating = 4.5; // Example rating
  const reviewCount = 124;

  return (
    <div className="min-h-screen bg-[#0b1220]">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-lg overflow-hidden border border-[#1f2a44]">
              <img 
                src={selectedImage} 
                alt={productData.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                  >
                    <FaChevronLeft className="text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                  >
                    <FaChevronRight className="text-white" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                    selectedImage === img 
                      ? 'border-blue-500' 
                      : 'border-[#1f2a44] opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => {
                    setSelectedImage(img);
                    setCurrentImageIndex(i);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Purchase Module */}
          <div className="bg-[#111c33] border border-[#1f2a44] rounded-2xl p-8 flex flex-col gap-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500">
              Home / {productData.category} / {productData.subCategory}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white">{productData.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
                ))}
              </div>
              <span className="text-white font-medium">{rating}</span>
              <span className="text-gray-500">({reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-white">{currency}{productData.price.toLocaleString()}</p>
              {productData.originalPrice && (
                <>
                  <p className="text-xl text-gray-500 line-through">{currency}{productData.originalPrice.toLocaleString()}</p>
                  <span className="bg-red-500 text-white px-2.5 py-1 rounded text-sm font-semibold">
                    Save {currency}{(productData.originalPrice - productData.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed">{productData.description}</p>

            {/* Size Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white uppercase tracking-wide">Select Size</label>
              <div className="flex flex-wrap gap-2">
                {productData.sizes?.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSize(s)}
                    className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      size === s
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-[#0f172a] border-[#1f2a44] text-gray-300 hover:border-blue-500/40 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white uppercase tracking-wide">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-[#0f172a] border border-[#1f2a44] rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#1a2332] transition-colors text-gray-400"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-10 text-center text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#1a2332] transition-colors text-gray-400"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-500 text-sm">({productData.stock || 50} available)</span>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-8 rounded-lg font-semibold shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FaShoppingCart />
              Add to Cart - {currency}{(productData.price * quantity).toLocaleString()}
            </button>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToWishlist}
                className="flex-1 bg-[#0f172a] hover:bg-[#1a2332] border border-[#1f2a44] text-gray-300 hover:text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                title="Add to Wishlist"
              >
                <FaHeart />
                Wishlist
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 bg-[#0f172a] hover:bg-[#1a2332] border border-[#1f2a44] text-gray-300 hover:text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                title="Share Product"
              >
                <FaShare />
                Share
              </button>
            </div>

            {/* Trust Badges - Inline */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-[#1f2a44] text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-400" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-400" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-400" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs Section - Informational Phase */}
      <div className="bg-[#0f172a] mt-16 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex gap-6 border-b border-[#1f2a44] mb-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${reviewCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-[#111c33] border border-[#1f2a44] rounded-lg p-8">
            {activeTab === 'description' && (
              <div className="text-gray-300 space-y-4">
                <p className="leading-relaxed">
                  {productData.description || "Discover effortless style with our premium product. Designed with comfort and durability in mind, this piece blends timeless fashion with modern quality."}
                </p>
                <ul className="space-y-2 mt-6">
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-blue-400 flex-shrink-0" />
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-blue-400 flex-shrink-0" />
                    Comfortable and durable design
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheck className="text-blue-400 flex-shrink-0" />
                    Perfect for everyday wear
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
                <div>
                  <h4 className="text-white font-semibold mb-4">Product Details</h4>
                  <div className="space-y-2.5">
                    <p className="flex justify-between"><span className="text-gray-400">Material:</span> <span>Premium Fabric</span></p>
                    <p className="flex justify-between"><span className="text-gray-400">Color:</span> <span>As shown</span></p>
                    <p className="flex justify-between"><span className="text-gray-400">Weight:</span> <span>0.5 kg</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Dimensions</h4>
                  <div className="space-y-2.5">
                    <p className="flex justify-between"><span className="text-gray-400">Length:</span> <span>28 inches</span></p>
                    <p className="flex justify-between"><span className="text-gray-400">Width:</span> <span>20 inches</span></p>
                    <p className="flex justify-between"><span className="text-gray-400">Height:</span> <span>2 inches</span></p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-5">
                <div className="bg-[#0f172a] border border-[#1f2a44] p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                    <span className="text-white font-semibold">Excellent Product</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "I bought this last month and it's already my favorite item. Great quality, fits perfectly, and looks amazing. Would definitely recommend!"
                  </p>
                  <p className="text-gray-500 text-sm mt-4">- Sarah Johnson</p>
                </div>

                <div className="bg-[#0f172a] border border-[#1f2a44] p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                      <FaStar className="text-gray-600 text-sm" />
                    </div>
                    <span className="text-white font-semibold">Great Fit</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "Really happy with the material and fit. The quality is much better than I expected for the price. Will be buying again!"
                  </p>
                  <p className="text-gray-500 text-sm mt-4">- Mike Thompson</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-[#0b1220] py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Similar Items</h2>
          <RelatedProduct
            category={productData.category}
            subCategory={productData.subCategory}
            currentProductId={productData._id}
            tags={productData.tags || []}
            price={productData.price || 0}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;