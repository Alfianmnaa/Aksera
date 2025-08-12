import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import shareIcon from "../../assets/CardDonasi/share.png";
import personProfile from "../../assets/Navbar/personProfile.png";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config";

export default function CardDonasi({
  id,
  title,
  kategoriBarang,
  jenisBarang,
  status,
  date,
  description,
  author,
  location,
  imageSrc,
  avatarSrc,
  handleClick,
  cardType = "donasi",
}) {
  const { user } = useContext(UserContext);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user?._id) {
      axiosInstance.get(`/donasi/get/${id}`).then((res) => {
        const donasi = res.data;
        setIsSaved(donasi.disimpan?.includes(user._id));
      });
    }
  }, [id, user?._id]);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user?._id) return alert("Login terlebih dahulu");

    try {
      await axiosInstance.put(`/donasi/toggle-simpan/${id}`, {
        userId: user._id,
      });
      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error("Gagal simpan donasi:", error);
    }
  };

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

  const isLongText = description?.length > 100;
  const displayText = isLongText
    ? description.slice(0, 100) + "..."
    : description;
  return (
    <div
      onClick={handleClick}
      className="w-[290px] bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 flex flex-col cursor-pointer overflow-hidden relative"
      key={id}
    >
      {/* Gambar */}
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img src={imageSrc} alt="donasi" className="w-full h-full object-cover" />
        </div>
        
        {/* Badge Status - Pojok Kiri Atas */}
        {status === "tersedia" ? (
          <div className="absolute top-3 left-3">
            <span className="bg-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              Tersedia
            </span>
          </div>
        ) : (
          status === "disalurkan" && (
            <div className="absolute top-3 left-3">
              <span className="bg-gray-300 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                Disalurkan
              </span>
            </div>
          )
        )}

        {/* Share & Save Buttons - Pojok Kanan Atas */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {cardType === "donasi" && (
            <button
              onClick={handleSave}
              className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
              aria-label="Simpan"
            >
              {isSaved ? (
                <BsBookmarkFill className="w-4 h-4 text-[#045394]" />
              ) : (
                <BsBookmark className="w-4 h-4 text-gray-600 hover:text-[#045394]" />
              )}
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
            aria-label="Bagikan"
          >
            <img
              src={shareIcon}
              alt="Bagikan"
              className="w-4 h-4 object-contain"
            />
          </button>
        </div>
      </div>

      {/* Konten */}
      <div className="p-4 flex flex-col justify-between flex-grow text-sm relative">
        {/* Title */}
        <div className="mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{title}</h3>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 flex-grow">
          {displayText}
          {isLongText && (
            <span className="text-blue-500 ml-1 cursor-pointer hover:underline">
              (Baca Selengkapnya)
            </span>
          )}
        </p>
        
        {/* Garis Pembatas */}
        <div className="w-full h-px bg-gray-200 mb-3"></div>
        
        {/* Bottom Section */}
        <div className="flex place-items-center">
          {/* Profile, Name & Location - Pojok Kiri Bawah (2/3 width) */}
          <div className="flex-[2] flex items-center gap-2">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="author"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <img
                src={personProfile}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover bg-gray-200 flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{author}</p>
              <p className="text-xs text-gray-500 break-words leading-relaxed">{location}</p>
            </div>
          </div>
          
          {/* Jenis Barang & Tanggal - Pojok Kanan Bawah (1/3 width) */}
          <div className="flex-[1] flex flex-col text-right items-end">
            <p className="text-xs text-gray-600 mb-1 bg-gray-100 w-fit py-1 px-2 rounded-full">
              {jenisBarang === "bekas" ? "Layak pakai" : jenisBarang}
            </p>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
