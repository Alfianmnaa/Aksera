import React, { useEffect, useState } from "react";
import CardDonasi from "./CardDonasi";
import { CardDonasiSkeleton } from "./CardDonasiSkeleton";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";
import { Grid3X3, GraduationCap, Smartphone, Accessibility } from "lucide-react";

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
    <section className="max-w-5xl mx-auto px-4 py-16">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Donasi Berdasarkan Kategori</h2>

      {/* Filter Buttons - Sesuai dengan HTML */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(category)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-[#045394] font-semibold shadow transition text-sm ${
              activeCategory === category
                ? "bg-[#045394] text-white"
                : "bg-white text-[#045394] hover:bg-[#045394] hover:text-white"
            }`}
          >
            {/* Icons sesuai kategori */}
            {category === "Semua" && <Grid3X3 size={16} />}
            {category === "Pendidikan" && <GraduationCap size={16} />}
            {category === "Elektronik" && <Smartphone size={16} />}
            {category === "Disabilitas" && <Accessibility size={16} />}
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
              <CardDonasiSkeleton key={idx} />
            ))}
        </div>
      ) : (
        /* Cards - Gunakan flex dan center sesuai HTML */
        <div className="flex flex-wrap justify-center gap-6">
          {filteredDonations.length > 0 ? (
            filteredDonations.map((item) => (
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
            ))
          ) : (
            <p className="text-center text-gray-500">
              Tidak ada donasi yang tersedia untuk kategori ini.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
