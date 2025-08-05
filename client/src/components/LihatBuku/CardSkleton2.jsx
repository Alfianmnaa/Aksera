import React from "react";

const CardSkleton2 = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <nav className="text-sm text-gray-500 mb-4"></nav>
      <h1 className="text-3xl font-bold py-4"></h1>
      <div className="p-4 mt-16 rounded-xl shadow-md bg-white flex flex-col md:flex-row gap-4 animate-pulse">
        {/* Image Skeleton */}
        <div className="w-full md:w-1/3 h-60 bg-gray-300 rounded-lg"></div>

        {/* Text Skeleton */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>

          <div className="h-4 bg-gray-300 rounded w-20 mt-2"></div>

          <div className="space-y-2 mt-1">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-11/12"></div>
            <div className="h-4 bg-gray-300 rounded w-10/12"></div>
            <div className="h-4 bg-gray-300 rounded w-9/12"></div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 mt-4">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>

          {/* Footer icons */}
          <div className="flex gap-2 mt-auto justify-end">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSkleton2;
