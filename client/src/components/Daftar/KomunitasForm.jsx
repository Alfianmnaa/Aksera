import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import PanduanSuratPopUp from "./PanduanSuratPopUp";

export default function KomunitasForm({ formData, handleInputChange, showPassword, setShowPassword }) {
  const [showPanduan, setShowPanduan] = useState(false);
  return (
    <>
      {/* Nama Komunitas */}
      <div>
        <label htmlFor="namaKomunitas" className="text-gray-700 text-sm font-medium">
          Nama komunitas
        </label>
        <input
          id="namaLengkap"
          type="text"
          placeholder="Masukkan nama komunitas anda"
          value={formData.namaLengkap}
          onChange={(e) => handleInputChange("namaLengkap", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="text-gray-700 text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Masukkan username anda"
          value={formData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="text-gray-700 text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Masukkan email anda"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="text-gray-700 text-sm font-medium">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 text-sm hover:text-gray-700 flex items-center gap-1"
          >
            {showPassword ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show
              </>
            )}
          </button>
        </div>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan password anda"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Link Surat Permohonan */}
      <div>
        <label htmlFor="pernyataanUrl" className="text-gray-700 text-sm font-medium">
          Link Surat Permohonan
        </label>
        <div className="mt-1 relative">
          <input
            id="pernyataanUrl"
            type="url"
            placeholder="Contoh: https://drive.google.com/d...file"
            value={formData.pernyataanUrl}
            onChange={(e) => handleInputChange("pernyataanUrl", e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pr-24"
          />
          <div className="w-full flex justify-end mt-1">
            <button
              type="button"
              onClick={() => setShowPanduan(true)}
              className="text-blue-600 text-xs hover:text-blue-700 underline"
            >
              Panduan Surat
            </button>
          </div>
        </div>
        {showPanduan && <PanduanSuratPopUp onClose={() => setShowPanduan(false)} />}
      </div>
    </>
  );
}
