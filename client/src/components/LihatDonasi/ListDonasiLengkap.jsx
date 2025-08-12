import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CardDonasi from "./CardDonasi";
import { CardDonasiSkeleton } from "./CardDonasiSkeleton";
import { axiosInstance } from "../../config";
import Indonesia from "../UploadDonasi/dataProvinsi";
import { useSearchParams } from "react-router-dom";
import locationIcon from "../../assets/LihatDonasi/location.svg";
import arrowDown from "../../assets/LihatDonasi/arrowDown.svg";

export default function LihatDonasiLengkap() {
  const [semuaData, setSemuaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState("Semua Provinsi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpenProvinsi, setIsOpenProvinsi] = useState(false);
  const [searchParams] = useSearchParams();
  const statusQuery = searchParams.get("status");
  const navigate = useNavigate();

  const fetchDonasi = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get("/donasi/getall");
      const donasiData = res.data || [];

      const dataGabungan = await Promise.all(
        donasiData.map(async (donasi) => {
          try {
            const { data: detilDonasi } = await axiosInstance.get(`/donasi/detil/get/${donasi._id}`);
            const { data: pemilik } = await axiosInstance.get(`/user/get/${donasi.donasiUid}`);
            const { data: detilPemilik } = await axiosInstance.get(`/detil/get/${donasi.donasiUid}`);

            return {
              id: donasi._id,
              title: donasi.namaBarang,
              kategoriBarang: donasi.kategori,
              jenisBarang: donasi.kondisiBarang,
              status: detilDonasi.namaStatus,
              date: new Date(donasi.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              description: donasi.deskripsi,
              author: pemilik?.username || "Anonymous",
              location: `${donasi.kabupaten}, ${donasi.provinsi}`,
              provinsi: donasi.provinsi,
              imageSrc: donasi.fotoBarang,
              avatarSrc: detilPemilik?.fotoProfil || null,
            };
          } catch (err) {
            console.warn("Gagal mengambil detail atau user:", err);
            return null;
          }
        })
      );

      const hasilValid = dataGabungan.filter(Boolean);

      const hasilSesuaiStatus = statusQuery ? hasilValid.filter((item) => item.status === statusQuery) : hasilValid;

      setSemuaData(hasilSesuaiStatus);
    } catch (err) {
      console.error("Gagal mengambil data donasi:", err);
      setError("Gagal mengambil data donasi. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, [statusQuery]);

  useEffect(() => {
    fetchDonasi();
  }, [fetchDonasi]);

  useEffect(() => {
    if (selectedProvinsi === "Semua Provinsi") {
      setFilteredData(semuaData);
    } else {
      setFilteredData(semuaData.filter((item) => item.provinsi === selectedProvinsi));
    }
  }, [selectedProvinsi, semuaData]);

  const handleProvinsiChange = (value) => {
    setSelectedProvinsi(value);
  };

  const handleClick = (id) => {
    navigate(`/lihat-donasi/donasi-${statusQuery}/detail-barang/${id}`);
  };

  const judul = statusQuery ? `Donasi dengan status: ${statusQuery.charAt(0).toUpperCase() + statusQuery.slice(1)}` : "Semua Donasi";

  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center md:items-center md:justify-center mb-10 gap-4 text-center">
          <div>
            <h2 className="text-3xl font-bold text-[#0D3C61] mb-2">{judul}</h2>
            <p className="text-gray-600 max-w-lg">
              {statusQuery 
                ? `Lihat dan pilih donasi dengan status ${statusQuery.charAt(0).toUpperCase() + statusQuery.slice(1)}.`
                : "Lihat dan pilih donasi yang sedang tersedia dan siap disalurkan."
              }
            </p>
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative z-20 w-[180px] sm:w-[200px]">
            <div
              className="bg-white flex justify-between items-center px-4 py-2 rounded-lg border border-[#045394] shadow-sm cursor-pointer"
              onClick={() => setIsOpenProvinsi(!isOpenProvinsi)}
            >
              <div className="flex items-center gap-2">
                <img src={locationIcon} alt="iconLocation" className="w-4" />
                <span className="text-sm font-medium">
                  {selectedProvinsi}
                </span>
              </div>
              <img
                src={arrowDown}
                alt="arrowDown"
                className={`w-3 transition-transform text-[#045394] ${isOpenProvinsi ? "rotate-180" : ""}`}
              />
            </div>

            {isOpenProvinsi && (
              <div className="absolute z-50 w-full max-h-96 overflow-y-auto mt-1 bg-white shadow-lg rounded-lg border border-gray-200">
                <ul className="p-2">
                  <li
                    className="cursor-pointer hover:bg-gray-100 p-2 text-sm rounded"
                    onClick={() => {
                      handleProvinsiChange("Semua Provinsi");
                      setIsOpenProvinsi(false);
                    }}
                  >
                    Semua Provinsi
                  </li>
                  {Indonesia.map((provinsi) => (
                    <li
                      className="cursor-pointer hover:bg-gray-100 p-2 text-sm rounded"
                      key={provinsi.namaProvinsi}
                      onClick={() => {
                        handleProvinsiChange(provinsi.namaProvinsi);
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
        </div>

        {/* Status Feedback */}
        {loading && (
          <div className="flex flex-wrap justify-center gap-6">
            {Array(6)
              .fill(null)
              .map((_, idx) => (
                <CardDonasiSkeleton key={idx} />
              ))}
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Tidak ada donasi ditemukan.</p>
          </div>
        )}

        {/* Cards grid - Gunakan flex dan center */}
        {!loading && filteredData.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredData.map((item) => (
              <CardDonasi
                key={item.id}
                id={item.id}
                title={item.title}
                kategoriBarang={item.kategoriBarang}
                jenisBarang={item.jenisBarang}
                status={item.status}
                date={item.date}
                description={item.description}
                author={item.author}
                location={item.location}
                imageSrc={item.imageSrc}
                avatarSrc={item.avatarSrc}
                handleClick={() => handleClick(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
