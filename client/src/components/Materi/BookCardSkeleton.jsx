import React from "react";

function BookCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg animate-pulse overflow-hidden">
      {/* Skeleton for image */}
      <div className="bg-gray-200 rounded-t-xl w-full h-64"></div>

      <div className="p-5">
        {/* Skeleton for tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
        </div>
        {/* Skeleton for title */}
        <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
        {/* Skeleton for author */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export default BookCardSkeleton;
