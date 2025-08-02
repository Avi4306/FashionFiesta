import React from "react";

const PostSkeleton = () => {
  return (
    <div className="bg-card-bg rounded-xl shadow-md overflow-hidden flex flex-col h-full animate-pulse">
      {/* Header */}
      <div className="flex items-center p-4">
        <div className="h-10 w-10 bg-gray-300 rounded-full mr-3"></div>
        <div className="flex-grow">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Title */}
      <div className="p-4 pt-0 flex flex-col flex-grow">
        <div className="h-5 bg-gray-300 rounded w-2/3 mb-4"></div>

        {/* Image placeholder */}
        <div className="w-full h-52 bg-gray-200 rounded-md mb-4"></div>

        {/* Message */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Tags */}
        <div className="h-3 bg-gray-300 rounded w-1/3 mt-4"></div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 flex justify-between items-center">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
        <div className="h-4 bg-gray-300 rounded w-12"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;