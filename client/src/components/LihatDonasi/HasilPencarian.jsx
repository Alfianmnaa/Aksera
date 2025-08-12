import React from "react";
import CardDonasi from "./CardDonasi";
import { useNavigate } from "react-router-dom";

export default function HasilPencarian({ resultData, cardType = "donasi" }) {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/lihat-donasi/donasi-kategori/detail-barang/${id}`);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Hasil Pencarian</h2>
      </div>
      
      {/* Gunakan flex dan center sesuai HTML */}
      <div className="flex flex-wrap justify-center gap-6">
        {resultData.map((item) => (
          <CardDonasi
            key={item.id}
            id={item.id}
            title={item.title}
            kategoriBarang={item.kategoriBarang}
            status={item.status}
            jenisBarang={item.jenisBarang}
            date={item.date}
            description={item.description}
            author={item.author}
            location={item.location}
            imageSrc={item.imageSrc}
            avatarSrc={item.avatarSrc}
            handleClick={() => handleClick(item.id)}
            cardType={cardType}
          />
        ))}
      </div>
    </section>
  );
}
