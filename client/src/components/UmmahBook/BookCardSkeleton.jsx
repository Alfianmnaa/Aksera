import React from 'react';

function BookCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse">
      <div className="bg-gray-300 rounded-t-lg w-full h-48"></div>
      <div className="p-3">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export default BookCardSkeleton;