import React from 'react';
import { Eye, EyeOff } from "lucide-react";

export default function DonaturForm({ formData, handleInputChange, showPassword, setShowPassword }) {
  return (
    <>
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
    </>
  );
}
