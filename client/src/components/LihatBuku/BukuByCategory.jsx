import React, { useEffect, useState } from "react";
import CardBuku from "./CardBuku";
import { CardSkleton } from "./CardSkleton";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";

const categories = ["Semua", "Elektronik", "Disabilitas", "Pendidikan"];

export default function BukuByCategory() {
  const [buku, setBuku] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuku();
  }, []);

  const fetchBuku = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/buku/getall");
      const data = res.data || [];

      const bukuWithDetails = await Promise.all(
        data?.map(async (bukuItem) => {
          try {
            const [detailRes, userRes, detilUserRes] = await Promise.all([
              axiosInstance.get(`/buku/detil/get/${bukuItem._id}`),
              axiosInstance.get(`/user/get/${bukuItem.bukuUid}`),
              axiosInstance.get(`/detil/get/${bukuItem.bukuUid}`),
            ]);

            const detail = detailRes.data;
            const user = userRes.data;
            const detilUser = detilUserRes.data;

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
              avatarSrc: detilUser?.fotoProfil || null,
            };
          } catch (err) {
            console.error("Gagal memuat detail buku:", err);
            return null;
          }
        })
      );

      const filtered = bukuWithDetails.filter(Boolean);
      setBuku(filtered);
    } catch (err) {
      console.error("Gagal mengambil data buku:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id) => {
    navigate(`/lihat-buku/buku-kategori/detail-barang/${id}`);
  };

  const filteredDonations =
    activeCategory === "Semua"
      ? buku
      : buku.filter(
          (item) =>
            item.kategoriBarang?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12 sm:py-12 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="ext-xl sm:text-2xl font-bold">
          Buku Berdasarkan Kategori
        </h2>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(category)}
            className={`py-3 px-5 rounded-md border text-sm ${
              activeCategory === category
                ? "bg-primary text-white"
                : "bg-white text-primary border-grey-500"
            } hover:shadow-lg transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-wrap justify-center gap-6 px-4 py-8">
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <CardSkleton key={idx} />
            ))}
        </div>
      ) : (
        <div className="flex gap-6 justify-center flex-wrap">
          {filteredDonations.length > 0 ? (
            filteredDonations.map((item) => (
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
            ))
          ) : (
            <p className="text-center text-gray-500">
              Tidak ada buku yang tersedia untuk kategori ini.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
