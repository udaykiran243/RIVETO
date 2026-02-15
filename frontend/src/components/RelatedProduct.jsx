import React, { useContext, useEffect, useState } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Title from './Title';
import Card from './Card';

function RelatedProduct({ category, subCategory, currentProductId, tags = [], price = 0 }) {
  const { product } = useContext(shopDataContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (product.length > 0) {
      // Calculate similarity score for each product
      const scoredProducts = product
        .filter((item) => item._id?.toString() !== currentProductId?.toString())
        .map((item) => {
          let score = 0;

          // 1. Category match (highest priority) - 40 points
          if (item.category?.toLowerCase().trim() === category?.toLowerCase().trim()) {
            score += 40;
            
            // 2. SubCategory match - additional 30 points
            if (item.subCategory?.toLowerCase().trim() === subCategory?.toLowerCase().trim()) {
              score += 30;
            }
          }

          // 3. Tag similarity - up to 20 points
          if (tags && tags.length > 0 && item.tags && item.tags.length > 0) {
            const commonTags = item.tags.filter(tag => 
              tags.some(t => t?.toLowerCase() === tag?.toLowerCase())
            );
            const tagScore = (commonTags.length / Math.max(tags.length, item.tags.length)) * 20;
            score += tagScore;
          }

          // 4. Price range similarity - up to 15 points
          if (price > 0 && item.price) {
            const priceDiff = Math.abs(item.price - price);
            const priceRange = price * 0.5; // Within 50% price range
            const priceScore = Math.max(0, 15 - (priceDiff / priceRange) * 15);
            score += priceScore;
          }

          // 5. Popularity/Rating boost - up to 10 points
          if (item.rating) {
            score += (item.rating / 5) * 5;
          }
          if (item.popularity) {
            score += Math.min(item.popularity / 20, 5); // Cap at 5 points
          }

          return { ...item, score };
        })
        // Filter: Only include products with meaningful similarity
        // Minimum score of 20 ensures at least category match OR strong tag/price similarity
        // This prevents unrelated products from appearing
        .filter((item) => {
          // Require minimum score of 20 (ensures genuine similarity)
          if (item.score < 20) return false;
          
          // Additional check: Must have at least category match OR tag overlap
          const hasTagOverlap = tags && tags.length > 0 && item.tags && item.tags.length > 0 &&
            item.tags.some(tag => tags.some(t => t?.toLowerCase() === tag?.toLowerCase()));
          const hasCategoryMatch = item.category?.toLowerCase().trim() === category?.toLowerCase().trim();
          
          return hasCategoryMatch || hasTagOverlap;
        })
        // Sort by score (highest first) and take top 4
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      setRelated(scoredProducts);
    }
  }, [product, category, subCategory, currentProductId, tags, price]);

  return (
    <section className="w-full bg-gradient-to-l from-[#0e0e0e] to-[#1a1f22] py-12 px-4 md:px-16 lg:px-24">
      {/* Section Title */}
      <div className="mb-8">
        <Title text1="SIMILAR" text2="ITEMS" />
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {related.length > 0 ? (
          related.map((item) => (
            <Card
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image1}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center text-sm">
            No similar products found.
          </p>
        )}
      </div>
    </section>
  );
}

export default RelatedProduct;
