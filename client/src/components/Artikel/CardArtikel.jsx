import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Share2, Copy, Facebook, Twitter, MessageCircle } from "lucide-react";

export default function CardArtikel({ id, title, description, imageSrc, date, username, avatarSrc, handleClick }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const isLongText = description?.length > 100;
  const displayText = isLongText ? description.slice(0, 100) + "..." : description;

  const handleShare = async (platform) => {
    const url = window.location.href + "/" + id;
    const text = title;

    switch (platform) {
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error("Failed to copy: ", err);
        }
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div onClick={handleClick} className="w-full max-w-sm bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img src={imageSrc || ""} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Share Button */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              className="bg-white/90 hover:bg-white shadow-sm p-2 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
            >
              <Share2 className="w-4 h-4" />
            </button>

            {showShareMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 min-w-[160px]">
                <div className="flex flex-col space-y-1">
                  <button
                    className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare("copy");
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copySuccess ? "Tersalin!" : "Salin Link"}
                  </button>
                  <button
                    className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare("facebook");
                    }}
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </button>
                  <button
                    className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare("twitter");
                    }}
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </button>
                  <button
                    className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare("whatsapp");
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Organization and Date */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <img src={avatarSrc || "https://via.placeholder.com/40"} alt="author" className="w-6 h-6 rounded-full object-cover mr-2" />
            <span className="text-sm text-gray-600">{username}</span>
          </div>
          <span className="text-sm text-gray-400 ml-auto">{date}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">{title}</h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{displayText}</p>

        {/* Read More Link */}
        <div className="flex justify-end">
          <Link to={`/artikel/detail-artikel/${id}`} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1">
            Baca selengkapnya
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
