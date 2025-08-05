import { useState } from "react";
import { axiosInstance } from "../../config";
import heroImage2 from "../../assets/LihatBuku/Buku.webp";
import Indonesia from "../UploadBuku/dataProvinsi";
import locationIcon from "../../assets/LihatBuku/location.svg";
import arrowDown from "../../assets/LihatBuku/arrowDown.svg";
import loadingGif from "../../assets/LihatBuku/loading.gif";

export default function CariBukuForm({
  setBooks,
  loading,
  setLoading,
  setIsSearched,
}) {
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isOpenProvinsi, setIsOpenProvinsi] = useState(false);

  const handleProvinsiChange = (e) => {
    setSelectedProvinsi(e.target.value);
  };

  const handleKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSearched(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedProvinsi) queryParams.append("provinsi", selectedProvinsi);
      if (searchKeyword) queryParams.append("judul", searchKeyword);

      const response = await axiosInstance.get(
        `/buku/getall?${queryParams.toString()}`,
        { withCredentials: true }
      );
      const data = response.data || [];

      if (data?.length === 0) {
        setBooks([]);
        setLoading(false);
      }

      const normalizedData = await Promise.all(
        data.map(async (bukuItem) => {
          try {
            const [detailRes, userRes, detilUserRes] = await Promise.all([
              axiosInstance.get(`/buku/detil/get/${bukuItem._id}`),
              axiosInstance.get(`/user/get/${bukuItem.bukuUid}`),
              axiosInstance.get(`/detil/get/${bukuItem.bukuUid}`),
            ]);

            const detail = detailRes.data;
            const user = userRes.data;
            const detailUser = detilUserRes.data;

            return {
              id: bukuItem._id,
              title: bukuItem.namaBarang,
              kategoriBarang: bukuItem.kategori,
              jenisBarang: bukuItem.kondisiBarang,
              status: detail.namaStatus,
              date: new Date(bukuItem.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              description: bukuItem.deskripsi,
              author: user.username || "Anonymous",
              location: `${bukuItem.kabupaten}, ${bukuItem.provinsi}`,
              imageSrc: bukuItem.fotoBarang,
              avatarSrc: detailUser?.fotoProfil,
            };
          } catch (err) {
            console.error("Gagal ambil detail/user:", err);
            return null;
          }
        })
      );

      const filtered = normalizedData.filter(Boolean);
      setBooks(filtered.length > 0 ? filtered : []);
    } catch (error) {
      console.error("Gagal mencari buku:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-64 pb-24 p-4 h-auto md:py-8 sm:px-12 md:h-screen mb-12 relative">
      <HeroSection />
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-4xl overflow-visible relative"
      >
        {/* Dropdown provinsi */}
        <div className="relative">
          <div
            className="bg-white flex justify-between items-center p-6 rounded-l-xl md:gap-2 gap-1 max-w-60 border-r-[1px] border-[#D9D9D9] cursor-pointer"
            onClick={() => setIsOpenProvinsi(!isOpenProvinsi)}
          >
            <img src={locationIcon} alt="iconLocation" className="w-4 mr-2" />
            <span className="text-smallText font-semibold md:block hidden">
              {selectedProvinsi || "Provinsi"}
            </span>
            <img
              src={arrowDown}
              alt="arrowDown"
              className={`md:w-3 w-2  mx-2 md:block hidden ${
                isOpenProvinsi ? "transform rotate-180 md:w-3 w-2" : ""
              }`}
            />
          </div>

          {isOpenProvinsi && (
            <div className="absolute z-50 w-72 max-h-96 overflow-y-auto mt-1 bg-white shadow-lg rounded-md">
              <ul className="p-2">
                <li
                  className="cursor-pointer hover:bg-gray-100 p-2"
                  onClick={() => {
                    handleProvinsiChange({ target: { value: "" } });
                    setIsOpenProvinsi(false);
                  }}
                >
                  Pilih Provinsi
                </li>
                {Indonesia.map((provinsi) => (
                  <li
                    className="cursor-pointer hover:bg-gray-100 p-2"
                    key={provinsi.namaProvinsi}
                    onClick={() => {
                      handleProvinsiChange({
                        target: { value: provinsi.namaProvinsi },
                      });
                      setIsOpenProvinsi(false);
                    }}
                  >
                    {provinsi.namaProvinsi}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Input keyword */}
        <input
          type="text"
          className="flex-1 p-5 shadow-[0px_0px_6px_2px_rgba(0,0,0,0.1)] rounded-r-xl border-gray-300 focus:outline-none"
          placeholder="Cari Buku"
          value={searchKeyword}
          onChange={handleKeywordChange}
        />

        {loading && (
          <img
            src={loadingGif}
            className="w-12 h-12 absolute right-24 top-3"
            alt="loadingGif"
          />
        )}

        {/* Tombol Submit */}
        <button
          type="submit"
          className="bg-primary py-2 px-4 rounded-md absolute right-5 top-[20%]"
          aria-label="Search button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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

// Hero section tetap
function HeroSection() {
  return (
    <>
      <img
        className="absolute z-[-1] top-0 left-0 w-full h-full object-cover object-center"
        src={heroImage2}
        alt="Hero background"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="relative z-10 text-center px-4 sm:px-0">
        <h1 className="text-4xl sm:text-heading-xl text-white font-extrabold mb-4 sm:mb-6 leading-snug">
          Buku Pendidikan
        </h1>
        <h2 className="text-sm sm:text-body-xl text-white font-medium mb-6 sm:mb-12 leading-relaxed">
          Bersama Kita Wujudkan Pendidikan yang Setara
        </h2>
      </div>
    </>
  );
}
