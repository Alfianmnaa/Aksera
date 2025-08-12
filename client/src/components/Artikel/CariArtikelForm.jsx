import { useState } from "react";
import { axiosInstance } from "../../config";
import arrowDown from "../../assets/LihatDonasi/arrowDown.svg";

export default function CariArtikelForm({ setArticles, loading, setLoading, setIsSearched }) {
  const [selectedSort, setSelectedSort] = useState("terbaru");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isOpenSort, setIsOpenSort] = useState(false);

  const sortOptions = [
    { value: "terbaru", label: "Terbaru" },
    { value: "terlama", label: "Terlama" },
  ];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setIsSearched(true);
      const res = await axiosInstance.get("/artikel/getall");
      let filtered = res.data;

      if (searchKeyword.trim()) {
        filtered = filtered.filter((item) => item.judulArtikel.toLowerCase().includes(searchKeyword.toLowerCase()));
      }

      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return selectedSort === "terbaru" ? dateB - dateA : dateA - dateB;
      });

      setArticles(filtered);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil artikel:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchArticles();
  };

  return (
    <>
      {/* Filter Section */}
      <section className="py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Dropdown Sort */}
              <div className="relative z-10">
                <div className="bg-white flex justify-between items-center px-4 py-2 rounded-lg border border-gray-300 shadow-sm cursor-pointer min-w-[200px]" onClick={() => setIsOpenSort(!isOpenSort)}>
                  <span className="text-sm text-gray-700">{sortOptions.find((option) => option.value === selectedSort)?.label || "Pilih Urutan"}</span>
                  <img src={arrowDown} alt="arrowDown" className={`w-3 transition-transform ${isOpenSort ? "rotate-180" : ""}`} />
                </div>

                {isOpenSort && (
                  <div className="absolute z-50 w-full max-h-96 overflow-y-auto mt-1 bg-white shadow-lg rounded-lg border border-gray-200">
                    <ul className="p-2">
                      {sortOptions.map((option) => (
                        <li
                          key={option.value}
                          className="cursor-pointer hover:bg-gray-100 p-2 text-sm rounded"
                          onClick={() => {
                            setSelectedSort(option.value);
                            setIsOpenSort(false);
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Input keyword */}
              <input
                type="text"
                placeholder="Cari Artikel..."
                className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#045394] relative z-10"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              className="bg-[#045394] hover:bg-[#033b6d] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 relative z-10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mencari...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6.85417 12.7918C5.20139 12.7918 3.80208 12.2189 2.65625 11.0731C1.51042 9.92725 0.9375 8.52794 0.9375 6.87516C0.9375 5.22238 1.51042 3.82308 2.65625 2.67725C3.80208 1.53141 5.20139 0.958496 6.85417 0.958496C8.50695 0.958496 9.90625 1.53141 11.0521 2.67725C12.1979 3.82308 12.7708 5.22238 12.7708 6.87516C12.7708 7.50016 12.684 8.09738 12.5104 8.66683C12.3368 9.23627 12.0833 9.74322 11.75 10.1877L16.2917 14.7293C16.5 14.9377 16.6042 15.1946 16.6042 15.5002C16.6042 15.8057 16.5 16.0627 16.2917 16.271C16.0833 16.4793 15.8264 16.5835 15.5208 16.5835C15.2153 16.5835 14.9583 16.4793 14.75 16.271L10.2292 11.7502C9.8125 12.0696 9.30208 12.3231 8.69792 12.5106C8.09375 12.6981 7.47917 12.7918 6.85417 12.7918ZM6.85417 10.5835C7.89583 10.5835 8.77431 10.2259 9.48958 9.51058C10.2049 8.7953 10.5625 7.91683 10.5625 6.87516C10.5625 5.8335 10.2049 4.95502 9.48958 4.23975C8.77431 3.52447 7.89583 3.16683 6.85417 3.16683C5.8125 3.16683 4.93403 3.52447 4.21875 4.23975C3.50347 4.95502 3.14583 5.8335 3.14583 6.87516C3.14583 7.91683 3.50347 8.7953 4.21875 9.51058C4.93403 10.2259 5.8125 10.5835 6.85417 10.5835Z"
                      fill="white"
                    />
                  </svg>
                  Cari
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
