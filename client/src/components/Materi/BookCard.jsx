import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { LuShare2 } from "react-icons/lu"; // Menggunakan ikon share dari Lucide React
import { UserContext } from "../../context/UserContext"; // Pastikan path ini benar
import { axiosInstance } from "../../config"; // Pastikan path ini benar
import Swal from "sweetalert2"; // Untuk notifikasi error saja

// Konfigurasi Swal.mixin untuk toast alert (untuk error/peringatan)
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

function BookCard({ book, onBookmarkToggle }) {
  const { user } = useContext(UserContext);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user && book && book.disimpan && book.disimpan.includes(user._id)) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [user, book]);

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      Toast.fire({
        icon: "warning",
        title: "Anda harus login untuk menyimpan materi.",
      });
      return;
    }
    try {
      const response = await axiosInstance.post(`/materi/toggle-simpan/${book._id}`, { userId: user._id });
      const newBookmarkStatus = response.data.disimpan.includes(user._id);
      setIsBookmarked(newBookmarkStatus);
      if (onBookmarkToggle) {
        onBookmarkToggle(book._id, newBookmarkStatus);
      }
      Toast.fire({
        icon: "success",
        title: newBookmarkStatus ? "Materi disimpan!" : "Materi dihapus dari simpanan.",
      });
    } catch (error) {
      console.error("Gagal toggle simpan materi:", error);
      Toast.fire({
        icon: "error",
        title: "Terjadi kesalahan saat menyimpan materi.",
      });
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/book/${book._id}`;

    if (navigator.share) {
      navigator
        .share({
          title: book.judulMateri,
          text: `Lihat materi ini di UmmahBook: ${book.judulMateri} oleh ${book.penulis}`,
          url: shareUrl,
        })
        .then(() => console.log("Berhasil berbagi"))
        .catch((error) => console.error("Gagal berbagi:", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      Toast.fire({
        icon: "success",
        title: "Link buku telah disalin ke clipboard.",
      });
    }
  };

  return (
    <Link to={`/book/${book._id}`} className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col no-underline transform hover:-translate-y-1">
      <div className="flex-shrink-0 relative">
        <img
          className="h-64 w-full object-cover rounded-t-xl"
          src={book.coverMateri || `https://placehold.co/400x560/e2e8f0/64748b?text=No+Cover`}
          alt={book.judulMateri}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x560/e2e8f0/64748b?text=No+Cover`;
          }}
        />
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={handleToggleBookmark}
            className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#045394]"
            aria-label={isBookmarked ? "Hapus dari simpanan" : "Simpan materi"}
          >
            {isBookmarked ? <BsBookmarkFill className="text-[#045394] w-5 h-5" /> : <BsBookmark className="text-gray-600 w-5 h-5" />}
          </button>
          <button onClick={handleShare} className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#045394]" aria-label="Bagikan materi">
            <LuShare2 className="text-gray-600 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-block bg-[#045394] text-white text-xs font-semibold px-3 py-1 rounded-full">{book.linkMateri?.endsWith(".pdf") ? "PDF" : "File"}</span>
          <span className="inline-block bg-blue-100 text-[#045394] text-xs font-semibold px-3 py-1 rounded-full">{book.kategori || "Umum"}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 flex-grow mb-1 leading-tight">{book.judulMateri}</h3>
        <p className="text-sm text-gray-600 font-medium">Oleh: {book.penulis || "Tidak Diketahui"}</p>
      </div>
    </Link>
  );
}

export default BookCard;
