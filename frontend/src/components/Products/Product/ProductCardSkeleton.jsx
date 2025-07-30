// src/components/Products/Product/ProductCardSkeleton.jsx
import React from 'react';
import { Skeleton, Box } from '@mui/material'; // Using Box for consistency with MUI/Tailwind setup

const ProductCardSkeleton = () => {
  return (
    // Mimics the outer container of your ProductCard
    <Box className="group block bg-[#faf7f3] border m-4 border-[#dcc5b2] rounded-lg overflow-hidden shadow-sm">
      <div className="relative w-full h-80 overflow-hidden p-4">
        {/* Product Image Skeleton */}
        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '8px' }} />
      </div>

      {/* Product Info Skeleton */}
      <div className="p-4">
        {/* Title Skeleton */}
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
        {/* Price Skeleton */}
        <Skeleton variant="text" width="40%" height={28} sx={{ mb: 1 }} />
        {/* Rating/Reviews Skeleton */}
        <Skeleton variant="text" width="60%" height={20} />
      </div>
    </Box>
  );
};

export default ProductCardSkeleton;