import { useState } from "react";
import { axiosInstance } from "../../config";
import loadingGif from "../../assets/LihatDonasi/loading.gif";
import arrowDown from "../../assets/LihatDonasi/arrowDown.svg";

export default function CariArtikelForm({ setArticles, loading, setLoading, setIsSearched }) {
  const [selectedSort, setSelectedSort] = useState("terbaru");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = ["terbaru", "terlama"];

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
    <div className="grid place-items-center mt-10 item-h-screen p-2 md:mt-16 relative">
      <form onSubmit={handleSubmit} className="flex w-full max-w-4xl overflow-visible relative shadow-[0px_0px_6px_2px_rgba(0,0,0,0.1)] rounded-xl border-2 border-gray-200">
        {/* Dropdown */}
        <div className="relative">
          <div className="bg-white flex justify-between items-center md:p-6 px-4 py-6 rounded-l-xl md:gap-2 gap-1 max-w-60 border-r-[1px] border-[#D9D9D9] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <span className="md:text-md text-sm  font-semibold md:block">{selectedSort}</span>
            <img src={arrowDown} alt="arrowDown" className={`w-2  md:block ${selectedSort === "terbaru" ? "transform rotate-180" : ""}`} />
          </div>

          {isOpen && (
            <div className="absolute z-50 w-72 max-h-96 overflow-y-auto mt-1 bg-white shadow-lg rounded-md">
              <ul className="p-2">
                {sortOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setSelectedSort(option);
                      setIsOpen(false);
                    }}
                    className="cursor-pointer hover:bg-gray-100 p-2 capitalize"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Input Search */}
        <input type="text" className="flex-1 p-5 rounded-r-xl border-gray-300 focus:outline-none" placeholder="Cari artikel" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />

        {loading && <img src={loadingGif} className="w-12 h-12 absolute right-24 top-3" alt="loadingGif" />}

        {/* Tombol Cari */}
        <button type="submit" className="bg-primary py-2 px-4 rounded-md absolute right-5 top-3" aria-label="Tombol cari">
          <svg width="24" height="24" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.85417 12.7918C5.20139 12.7918 3.80208 12.2189 2.65625 11.0731C1.51042 9.92725 0.9375 8.52794 0.9375 6.87516C0.9375 5.22238 1.51042 3.82308 2.65625 2.67725C3.80208 1.53141 5.20139 0.958496 6.85417 0.958496C8.50695 0.958496 9.90625 1.53141 11.0521 2.67725C12.1979 3.82308 12.7708 5.22238 12.7708 6.87516C12.7708 7.50016 12.684 8.09738 12.5104 8.66683C12.3368 9.23627 12.0833 9.74322 11.75 10.1877L16.2917 14.7293C16.5 14.9377 16.6042 15.1946 16.6042 15.5002C16.6042 15.8057 16.5 16.0627 16.2917 16.271C16.0833 16.4793 15.8264 16.5835 15.5208 16.5835C15.2153 16.5835 14.9583 16.4793 14.75 16.271L10.2292 11.7502C9.8125 12.0696 9.30208 12.3231 8.69792 12.5106C8.09375 12.6981 7.47917 12.7918 6.85417 12.7918ZM6.85417 10.5835C7.89583 10.5835 8.77431 10.2259 9.48958 9.51058C10.2049 8.7953 10.5625 7.91683 10.5625 6.87516C10.5625 5.8335 10.2049 4.95502 9.48958 4.23975C8.77431 3.52447 7.89583 3.16683 6.85417 3.16683C5.8125 3.16683 4.93403 3.52447 4.21875 4.23975C3.50347 4.95502 3.14583 5.8335 3.14583 6.87516C3.14583 7.91683 3.50347 8.7953 4.21875 9.51058C4.93403 10.2259 5.8125 10.5835 6.85417 10.5835Z"
              fill="white"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
