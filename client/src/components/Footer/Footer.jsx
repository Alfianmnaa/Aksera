import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter, // Pastikan ini diimpor jika ingin digunakan
  FaYoutube,
} from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import akseraLogo from "../../assets/Navbar/logo_biru.png"; // Sesuaikan path jika berbeda
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext"; // Sesuaikan path jika berbeda

export default function Footer() {
  const { user } = useContext(UserContext);

  return (
    // Bagian footer utama dengan warna latar belakang baru dan padding yang disesuaikan
    <footer className="bg-[#13084F] text-gray-300 text-body-sm mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
        {/* Kolom 1: Logo, Deskripsi Singkat, dan Media Sosial */}
        <div className="flex flex-col gap-6">
          <img
            src={akseraLogo}
            className="w-40 -translate-y-2 -translate-x-2" // Ukuran logo sedikit lebih besar
            alt="aksera  Logo"
          />
          <p className="text-body-sm leading-relaxed">Membuka akses belajar merata dengan edukasi dan donasi.</p>
          {/* Ikon Media Sosial */}
          <div className="flex gap-4 mt-2">
            <FaFacebook size={24} className="text-white cursor-pointer hover:text-blue-400 transition-colors duration-300" />
            <FaInstagram size={24} className="text-white cursor-pointer hover:text-pink-400 transition-colors duration-300" />
            <FaWhatsapp size={24} className="text-white cursor-pointer hover:text-green-400 transition-colors duration-300" />
            <FaXTwitter size={24} className="text-white cursor-pointer hover:text-gray-400 transition-colors duration-300" /> {/* Menambahkan X/Twitter */}
            <FaYoutube size={24} className="text-white cursor-pointer hover:text-red-400 transition-colors duration-300" />
          </div>
        </div>

        {/* Kolom 2: Tautan Utama aksera  */}
        <div className="flex flex-col gap-6">
          <span className="text-white font-semibold text-lg mb-2">Aksera</span>
          <div className="flex flex-col gap-3">
            <Link to={"/"} className="hover:underline hover:text-white transition-colors duration-200">
              Beranda
            </Link>
            {/* Logika upload donasi disederhanakan */}
            <Link to={"/upload-donasi"} className="hover:underline hover:text-white transition-colors duration-200">
              Upload Donasi
            </Link>
            <Link to={"/lihat-donasi"} className="hover:underline hover:text-white transition-colors duration-200">
              Lihat Donasi
            </Link>
            <Link to={"/artikel"} className="hover:underline hover:text-white transition-colors duration-200">
              Artikel
            </Link>
          </div>
        </div>

        {/* Kolom 3: Halaman Eksplorasi Baru */}
        <div className="flex flex-col gap-6">
          <span className="text-white font-semibold text-lg mb-2">Eksplorasi</span>
          <div className="flex flex-col gap-3">
            <Link to={"/materi"} className="hover:underline hover:text-white transition-colors duration-200">
              Materi
            </Link>
            <Link to={"/sera-ai"} className="hover:underline hover:text-white transition-colors duration-200">
              Sera AI
            </Link>
            <Link to={"/forum"} className="hover:underline hover:text-white transition-colors duration-200">
              Forum
            </Link>
            <Link to={"/leaderboard"} className="hover:underline hover:text-white transition-colors duration-200">
              Leaderboard
            </Link>
          </div>
        </div>

        {/* Kolom 4: Hubungi Kami */}
        <div className="flex flex-col gap-6">
          <span className="text-white font-semibold text-lg mb-2">Hubungi Kami</span>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-white text-lg" />
              <a href="http://wa.me/6281326022762" className="hover:underline hover:text-white transition-colors duration-200">
                +62 813-2602-2762
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MdEmail className="text-white text-lg" />
              <span>contact@aksera.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Garis pembatas */}
      <div className="border-t border-gray-700 mx-auto max-w-7xl"></div>

      {/* Copyright */}
      <div className="text-center py-8 text-body-xs text-gray-500">Copyright © 2025 Aksera. All rights reserved.</div>
    </footer>
  );
}
