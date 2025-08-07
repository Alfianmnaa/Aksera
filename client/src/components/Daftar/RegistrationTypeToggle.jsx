import React from 'react';

export default function RegistrationTypeToggle({ selectedType, setSelectedType }) {
  return (
    <div className="mb-6">
      <p className="text-gray-700 text-center text-sm mb-3">Pilih daftar sebagai:</p>
      <div className="flex bg-gray-100 rounded-lg p-1 relative">
        <div
          className={`absolute top-1 bottom-1 transition-transform duration-300 ease-in-out transform ${
            selectedType === "donatur" ? "translate-x-1" : "translate-x-full"
          } w-[calc(50%-2px)] bg-white rounded-md shadow-md left-[0px]`}
        />
        <button
          onClick={() => setSelectedType("donatur")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 relative z-10 ${
            selectedType === "donatur" 
              ? "text-primary transform scale-105" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Individu
        </button>
        <button
          onClick={() => setSelectedType("komunitas")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 relative z-10 ${
            selectedType === "komunitas" 
              ? "text-primary transform scale-105" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Komunitas
        </button>
      </div>
    </div>
  );
}
