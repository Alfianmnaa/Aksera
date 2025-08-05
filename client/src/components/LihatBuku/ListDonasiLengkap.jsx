import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CardBuku from "./CardBuku";
import { CardSkleton } from "./CardSkleton";
import { axiosInstance } from "../../config";
import Indonesia from "../UploadBuku/dataProvinsi";
import { useSearchParams } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

export default function LihatBukuLengkap() {
  const [semuaData, setSemuaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState("Semua Provinsi");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const statusQuery = searchParams.get("status");
  const navigate = useNavigate();

  const fetchBuku = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get("/buku/getall");
      const bukuData = res.data || [];

      const dataGabungan = await Promise.all(
        bukuData.map(async (buku) => {
          try {
            const { data: detilBuku } = await axiosInstance.get(
              `/buku/detil/get/${buku._id}`
            );
            const { data: pemilik } = await axiosInstance.get(
              `/user/get/${buku.bukuUid}`
            );
            const { data: detilPemilik } = await axiosInstance.get(
              `/detil/get/${buku.bukuUid}`
            );

            return {
              id: buku._id,
              title: buku.namaBarang,
              kategoriBarang: buku.kategori,
              jenisBarang: buku.kondisiBarang,
              status: detilBuku.namaStatus,
              date: new Date(buku.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              description: buku.deskripsi,
              author: pemilik?.username || "Anonymous",
              location: `${buku.kabupaten}, ${buku.provinsi}`,
              provinsi: buku.provinsi,
              imageSrc: buku.fotoBarang,
              avatarSrc: detilPemilik?.fotoProfil || null,
            };
          } catch (err) {
            console.warn("Gagal mengambil detail atau user:", err);
            return null;
          }
        })
      );

      const hasilValid = dataGabungan.filter(Boolean);

      const hasilSesuaiStatus = statusQuery
        ? hasilValid.filter((item) => item.status === statusQuery)
        : hasilValid;

      setSemuaData(hasilSesuaiStatus);
    } catch (err) {
      console.error("Gagal mengambil data buku:", err);
      setError("Gagal mengambil data buku. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, [statusQuery]);

  useEffect(() => {
    fetchBuku();
  }, [fetchBuku]);

  useEffect(() => {
    if (selectedProvinsi === "Semua Provinsi") {
      setFilteredData(semuaData);
    } else {
      setFilteredData(
        semuaData.filter((item) => item.provinsi === selectedProvinsi)
      );
    }
  }, [selectedProvinsi, semuaData]);

  const handleClick = (id) => {
    navigate(`/lihat-buku/buku-${statusQuery}/detail-barang/${id}`);
  };

  const judul = statusQuery
    ? `Buku dengan status: ${
        statusQuery.charAt(0).toUpperCase() + statusQuery.slice(1)
      }`
    : "Semua Buku";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">{judul}</h2>
      </div>

      {/* Dropdown Provinsi */}
      <div className="mb-6 relative max-w-sm">
        <label htmlFor="provinsi" className="block mb-2 font-medium">
          Filter berdasarkan provinsi:
        </label>

        <button
          type="button"
          className="w-full border rounded px-4 py-2 flex justify-between items-center"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          {selectedProvinsi}
          <FaChevronDown className="ml-2 w-3" />
        </button>

        {dropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow-md max-h-60 overflow-y-auto">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedProvinsi("Semua Provinsi");
                setDropdownOpen(false);
              }}
            >
              Semua Provinsi
            </li>
            {Indonesia.map((provinsi, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedProvinsi(provinsi.namaProvinsi);
                  setDropdownOpen(false);
                }}
              >
                {provinsi.namaProvinsi}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Status Feedback */}
      {loading && (
        <div className="flex flex-wrap justify-center gap-4">
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <CardSkleton key={idx} />
            ))}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && filteredData.length === 0 && (
        <p>Tidak ada buku ditemukan.</p>
      )}

      {/* Cards grid */}
      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="w-full sm:w-[48%] md:w-[31%] flex justify-center"
          >
            <CardBuku
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
          </div>
        ))}
      </div>
    </div>
  );
}
