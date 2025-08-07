import React from "react";
import heroBeranda from "../../assets/Beranda/HeroBeranda.webp";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  let buttonText1 = "Donasi Sekarang";
  let buttonText2 = "Belajar Sekarang";
  let targetPath = "/lihat-donasi";
  let targetPath2 = "/ummah-book";

  return (
    <section className="relative h-screen w-full bg-black">
      <img src={heroBeranda} alt="Children learning" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative z-10 flex justify-between items-center h-full px-10 md:px-16 lg:px-36 text-white">
        <div className="w-full">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-16 font-bold leading-tight">Ayo Jadi Pahlawan Pendidikan!</h1>
          <p className="text-center mt-4 text-base sm:text-lg md:text-md">Satu kontribusi Anda bisa membuka akses belajar bagi anak bangsa.</p>

          <div className="flex justify-center flex-wrap gap-4 mt-6">
            <button onClick={() => navigate(targetPath)} className="inline-flex gap-2 items-center bg-primary hover:bg-[#013a6b] text-white font-medium px-5 py-3 rounded-full transition duration-300">
              <p>{buttonText1}</p>
            </button>
            <button onClick={() => navigate(targetPath2)} className="inline-flex gap-2 items-center bg-[#049494] hover:bg-[#037373] text-white font-medium px-5 py-3 rounded-full transition duration-300">
              <p>{buttonText2}</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
