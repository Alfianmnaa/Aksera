import { useState, useEffect, useCallback, useContext } from "react";
import BookCard from "../components/UmmahBook/BookCard"; // Pastikan path ini benar
import UploadBookForm from "../components/UmmahBook/UploadBookForm"; // Pastikan path ini benar
import BookCardSkeleton from "../components/UmmahBook/BookCardSkeleton"; // Pastikan path ini benar
import { axiosInstance } from "../config"; // Pastikan path ini benar
import { FaChevronDown } from "react-icons/fa"; // Untuk ikon dropdown
import { UserContext } from "../context/UserContext";

// Komponen Pagination
const Pagination = ({ totalPages, paginate, currentPage }) => {
  if (totalPages <= 1) return null;
  const maxPageButtons = 5;
  const pageNumbers = [];

  // Logika untuk menampilkan tombol halaman di sekitar halaman saat ini
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav
      className="inline-flex items-center rounded-md shadow mt-8"
      style={{
        border: "1px solid #d1d5db",
        borderRadius: "0.375rem",
        overflow: "hidden",
      }}
    >
      <a
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) paginate(currentPage - 1);
        }}
        href="#"
        className={`px-3 py-2 text-sm font-bold border-r border-gray-300 ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-800 hover:bg-gray-50"}`}
      >
        &lt;
      </a>

      {pageNumbers.map((number) => (
        <a
          key={number}
          onClick={(e) => {
            e.preventDefault();
            paginate(number);
          }}
          href="#"
          className={`px-4 py-2 text-sm font-bold border-r border-gray-300 ${currentPage === number ? "bg-orange-500 text-white z-10" : "bg-white text-gray-800 hover:bg-gray-50"}`}
        >
          {number}
        </a>
      ))}

      {/* Tombol halaman terakhir jika ada lebih dari maxPageButtons dan halaman terakhir tidak terlihat */}
      {endPage < totalPages && (
        <>
          <span className="px-4 py-2 text-sm font-bold border-r border-gray-300 bg-white text-gray-800">...</span>
          <a
            onClick={(e) => {
              e.preventDefault();
              paginate(totalPages);
            }}
            href="#"
            className={`px-4 py-2 text-sm font-bold border-r border-gray-300 ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-800 hover:bg-gray-50"}`}
          >
            {totalPages}
          </a>
        </>
      )}

      <a
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) paginate(currentPage + 1);
        }}
        href="#"
        className={`px-3 py-2 text-sm font-bold ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-800 hover:bg-gray-50"}`}
      >
        &gt;
      </a>
    </nav>
  );
};

function UmmahBook() {
  const { user } = useContext(UserContext);
  const [allBooks, setAllBooks] = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 9;
  const [totalPages, setTotalPages] = useState(0);
  const [dropdowns, setDropdowns] = useState({
    category: false,
  });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory === "Semua" ? "" : selectedCategory;
      const response = await axiosInstance.get("/materi/getall", {
        params: {
          judul: searchTerm,
          kategori: categoryParam,
          statusMateri: "terverifikasi",
        },
      });
      setAllBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    setCurrentBooks(allBooks.slice(indexOfFirstBook, indexOfLastBook));
    setTotalPages(Math.ceil(allBooks.length / booksPerPage));
  }, [allBooks, currentPage, booksPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUploadSuccess = (newBook) => {};

  const handleBookmarkToggle = (bookId, isBookmarked) => {
    if (!user) return;
    setAllBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId
          ? {
              ...book,
              disimpan: isBookmarked ? [...(book.disimpan || []), user._id] : (book.disimpan || []).filter((id) => id !== user._id),
            }
          : book
      )
    );
  };

  const toggleDropdown = (name) => {
    setDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const selectCategoryOption = (value) => {
    setSelectedCategory(value);
    setDropdowns({ ...dropdowns, category: false });
  };

  const categories = ["Semua", "SD/MI", "SMP/MTs", "SMA/MA", "Umum"];

  return (
    <>
      <main className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Search and Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center w-full md:w-auto">
              <input
                type="text"
                placeholder="Cari Buku"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-r-md hover:bg-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            <div className="relative md:w-64 w-full">
              <div onClick={() => toggleDropdown("category")} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer flex justify-between items-center">
                {selectedCategory || "Pilih Kategori"}
                <FaChevronDown className="w-3 text-gray-500" />
              </div>
              {dropdowns.category && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg animate-fadeIn">
                  {categories.map((cat) => (
                    <div key={cat} onClick={() => selectCategoryOption(cat)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Buku yang Tersedia</h1>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(booksPerPage)
                    .fill(0)
                    .map((_, index) => (
                      <BookCardSkeleton key={index} />
                    ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentBooks.map((book) => (
                      <BookCard key={book._id} book={book} onBookmarkToggle={handleBookmarkToggle} />
                    ))}
                  </div>
                  {currentBooks.length === 0 && (
                    <div className="text-center py-10 col-span-full">
                      <p className="text-gray-600 text-lg">Tidak ada buku yang ditemukan.</p>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-center">
                <Pagination totalPages={totalPages} paginate={paginate} currentPage={currentPage} />
              </div>
            </div>
            <aside>
              <UploadBookForm onUploadSuccess={handleUploadSuccess} />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export default UmmahBook;
