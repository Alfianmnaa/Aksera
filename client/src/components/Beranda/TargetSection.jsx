import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import targetImage from "../../assets/Beranda/targetImage.webp";

export const TargetSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const stats = [
    { value: 2000, label: "Materi Terpercaya" },
    { value: 5000, label: "Pengguna" },
    { value: 10000, label: "Alat Pendidikan" },
    { value: 1500, label: "Mitra/Komunitas" },
  ];

  return (
    <section className="w-full bg-[#0E4C92] py-16 px-4 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Gambar */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={targetImage} alt="Target Kami" className="md:max-w-[380px] max-w-[320px] w-full" />
        </div>

        {/* Statistik */}
        <div className="w-full md:w-1/2 text-white" ref={ref}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Target Kami</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-md p-4 text-center shadow-md">
                <div className="text-2xl text-[#0E4C92]  md:text-[32px] font-semibold">{inView && <CountUp end={stat.value} duration={2} separator="," />}+</div>
                <div className="text-black  text-xs sm:text-base md:text-lg sm:mt-2 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
