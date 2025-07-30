// src/components/Home/ProductCarouselSkeleton.jsx
import React from 'react';
import { Box, Skeleton } from '@mui/material'; // Removed Grid, as we'll use flexbox

const ProductCarouselSkeleton = () => {
  return (
    // Outer container matching ProductCarousel's div
    <Box className="bg-[#fff] py-8 md:py-12">
      {/* --- Skeleton Carousel Header --- */}
      <Box className="flex justify-between items-center mb-6 px-4 md:px-8">
        {/* Skeleton for category title */}
        <Skeleton variant="text" width="180px" height={40} /> {/* Adjust width/height to fit your h2 */}
        {/* Skeleton for "See More" button */}
        <Skeleton variant="rectangular" width="100px" height={40} sx={{ borderRadius: '8px' }} /> {/* Matches Button size */}
      </Box>

      {/* --- Skeleton Scrollable Product Area --- */}
      {/* Mimics the flex overflow-x-auto container */}
      <Box className="flex overflow-x-hidden gap-6 py-4 px-4 md:px-8">
        {[...Array(4)].map((_, index) => ( // Render 4-5 skeleton cards for the visible area
          <Box
            key={index}
            // Mimics the actual product card's className
            className="group relative inline-block flex-shrink-0 w-72 bg-[#faf7f3] rounded-xl border border-[#dcc5b2] shadow-md"
          >
            <Box className="p-4 flex flex-col h-full">
              {/* Product Image Skeleton */}
              <Skeleton variant="rectangular" width="100%" height={192} sx={{ borderRadius: '8px' }} /> {/* h-48 is 192px */}

              <Box className="mt-4 flex-grow">
                {/* Product Title Skeleton */}
                <Skeleton variant="text" width="70%" height={28} /> {/* Adjust height for h3 */}
                <Skeleton variant="text" width="85%" height={28} /> {/* Second line for title if it wraps */}

                {/* Rating & Review Count Skeleton */}
                <Box className="flex items-center mt-1">
                  <Skeleton variant="text" width="50px" height={20} /> {/* For stars */}
                  <Skeleton variant="text" width="70px" height={20} sx={{ ml: 2 }} /> {/* For review count */}
                </Box>

                {/* Price Skeleton */}
                <Box className="mt-2 flex items-baseline gap-2">
                  <Skeleton variant="text" width="70px" height={36} /> {/* For main price */}
                  <Skeleton variant="text" width="60px" height={24} /> {/* For original price */}
                </Box>
              </Box>

              {/* Buttons Skeleton */}
              <Box className="mt-4 pt-4 border-t border-[#dcc5b2] flex items-center gap-3">
                <Skeleton variant="rectangular" width="60%" height={40} sx={{ borderRadius: '8px' }} /> {/* Buy Now button */}
                <Skeleton variant="circular" width={40} height={40} /> {/* Shopping Cart button */}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProductCarouselSkeleton;