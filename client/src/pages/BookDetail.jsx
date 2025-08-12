import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../config"; // Ensure this path is correct
import BookCardSkeleton from "../components/Materi/BookCardSkeleton"; // Ensure this path is correct
import { UserContext } from "../context/UserContext"; // Ensure this path is correct
import Swal from "sweetalert2"; // Import SweetAlert2

function BookDetail() {
  const { user } = useContext(UserContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/materi/get/${id}`);
        setBook(response.data);
      } catch (err) {
        console.error("Gagal mengambil detail buku:", err);
        if (err.response && err.response.status === 404) {
          setError("Buku tidak ditemukan.");
        } else {
          setError("Terjadi kesalahan saat memuat detail buku.");
        }
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    } else {
      setLoading(false);
      setError("ID buku tidak valid.");
    }
  }, [id]);

  const handleDelete = async () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan bisa mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#045394", // Use primary color for confirm
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await axiosInstance.delete(`/materi/delete/${id}`);

          Swal.fire("Dihapus!", "Postingan Anda telah dihapus.", "success").then(() => {
            navigate("/edukasi/materi");
          });
        } catch (err) {
          console.error("Gagal menghapus postingan:", err);
          Swal.fire("Gagal!", "Gagal menghapus postingan. Silakan coba lagi.", "error");
          setError("Gagal menghapus postingan. Silakan coba lagi.");
          setLoading(false);
        }
      }
    });
  };

  const downloadFile = async (url, fileName) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok.");
      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobURL); // Clean up the URL object
    } catch (err) {
      console.error("Gagal mengunduh file:", err);
      Swal.fire("Error", "Gagal mengunduh file. Silakan coba lagi.", "error");
    }
  };

  const formattedDate = book?.createdAt
    ? new Date(book.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl w-full bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <BookCardSkeleton />
          <BookCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <Link to="/edukasi/materi" className="text-[#045394] hover:underline mt-4 inline-block px-6 py-3 border border-[#045394] rounded-lg transition-colors hover:bg-[#045394] hover:text-white font-medium">
          Kembali ke Daftar Buku
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Buku Tidak Ditemukan</h2>
        <Link to="/edukasi/materi" className="text-[#045394] hover:underline mt-4 inline-block px-6 py-3 border border-[#045394] rounded-lg transition-colors hover:bg-[#045394] hover:text-white font-medium">
          Kembali ke Daftar Buku
        </Link>
      </div>
    );
  }

  const getFileNameFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");
      return pathSegments[pathSegments.length - 1];
    } catch (e) {
      console.error("Invalid URL for file name:", url, e);
      return "materi.pdf";
    }
  };

  const fileName = book.linkMateri ? getFileNameFromUrl(book.linkMateri) : "materi.pdf";
  const isOwner = user && book.materiUid === user._id;

  return (
    <main className="bg-gray-50 py-10 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm">
          <Link to="/edukasi/materi" className="text-gray-600 hover:text-[#045394] hover:underline transition-colors">
            Materi
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-800 font-semibold">{book.judulMateri}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Book Cover */}
            <div className="md:col-span-1 flex justify-center items-start">
              <img src={book.coverMateri || "https://placehold.co/250x350/E0E7FF/045394?text=No+Cover"} alt={book.judulMateri} className="w-full max-w-[250px] md:max-w-xs h-auto object-cover rounded-xl shadow-md border border-gray-200" />
            </div>

            {/* Book Details and Actions */}
            <div className="md:col-span-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[#045394] leading-tight mb-2">{book.judulMateri}</h1>
              {book.penulis && <p className="md:text-lg text-md text-gray-700 font-medium mb-6">Oleh: {book.penulis}</p>}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-4 mb-10">
                {book.linkMateri && (
                  <>
                    <button
                      onClick={() => downloadFile(book.linkMateri, fileName)}
                      className="inline-flex items-center bg-[#045394] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Unduh Materi
                    </button>
                    <a
                      href={book.linkMateri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-white text-[#045394] border border-[#045394] px-6 py-3 rounded-lg font-semibold hover:bg-[#045394] hover:text-white transition-all shadow-md active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Baca Online
                    </a>
                  </>
                )}
                {isOwner && (
                  <button onClick={handleDelete} className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus Postingan
                  </button>
                )}
              </div>

              {/* Detail Section */}
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mb-6">DETAIL BUKU</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-base">
                <div>
                  <h3 className="font-semibold text-gray-500 mb-1">Kategori</h3>
                  <p className="text-gray-800">{book.kategori || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 mb-1">Penerbit</h3>
                  <p className="text-gray-800">{book.penerbit || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 mb-1">ISBN</h3>
                  <p className="text-gray-800">{book.judulISBN || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 mb-1">Edisi</h3>
                  <p className="text-gray-800">{book.edisi || "-"}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  {" "}
                  {/* Make it full width on small screens */}
                  <h3 className="font-semibold text-gray-500 mb-1">Tanggal Unggah</h3>
                  <p className="text-gray-800">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BookDetail;
