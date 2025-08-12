// App.js
import React from "react";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ComingSoon />
    </div>
  );
}

function ComingSoon() {
  const primaryColor = "#045394"; // Warna utama sesuai permintaan

  return (
    <div
      className="max-w-xl mx-auto p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center animate-fade-in relative overflow-hidden" // Added relative and overflow-hidden for animation
      style={{ backgroundColor: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.9)` }}
    >
      {/* Background animated shapes for modern feel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-48 h-48 bg-white opacity-10 rounded-full animate-pulse-slow -top-12 -left-12"></div>
        <div className="absolute w-32 h-32 bg-white opacity-10 rounded-full animate-pulse-slow delay-500 top-24 -right-8"></div>
        <div className="absolute w-60 h-60 bg-white opacity-10 rounded-full animate-pulse-slow delay-1000 -bottom-24 left-1/3 transform -translate-x-1/2"></div>
      </div>

      {/* Icon atau logo bisa ditambahkan di sini */}
      <svg
        className="w-24 h-24 mb-6 text-white relative z-10" // Added relative z-10 to bring content to front
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>

      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight relative z-10">Segera Hadir!</h1>
      <p className="text-lg md:text-xl text-white opacity-90 mb-8 max-w-md relative z-10">Kami sedang bekerja keras untuk memberikan sesuatu yang luar biasa. Nantikan pembaruan selanjutnya!</p>

      {/* Optional: Social media links or copyright */}
      <div className="mt-10 text-white text-sm opacity-80 relative z-10">&copy; {new Date().getFullYear()} Aksera. Hak Cipta Dilindungi.</div>
    </div>
  );
}

export default App;
