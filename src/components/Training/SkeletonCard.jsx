import React from "react";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 md:flex justify-between gap-6">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:w-48 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mx-auto md:ml-auto"></div>
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;