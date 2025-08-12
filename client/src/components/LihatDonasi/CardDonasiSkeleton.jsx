export const CardDonasiSkeleton = () => (
  <div className="w-[290px] bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 flex flex-col overflow-hidden animate-pulse relative">
    {/* Gambar */}
    <div className="relative">
      <div className="w-full h-48 bg-gray-200" />
      
      {/* Badge Status Skeleton - Pojok Kiri Atas */}
      <div className="absolute top-3 left-3">
        <div className="w-16 h-6 bg-gray-300 rounded-full" />
      </div>

      {/* Share & Save Buttons Skeleton - Pojok Kanan Atas */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </div>

    {/* Konten */}
    <div className="p-4 flex flex-col justify-between flex-grow text-sm relative">
      {/* Title */}
      <div className="mb-2">
        <div className="h-6 bg-gray-200 rounded w-4/5" />
      </div>
      
      {/* Description */}
      <div className="space-y-2 mb-4 flex-grow">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      
      {/* Garis Pembatas */}
      <div className="w-full h-px bg-gray-200 mb-3"></div>
      
      {/* Bottom Section */}
      <div className="flex">
        {/* Profile, Name & Location - Pojok Kiri Bawah (2/3 width) */}
        <div className="flex-[2] flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="space-y-1">
            <div className="w-20 h-4 bg-gray-200 rounded" />
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
        </div>
        
        {/* Jenis Barang & Tanggal - Pojok Kanan Bawah (1/3 width) */}
        <div className="flex-[1] text-right space-y-1">
          <div className="w-16 h-3 bg-gray-200 rounded ml-auto" />
          <div className="w-12 h-3 bg-gray-200 rounded ml-auto" />
        </div>
      </div>
    </div>
  </div>
);
