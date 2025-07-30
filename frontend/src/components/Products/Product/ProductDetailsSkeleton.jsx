// src/components/ProductDetails/ProductDetailsSkeleton.jsx
import React from 'react';
import { Box, Skeleton } from '@mui/material'; // Make sure @mui/material is installed

const ProductDetailsSkeleton = () => {
  return (
    <Box className="bg-[#faf7f3] mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <Box className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
        {/* Left Column: Image Gallery Skeleton */}
        <Box>
          <Skeleton variant="rectangular" width="100%" height={500} sx={{ borderRadius: '12px', bgcolor: '#e0e0e0' }} />
          <Box className="mt-4 flex gap-4 overflow-x-auto pb-2">
            <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: '8px', bgcolor: '#e0e0e0' }} />
            <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: '8px', bgcolor: '#e0e0e0' }} />
            <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: '8px', bgcolor: '#e0e0e0' }} />
            <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: '8px', bgcolor: '#e0e0e0' }} />
          </Box>
        </Box>

        {/* Right Column: Product Info Skeleton */}
        <Box className="flex flex-col">
          {/* Header Skeleton */}
          <Box className="flex items-start justify-between">
            <Box>
              <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} /> {/* Brand */}
              <Skeleton variant="text" width="80%" height={48} sx={{ mb: 1 }} /> {/* Title */}
              <Skeleton variant="text" width="40%" height={20} /> {/* Category */}
              <Box className="mt-2 flex items-center gap-2">
                 <Skeleton variant="circular" width={32} height={32} /> {/* Creator photo */}
                 <Skeleton variant="text" width="100px" height={20} /> {/* Creator name */}
                 <Skeleton variant="rectangular" width="60px" height={18} sx={{ borderRadius: '999px' }} /> {/* Role badge */}
              </Box>
            </Box>
            <Box className="flex flex-shrink-0 items-center gap-2">
              <Skeleton variant="circular" width={36} height={36} /> {/* Share button */}
              <Skeleton variant="circular" width={36} height={36} /> {/* Delete button */}
            </Box>
          </Box>

          {/* Pricing Skeleton */}
          <Box className="my-4 flex items-baseline gap-3">
            <Skeleton variant="text" width="120px" height={48} /> {/* Discounted Price */}
            <Skeleton variant="text" width="80px" height={32} /> {/* Original Price */}
            <Skeleton variant="rectangular" width="70px" height={24} sx={{ borderRadius: '999px' }} /> {/* Discount % */}
          </Box>

          {/* Description Skeleton */}
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="90%" height={24} />
          <Skeleton variant="text" width="70%" height={24} />

          {/* Variants Skeleton */}
          <Box className="mt-6">
            <Skeleton variant="text" width="30%" height={20} /> {/* Label */}
            <Box className="mt-2 flex flex-wrap gap-3">
              <Skeleton variant="rectangular" width={70} height={30} sx={{ borderRadius: '6px' }} />
              <Skeleton variant="rectangular" width={70} height={30} sx={{ borderRadius: '6px' }} />
              <Skeleton variant="rectangular" width={70} height={30} sx={{ borderRadius: '6px' }} />
            </Box>
             <Skeleton variant="text" width="30%" height={20} sx={{ mt: 3 }} /> {/* Label */}
            <Box className="mt-2 flex flex-wrap gap-3">
              <Skeleton variant="rectangular" width={70} height={30} sx={{ borderRadius: '6px' }} />
              <Skeleton variant="rectangular" width={70} height={30} sx={{ borderRadius: '6px' }} />
            </Box>
          </Box>

          {/* Stock Skeleton */}
          <Skeleton variant="rectangular" width="100px" height={24} sx={{ mt: 2, borderRadius: '999px' }} />

          {/* Quantity Selector Skeleton */}
          <Box className="mb-6 flex items-center gap-4 mt-8">
            <Skeleton variant="text" width="80px" height={24} /> {/* Quantity label */}
            <Box className="flex items-center">
              <Skeleton variant="rectangular" width={40} height={40} sx={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }} />
              <Skeleton variant="rectangular" width={56} height={40} />
              <Skeleton variant="rectangular" width={40} height={40} sx={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }} />
            </Box>
          </Box>

          {/* Action Buttons Skeleton */}
          <Box className="flex flex-col sm:flex-row gap-4 mt-8">
            <Skeleton variant="rectangular" width="100%" height={50} sx={{ borderRadius: '8px' }} />
            <Skeleton variant="rectangular" width="100%" height={50} sx={{ borderRadius: '8px' }} />
          </Box>

          {/* Reviews Section Title Skeleton */}
          <Box className="mt-10 border-t border-[#dcc5b2] pt-6">
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: '8px' }} /> {/* For AddReviewSection */}
          </Box>
        </Box>
      </Box>

      {/* Recommendations Section Skeleton (if always present or needs a placeholder) */}
      <Box className="mt-16 pt-10 border-t border-[#dcc5b2]">
        <Skeleton variant="text" width="300px" height={40} sx={{ mb: 4 }} /> {/* "You Might Also Like" title */}
        {/* Mimic a row of ProductCardSkeletons, similar to ProductCarouselSkeleton */}
        <Box className="flex overflow-x-hidden gap-6 py-4 px-4 md:px-8">
            {[...Array(4)].map((_, idx) => ( // Show 4 skeleton cards
                <Box key={idx} className="flex-shrink-0 w-72"> {/* Matches ProductCard width */}
                    <Skeleton variant="rectangular" width="100%" height={280} sx={{ borderRadius: '12px' }} /> {/* Image area */}
                    <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} /> {/* Title */}
                    <Skeleton variant="text" width="50%" height={20} /> {/* Price */}
                </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetailsSkeleton;