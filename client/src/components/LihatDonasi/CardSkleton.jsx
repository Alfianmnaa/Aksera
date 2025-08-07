
export const CardSkleton = () => (
  <div className="w-full max-w-xs bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden animate-pulse">
    {/* Image and Share Button */}
    <div className="relative">
      <div className="w-full h-48 bg-gray-200" />
      {/* Share Button Skeleton */}
      <div className="absolute top-3 right-3">
        <div className="w-8 h-8 bg-white/90 rounded-md" />
      </div>
    </div>

    <div className="p-4">
      {/* Author and Date */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-20 h-4 bg-gray-200 rounded ml-auto" />
      </div>

      {/* Title */}
      <div className="h-6 bg-gray-200 rounded mb-3 w-4/5" />

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>

      {/* Read More Link */}
      <div className="flex justify-end">
        <div className="w-32 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);