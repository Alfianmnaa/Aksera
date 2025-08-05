import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function InputField({ label, id, type = "text", placeholder, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col">
      <label className="font-medium md:text-body-lg text-normal" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          required
          type={isPassword && showPassword ? "text" : type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="md:text-normal text-[15px] rounded-lg border-2 border-grey-600 focus:outline-none p-3 mt-2 w-full pr-10"
        />
        {isPassword && (
          <span className="absolute right-4 top-[58%] transform -translate-y-1/2 text-gray-500 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );
}
