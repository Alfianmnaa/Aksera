import React from "react";
import CardDonasi from "./CardDonasi";
import { useNavigate } from "react-router-dom";

export default function HasilPencarian({ resultData, cardType = "donasi" }) {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/lihat-donasi/donasi-kategori/detail-barang/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12 sm:py-12 md:px-8">
      <div className="flex justify-between items-center sm:items-center gap-2 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Hasil Pencarian</h2>
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        {resultData.map((item) => (
          <div className="w-full sm:w-[48%] md:w-[31%] flex justify-center">
            <CardDonasi
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
