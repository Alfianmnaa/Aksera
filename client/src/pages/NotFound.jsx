import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="mt-32 flex items-center justify-center  px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-4 text-[#205781]">404</h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">Oops! Halaman Tidak Ditemukan</h2>
        <p className="mb-6 text-sm md:text-base ">Sepertinya kamu tersesat. Halaman yang kamu cari tidak tersedia.</p>
        <Link to="/" className="inline-block mt-4 bg-[#205781] hover:bg-[#0B1E2C] text-white text-sm sm:text-base font-semibold py-2 px-6 rounded-xl transition duration-300">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
