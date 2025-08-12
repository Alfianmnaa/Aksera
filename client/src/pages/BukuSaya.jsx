import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../config";
import { UserContext } from "../context/UserContext";
import BookCard from "../components/Materi/BookCard";
import BookCardSkeleton from "../components/Materi/BookCardSkeleton";
import donaturSampul from "../assets/BukuSaya/donaturSampul.png";
import komunitasSampul from "../assets/BukuSaya/komunitasSampul.png";
import editProfilButton from "../assets/PermohonanSaya/editProfilButton.png";
import personProfile from "../assets/Navbar/personProfile.png";

export function Profil() {
  const [detilUser, setDetilUser] = useState(null);
  const [activeTab, setActiveTab] = useState("materi");

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      // Pastikan user dan _id ada
      fetchDetilUser();
    }
  }, [user]);

  const fetchDetilUser = async () => {
    try {
      // Asumsi ada endpoint /detil/get/:id untuk detail profil pengguna
      const res = await axiosInstance.get(`/detil/get/${user._id}`);
      setDetilUser(res.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleClick = () => {
    navigate(`/edit-profil`);
  };

  const hasValidProfilePhoto = detilUser?.fotoProfil && typeof detilUser.fotoProfil === "string" && detilUser.fotoProfil.trim() !== "";

  return (
    <>
      <div className="bg-gray-200 rounded-b-[36px] w-full box-border h-fit relative">
        {user?.role === "donatur" ? (
          <img
            src={donaturSampul}
            alt="Donatur Sampul"
            className="object-cover object-[30%_0%] h-56 w-full" // Menambahkan w-full
          />
        ) : (
          <img
            src={komunitasSampul}
            alt="Komunitas Sampul"
            className="object-cover object-[30%_0%] h-56 w-full" // Menambahkan w-full
          />
        )}
      </div>
      <div className="max-w-5xl mx-auto pt-4 px-8 flex md:flex-row flex-col justify-between">
        <div className="flex gap-4 md:gap-8">
          {hasValidProfilePhoto ? (
            <img src={detilUser.fotoProfil} alt="profile" className="w-24 h-24 md:w-36 md:h-36 bg-gray-500 border-4 relative md:-top-16 -top-10 border-white rounded-md object-cover" />
          ) : (
            <img src={personProfile} alt="profile" className="w-24 h-24 md:w-36 md:h-36 bg-gray-500 border-4 relative md:-top-16 -top-10 border-white rounded-md object-cover" />
          )}
          <div>
            {user?.namaLengkap ? (
              <>
                <h1 className="text-lg md:text-2xl font-semibold">{user?.namaLengkap}</h1>
                <p className="text-gray-600">{user?.username}</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">{user?.username}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </>
            )}
          </div>
        </div>
        <button className="border hidden md:block self-end h-fit rounded-full text-sm" onClick={handleClick}>
          <img src={editProfilButton} alt="Edit Profil" className="w-32" />
        </button>
      </div>
    </>
  );
}

// Komponen TabSelector (diambil dari kode Anda)
function TabSelector({ activeTab, setActiveTab }) {
  return (
    <div className="px-6 mt-4 mb-12">
      <div className="flex bg-gray-100 rounded-lg p-1 relative max-w-md">
        <div className={`absolute top-1 bottom-1 transition-transform duration-300 ease-in-out transform ${activeTab === "materi" ? "translate-x-1" : "translate-x-full"} w-[calc(50%-2px)] bg-white rounded-md shadow-md left-[0px]`} />
        <button
          onClick={() => setActiveTab("materi")}
          className={`flex-1 py-2 px-4 rounded-md md:text-sm text-xs font-medium transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
            activeTab === "materi" ? "text-primary transform scale-105" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
          </svg>
          Materi
        </button>
        <button
          onClick={() => setActiveTab("disimpan")}
          className={`flex-1 py-2 px-4 rounded-md md:text-sm text-xs font-medium transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
            activeTab === "disimpan" ? "text-primary transform scale-105" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
          Disimpan
        </button>
      </div>
    </div>
  );
}

// Komponen FilterSection (diambil dari kode Anda)
function FilterSection({ filter, handleFilterChange, itemCount }) {
  return (
    <div className="flex px-6 justify-between items-center mt-4 mb-4 md:mb-8">
      <div className="flex items-center gap-2">
        <label htmlFor="filter" className="text-sm">
          Urutkan:
        </label>
        <select id="filter" value={filter} onChange={handleFilterChange} className="border rounded px-2 py-1 text-sm">
          <option value="Terbaru">Terbaru</option>
          <option value="Terlama">Terlama</option>
        </select>
      </div>
      <div className="font-semibold px-8 text-center">
        Total Materi
        <p className="text-sm">
          <span className="text-blue-700 text-2xl px-1">{itemCount}</span>
        </p>
      </div>
    </div>
  );
}

// Komponen Disimpan (untuk tab "Disimpan")
function Disimpan() {
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  const fetchSavedBooks = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Mengambil materi yang disimpan oleh user
      const { data: savedMateris } = await axiosInstance.get(`/materi/saved/${user._id}`);

      // Karena API /materi/saved sudah mengembalikan objek materi lengkap,
      // kita tidak perlu lagi melakukan Promise.all untuk fetch detail satu per satu.
      // Kita hanya perlu memastikan data yang diterima cocok dengan props BookCard.
      const formattedSavedBooks = savedMateris.map((item) => ({
        _id: item._id,
        judulMateri: item.judulMateri,
        coverMateri: item.coverMateri,
        linkMateri: item.linkMateri,
        kategori: item.kategori,
        penulis: item.penulis,
        penerbit: item.penerbit,
        judulISBN: item.judulISBN,
        edisi: item.edisi,
        statusMateri: item.statusMateri,
        disimpan: item.disimpan, // Pastikan array disimpan ada
        createdAt: item.createdAt,
      }));

      setSavedBooks(formattedSavedBooks);
    } catch (err) {
      console.error("Gagal mengambil daftar materi yang disimpan:", err);
      setError("Gagal mengambil data materi yang disimpan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedBooks();
  }, [fetchSavedBooks]);

  // Callback untuk memperbarui state setelah bookmark di-toggle dari BookCard
  const handleBookmarkToggle = (bookId, isBookmarked) => {
    if (!user) return;
    setSavedBooks((prevBooks) => {
      // Jika buku di-unbookmark, hapus dari daftar
      if (!isBookmarked) {
        return prevBooks.filter((book) => book._id !== bookId);
      }
      // Jika buku di-bookmark (seharusnya tidak terjadi di sini karena ini daftar "disimpan"),
      // Anda mungkin perlu me-refetch atau menambahkannya secara manual
      return prevBooks;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {Array(6)
          .fill(null)
          .map((_, idx) => (
            <BookCardSkeleton key={idx} />
          ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-6">{error}</p>;
  }

  if (savedBooks.length === 0) {
    return <p className="text-gray-600 text-center mt-6">Tidak ada materi yang disimpan.</p>;
  }

  return (
    <div className="mt-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Materi yang Disimpan ({savedBooks.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedBooks.map((book) => (
          <BookCard key={book._id} book={book} onBookmarkToggle={handleBookmarkToggle} />
        ))}
      </div>
    </div>
  );
}

// Komponen utama BukuSaya
export default function BukuSaya() {
  const [uploadedBooks, setUploadedBooks] = useState([]); // Mengganti 'books' menjadi 'uploadedBooks'
  const [filter, setFilter] = useState("Terbaru");
  const [activeTab, setActiveTab] = useState("materi"); // 'buku' untuk materi yang diupload, 'disimpan' untuk materi yang disimpan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useContext(UserContext);

  const fetchUploadedBooks = useCallback(async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Mengambil semua materi dari API
      const res = await axiosInstance.get("/materi/getall");
      const allMateris = res.data || [];

      // Filter materi yang diunggah oleh user saat ini
      const userUploadedMateris = allMateris.filter((materi) => materi.materiUid === user._id);

      // Urutkan berdasarkan filter (Terbaru/Terlama)
      const sortedMateris = userUploadedMateris.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return filter === "Terlama" ? dateA - dateB : dateB - dateA;
      });

      setUploadedBooks(sortedMateris);
    } catch (err) {
      console.error("Gagal mengambil data materi yang diunggah:", err);
      setError("Gagal memuat materi yang Anda unggah. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, [user, filter]);

  useEffect(() => {
    if (activeTab === "materi") {
      fetchUploadedBooks();
    }
  }, [activeTab, fetchUploadedBooks]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <Profil />
      <div className="max-w-5xl mx-auto mb-16">
        {" "}
        {/* Menyesuaikan margin bawah */}
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "materi" ? (
          <>
            <FilterSection filter={filter} handleFilterChange={handleFilterChange} itemCount={uploadedBooks.length} />
            <div className="px-4 sm:px-6 md:px-8">
              {" "}
              {/* Menambahkan padding horizontal */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6)
                    .fill(null)
                    .map((_, idx) => (
                      <BookCardSkeleton key={idx} />
                    ))}
                </div>
              )}
              {error && <p className="text-red-500 text-center mt-6">{error}</p>}
              {!loading && uploadedBooks.length === 0 && !error && <p className="text-gray-600 text-center mt-6">Tidak ada materi yang Anda unggah.</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <Disimpan />
        )}
      </div>
    </>
  );
}
