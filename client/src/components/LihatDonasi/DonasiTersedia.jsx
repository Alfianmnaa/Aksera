import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import CardDonasi from "./CardDonasi";
import { axiosInstance } from "../../config";
import { CardSkleton } from "./CardSkleton";

export default function DonasiTersedia() {
  const [semuaData, setSemuaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
            const { data: detilDonasi } = await axiosInstance.get(
              `/donasi/detil/get/${donasi._id}`
            );
            if (detilDonasi.namaStatus !== "tersedia") return null;

            const { data: pemilik } = await axiosInstance.get(
              `/user/get/${donasi.donasiUid}`
            );
            const { data: detilPemilik } = await axiosInstance.get(
              `/detil/get/${donasi.donasiUid}`
            );

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
              imageSrc: donasi?.fotoBarang || null,
              avatarSrc: detilPemilik?.fotoProfil || null,
            };
          } catch (err) {
            console.warn("Gagal mengambil detail atau user:", err);
            return null;
          }
        })
      );

      const hasilValid = dataGabungan.filter(Boolean);
      setSemuaData(hasilValid);
    } catch (err) {
      console.error("Gagal mengambil data donasi:", err);
      setError("Gagal mengambil data donasi. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonasi();
  }, [fetchDonasi]);

  const handleClick = (id) => {
    navigate(`/lihat-donasi/donasi-tersedia/detail-barang/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Donasi Tersedia</h2>
        <Link
          to="/lihat-semua-donasi?status=tersedia"
          className="text-[#F79319] text-sm sm:text-base hover:underline"
        >
          Lihat semua
        </Link>
      </div>

      {/* Status Feedback */}
      {loading && (
        <div className="flex flex-wrap justify-center gap-4">
          {Array(3)
            .fill(null)
            .map((_, idx) => (
              <CardSkleton key={idx} />
            ))}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && semuaData.length === 0 && (
        <p>Tidak ada donasi tersedia saat ini.</p>
      )}

      {/* Cards grid */}
      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
        {semuaData.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="w-full sm:w-[48%] md:w-[31%] flex justify-center"
          >
            <CardDonasi
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
