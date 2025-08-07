import React from 'react';
import { BookOpen } from "lucide-react";

export default function HeaderDaftar() {
  return (
    <div>
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
      </div>
      
      {/* Header Text */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Yuk <span className="text-primary">Daftar!</span>
        </h1>
        <p className="text-gray-600 mt-2 mb-8">
          <span className="text-primary">Daftar</span> untuk bergabung bersama kami
        </p>
      </div>
    </div>
  );
}
