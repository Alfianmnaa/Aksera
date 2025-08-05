import React, { useEffect, useState } from "react";
import CardDonasi from "./CardDonasi";
import { CardSkleton } from "./CardSkleton";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";

const categories = ["Semua", "Pendidikan", "Elektronik", "Disabilitas"];

export default function DonasiByCategory() {
  const [donasi, setDonasi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonasi();
  }, []);

  const fetchDonasi = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/donasi/getall");
      const data = res.data || [];

      const donasiWithDetails = await Promise.all(
        data?.map(async (donasiItem) => {
          try {
            const [detailRes, userRes, detilUserRes] = await Promise.all([
              axiosInstance.get(`/donasi/detil/get/${donasiItem._id}`),
              axiosInstance.get(`/user/get/${donasiItem.donasiUid}`),
              axiosInstance.get(`/detil/get/${donasiItem.donasiUid}`),
            ]);

            const detail = detailRes.data;
            const user = userRes.data;
            const detilUser = detilUserRes.data;

            return {
              id: donasiItem._id,
              title: donasiItem.namaBarang,
              kategoriBarang: donasiItem.kategori,
              jenisBarang: donasiItem.kondisiBarang,
              status: detail.namaStatus,
              date: new Date(donasiItem.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              description: donasiItem.deskripsi,
              author: user.username || "Anonymous",
              location: `${donasiItem.kabupaten}, ${donasiItem.provinsi}`,
              imageSrc: donasiItem.fotoBarang,
              avatarSrc: detilUser?.fotoProfil || null,
            };
          } catch (err) {
            console.error("Gagal memuat detail donasi:", err);
            return null;
          }
        })
      );

      const filtered = donasiWithDetails.filter(Boolean);
      setDonasi(filtered);
    } catch (err) {
      console.error("Gagal mengambil data Donasi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id) => {
    navigate(`/lihat-Donasi/Donasi-kategori/detail-barang/${id}`);
  };

  const filteredDonations =
    activeCategory === "Semua"
      ? donasi
      : donasi.filter(
          (item) =>
            item.kategoriBarang?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12 sm:py-12 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="ext-xl sm:text-2xl font-bold">
          Donasi Berdasarkan Kategori
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
            ))
          ) : (
            <p className="text-center text-gray-500">
              Tidak ada donasi yang tersedia untuk kategori ini.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
