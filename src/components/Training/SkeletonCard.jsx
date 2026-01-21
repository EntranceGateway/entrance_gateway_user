import React from "react";

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      {/* 1. Shimmer Effect Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

      {/* 2. Image Placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>

      {/* 3. Content Area */}
      <div className="space-y-3">
        {/* Category Badge Placeholder */}
        <div className="h-4 w-20 bg-gray-200 rounded-full"></div>

        {/* Title Placeholder */}
        <div className="h-6 w-11/12 bg-gray-200 rounded-md"></div>

        {/* Description Lines */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded-md opacity-70"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded-md opacity-70"></div>
        </div>

        {/* Footer: Price and Button Placeholder */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
          <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;