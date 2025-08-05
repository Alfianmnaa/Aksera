import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import setarainLogo2 from "../../assets/Navbar/lenteraumat.svg";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export default function Footer() {
  const { user } = useContext(UserContext);
  return (
    <footer className="bg-primary-dark text-grey-500 text-body-sm mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        <div className="flex flex-col gap-10">
          <img
            src={setarainLogo2}
            className="w-36 -translate-y-4 -translate-x-2"
            alt=""
          />
          {/* Social Media */}
          <div className="flex flex-col gap-2">
            <span className="text-white font-semibold text-body-sm mb-2">
              SOCIAL MEDIA
            </span>
            <div className="flex gap-4">
              <FaFacebook size={24} className="text-white cursor-pointer" />
              <FaInstagram size={24} className="text-white cursor-pointer" />
              <FaWhatsapp size={24} className="text-white cursor-pointer" />
              <FaYoutube size={24} className="text-white cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Hubungi Kami */}
        <div className="flex flex-col gap-6">
          <span className="text-white font-semibold text-body-sm">
            HUBUNGI KAMI
          </span>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-white" />
              <a href="http://wa.me/6281326022762">
                {" "}
                <span>+62 813-2602-2762</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MdEmail className="text-white" />
              <span>contact@LenteraUmat.com</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-6">
          <span className="text-white font-semibold text-body-sm">
            Lentera Umat
          </span>
          <div className="flex flex-col gap-2">
            <Link to={"/"} className="hover:underline">
              Beranda
            </Link>
            {user?.role == "donatur" ? (
              <Link to={"/upload-donasi"} className="hover:underline">
                Upload Donasi
              </Link>
            ) : (
              <Link to={"/upload-donasi"} className="hover:underline">
                Upload Donasi
              </Link>
            )}
            <Link to={"/lihat-donasi"} className="hover:underline">
              Lihat Donasi
            </Link>
            <Link to={"/artikel"} className="hover:underline">
              Artikel
            </Link>
          </div>
        </div>
      </div>

      {/* Garis pembatas */}
      <div className="border-t border-gray-700 mx-4"></div>

      {/* Copyright */}
      <div className="text-center py-6 text-body-xs text-grey-500">
        Copyright © 2025 Lentera Umat. All rights reserved.
      </div>
    </footer>
  );
}
