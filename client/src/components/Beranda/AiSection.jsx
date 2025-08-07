import React, { useEffect, useState } from "react";
import aiIcon from "../../assets/Beranda/blackIcon.svg";
import aiWhiteIcon from "../../assets/Beranda/whiteIcon.svg";
import personIcon from "../../assets/Beranda/personIcon.svg";
import sendIcon from "../../assets/Beranda/sendIcon.svg";
import blueWave from "../../assets/Beranda/blueWave.svg";

export const AiSection = () => {
  const fullText = `Algoritma adalah langkah-langkah logis dan terstruktur untuk menyelesaikan suatu masalah. Dalam pemrograman, algoritma menjadi dasar dalam menyusun instruksi kepada komputer agar dapat melakukan tugas tertentu. Materi ini mencakup konsep dasar seperti variabel, tipe data, operator, percabangan (if/else), perulangan (for, while), fungsi, hingga struktur data sederhana (Baca Selengkapnya...)`;

  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 25); // kecepatan ketik, bisa kamu atur
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  return (
    <>
      <div className="min-h-screen bg-[#045394] bg-opacity-10 flex justify-center items-center px-4 md:pt-8 pt-10 md:pb-0 pb-12">
        <div className="w-full max-w-[800px]">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2 mb-8">
            <div className="flex items-center md:gap-4 gap-3">
              <div className="bg-[#219EBC] rounded-full p-4">
                <img src={aiWhiteIcon} alt="AI Icon" className="md:w-8 md:h-8 w-6 h-6" />
              </div>
              <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-[#1F2937]">Belajar Pakai AI</h1>
            </div>
          </div>

          {/* Chat Box */}
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            {/* Chat Header */}
            <div className="bg-[#045394] text-white text-center py-5 font-semibold md:text-2xl text-xl">Ngobrol bareng helpAi</div>

            {/* Chat Content */}
            <div className="p-4 space-y-4 bg-white">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-[#045394] text-white p-3 rounded-lg max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <img src={personIcon} alt="User Icon" className="w-5 h-5" />
                    <span className="text-base font-semibold">Anda</span>
                  </div>
                  <p className="text-base">[Ringkas PDF] Materi: Algoritma dan pemrograman</p>
                </div>
              </div>

              {/* AI Message */}
              <div className="flex justify-start">
                <div className="bg-[#F3F4F6] text-[#374151] p-3 rounded-lg max-w-[90%] md:max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <img src={aiIcon} alt="HelpAI Icon" className="w-5 h-5" />
                    <span className="text-base font-semibold">helpAi</span>
                  </div>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {displayedText}
                    {index < fullText.length && <span className="animate-pulse">|</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex item-center gap-2">
                <input type="text" placeholder="Tanya helpAi DiSini..." className="w-full py-3 pl-5 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#045394] text-base" />
                <button className="bg-[#045394] rounded-full w-12 h-11 flex justify-center items-center">
                  <img src={sendIcon} alt="Send Icon" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <img src={blueWave} alt="blueWave" className="w-full" />
      </div>
    </>
  );
};
