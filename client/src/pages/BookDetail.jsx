import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../config";
import BookCardSkeleton from "../components/UmmahBook/BookCardSkeleton";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2"; // Import SweetAlert2

function BookDetail() {
  const { user } = useContext(UserContext); // Menggunakan user dari context
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
    // Konfirmasi penghapusan dengan SweetAlert2
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan bisa mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true); // Set loading saat proses penghapusan
          await axiosInstance.delete(`/materi/delete/${id}`);

          // Tampilkan pesan sukses dengan SweetAlert2
          Swal.fire("Dihapus!", "Postingan Anda telah dihapus.", "success").then(() => {
            navigate("/ummah-book"); // Redirect setelah SweetAlert ditutup
          });
        } catch (err) {
          console.error("Gagal menghapus postingan:", err);
          // Tampilkan pesan error dengan SweetAlert2
          Swal.fire("Gagal!", "Gagal menghapus postingan. Silakan coba lagi.", "error");
          setError("Gagal menghapus postingan. Silakan coba lagi.");
          setLoading(false); // Matikan loading jika gagal
        }
      }
    });
  };

  const downloadFile = async (url, fileName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobURL = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl w-full bg-white rounded-2xl p-8 shadow-lg">
          <BookCardSkeleton />
          <BookCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <Link to="/ummah-book" className="text-teal-600 hover:underline mt-4 inline-block px-4 py-2 border border-teal-600 rounded-md transition-colors hover:bg-teal-50">
          Kembali ke Daftar Buku
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Buku Tidak Ditemukan</h2>
        <Link to="/ummah-book" className="text-teal-600 hover:underline mt-4 inline-block px-4 py-2 border border-teal-600 rounded-md transition-colors hover:bg-teal-50">
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

  // Menggunakan user._id dari UserContext untuk perbandingan
  const isOwner = user && book.materiUid === user._id;

  return (
    <main className="bg-white py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/ummah-book" className="hover:underline text-orange-500">
            Ummah Book
          </Link>
          <span className="mx-2">&gt;</span>
          <span>{book.judulMateri}</span>
        </div>

        <div className="bg-[#E6F6F6] rounded-2xl p-5 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex justify-center items-start">
              <img src={book.coverMateri || "https://placehold.co/200x280/cccccc/333333?text=No+Cover"} alt={book.judulMateri} className="w-full max-w-xs h-auto object-cover rounded-lg shadow-lg" />
            </div>

            <div className="md:col-span-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{book.judulMateri}</h1>
              {book.penulis && <p className="text-lg text-gray-700 mb-4">Oleh: {book.penulis}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-4 mb-8">
                {book.linkMateri && (
                  <>
                    <a onClick={() => downloadFile(book.linkMateri, book.judulMateri)} className="cursor-pointer inline-flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Unduh PDF
                    </a>
                    <a
                      href={book.linkMateri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-white text-teal-600 border border-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Baca Online
                    </a>
                  </>
                )}
                {isOwner && (
                  <button onClick={handleDelete} className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus Postingan
                  </button>
                )}
              </div>

              <h2 className="text-lg font-bold text-gray-700 border-b pb-2 mb-4">DETAIL BUKU</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-500">Kategori</h3>
                  <p className="text-gray-800 mt-1">{book.kategori || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Penerbit</h3>
                  <p className="text-gray-800 mt-1">{book.penerbit || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">ISBN</h3>
                  <p className="text-gray-800 mt-1">{book.judulISBN || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Edisi</h3>
                  <p className="text-gray-800 mt-1">{book.edisi || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Tanggal Unggah</h3>
                  <p className="text-gray-800 mt-1">{formattedDate}</p>
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
