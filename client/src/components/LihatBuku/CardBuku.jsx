import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import shareIcon from "../../assets/CardBuku/share.png";
import personProfile from "../../assets/Navbar/personProfile.png";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config";

export default function CardBuku({
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
  cardType = "buku",
}) {
  const { user } = useContext(UserContext);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user?._id) {
      axiosInstance.get(`/buku/get/${id}`).then((res) => {
        const buku = res.data;
        setIsSaved(buku.disimpan?.includes(user._id));
      });
    }
  }, [id, user?._id]);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user?._id) return alert("Login terlebih dahulu");

    try {
      await axiosInstance.put(`/buku/toggle-simpan/${id}`, {
        userId: user._id,
      });
      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error("Gagal simpan buku:", error);
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
      className="rounded-[28px] shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)] border-1 p-4 w-full max-w-xs bg-white flex flex-col cursor-pointer hover:shadow-[0px_0px_10px_2px_rgba(0,0,0,0.15)] transition"
      key={id}
    >
      {status === "tersedia" ? (
        <span className="bg-[#FDE4C5] text-[#F79319] border-green-950 w-fit self-end mb-2 -mt-2 text-xs font-semibold px-3 py-1 rounded-full">
          Tersedia
        </span>
      ) : (
        status === "disalurkan" && (
          <span className="bg-gray-300 text-gray-600 w-fit self-end mb-2 -mt-2 text-xs font-semibold px-3 py-1 rounded-full">
            Disalurkan
          </span>
        )
      )}
      <div className="h-36 bg-gray-200 rounded-xl mb-4 overflow-hidden">
        <img src={imageSrc} alt="buku" className="object-cover w-full" /> :
      </div>
      <div className="flex flex-col flex-1">
        <div
          className={`flex justify-between ${
            cardType === "artikel" ? "flex-col" : ""
          }`}
        >
          <div className="font-extrabold">{title}</div>
          <div className="text-xs text-gray-400 mt-1 self-end">{date}</div>
        </div>
        <div className="text-xs text-gray-500">
          Barang {jenisBarang == "bekas" ? "layak pakai" : jenisBarang}
        </div>
        <p className="text-sm text-gray-700 mt-2">
          {displayText}
          {isLongText && (
            <span className="text-blue-500 ml-1">(Baca Selengkapnya)</span>
          )}
        </p>
      </div>
      <div className="flex gap-2 items-center justify-between mt-4">
        <div className="flex gap-2 items-center">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="author"
              className="aspect-[1/1] w-8 h-8 rounded-full object-cover mr-2"
            />
          ) : (
            <img
              src={personProfile}
              alt="profile"
              className="p-2 bg-gray-500 bg-opacity-75  h-10 rounded-full object-cover"
            />
          )}
          <div>
            <div className="text-sm font-medium">{author}</div>
            <div className="text-xs text-gray-500">{location}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cardType === "buku" && (
            <button
              onClick={handleSave}
              className=" w-5 h-5 rounded-full hover:bg-gray-100"
              aria-label="Simpan"
            >
              {isSaved ? (
                <BsBookmarkFill className="w-5 h-5 text-primary" />
              ) : (
                <BsBookmark className="w-5 h-5 text-gray-500" />
              )}
            </button>
          )}

          <button
            onClick={handleShare}
            className=" w-5 h-5 rounded-full hover:bg-gray-100"
            aria-label="Bagikan"
          >
            <img
              src={shareIcon}
              alt="Bagikan"
              className="w-5 h-5 object-contain"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
