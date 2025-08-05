import React from "react";
import CardBuku from "./CardBuku";
import { useNavigate } from "react-router-dom";

export default function HasilPencarian({ resultData, cardType = "buku" }) {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/lihat-buku/buku-kategori/detail-barang/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12 sm:py-12 md:px-8">
      <div className="flex justify-between items-center sm:items-center gap-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Hasil Pencarian</h2>
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        {resultData.map((item) => (
          <div className="w-full sm:w-[48%] md:w-[31%] flex justify-center">
            <CardBuku
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
          </div>
        ))}
      </div>
    </div>
  );
}
