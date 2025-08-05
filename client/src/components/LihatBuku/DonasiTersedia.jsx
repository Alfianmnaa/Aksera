import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import CardBuku from "./CardBuku";
import { axiosInstance } from "../../config";
import { CardSkleton } from "./CardSkleton";

export default function BukuTersedia() {
  const [semuaData, setSemuaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
            if (detilBuku.namaStatus !== "tersedia") return null;

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
              imageSrc: buku?.fotoBarang || null,
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
      console.error("Gagal mengambil data buku:", err);
      setError("Gagal mengambil data buku. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuku();
  }, [fetchBuku]);

  const handleClick = (id) => {
    navigate(`/lihat-buku/buku-tersedia/detail-barang/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Buku Tersedia</h2>
        <Link
          to="/lihat-semua-buku?status=tersedia"
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
        <p>Tidak ada buku tersedia saat ini.</p>
      )}

      {/* Cards grid */}
      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
        {semuaData.slice(0, 3).map((item) => (
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
