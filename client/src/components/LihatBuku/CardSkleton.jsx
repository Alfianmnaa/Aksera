export const CardSkleton = () => (
  <div className="w-full sm:w-[48%] md:w-[31%] flex justify-center">
    <div className="rounded-[28px] shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)] border-1 p-4 w-full max-w-xs bg-white flex flex-col animate-pulse">
      <div className="h-36 bg-gray-300 rounded-xl mb-4" />
      <div className="flex flex-col flex-1 space-y-2">
        <div className="flex justify-between">
          <div className="w-2/3 h-5 bg-gray-300 rounded" />
          <div className="w-1/4 h-3 bg-gray-200 rounded self-end" />
        </div>
        <div className="w-1/2 h-3 bg-gray-200 rounded" />
        <div className="w-full h-4 bg-gray-300 rounded mt-2" />
        <div className="w-3/4 h-4 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2" />
          <div>
            <div className="w-24 h-4 bg-gray-300 rounded mb-1" />
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="w-5 h-5 bg-gray-300 rounded-full" />
          <div className="w-5 h-5 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);
