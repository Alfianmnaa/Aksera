import React from "react";
import { useLocation } from "react-router-dom";
import shareIcon from "../../assets/CardDonasi/share.png"; // Sesuaikan path jika beda
import { FaCheckCircle } from "react-icons/fa"; // Tambahkan ini untuk icon verified

export default function CardArtikel({ id, title, description, imageSrc, author, date, username, avatarSrc, handleClick }) {
  const isLongText = description?.length > 100;
  const displayText = isLongText ? description.slice(0, 100) + "..." : description;

  const handleShare = (e) => {
    e.stopPropagation();

    const baseUrl = window.location.href;
    const urlToShare = `${baseUrl}/${id}`;
    if (navigator.share) {
      navigator
        .share({
          url: urlToShare,
        })

        .catch((error) => console.error("Error berbagi:", error));
    } else {
      alert("Fungsi share tidak didukung di browser ini.");
    }
  };

  return (
    <div onClick={handleClick} className="rounded-[28px] shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)] border-1 p-4 w-full max-w-xs bg-white flex flex-col cursor-pointer hover:shadow-[0px_0px_10px_2px_rgba(0,0,0,0.15)] transition">
      <div className="h-36 bg-gray-200 rounded-xl mb-4 overflow-hidden">
        <img src={imageSrc || ""} alt="artikel" className="object-cover w-full h-full" />
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex justify-between">
          <div className="font-extrabold text-base">{title}</div>
        </div>
        <div className="text-xs text-gray-400 mt-1 self-end">{date}</div>

        <p className="text-sm text-gray-700 mt-2">
          {displayText}
          {isLongText && <span className="text-primary-light ml-2">(Baca Selengkapnya)</span>}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <img src={avatarSrc || "https://via.placeholder.com/40"} alt="author" className="w-8 h-8 rounded-full object-cover mr-2" />

          <div className="text-xs text-gray-500">{username}</div>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleShare} className="p-1 rounded-full hover:bg-gray-100" aria-label="Bagikan">
            <img src={shareIcon} alt="Bagikan" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
