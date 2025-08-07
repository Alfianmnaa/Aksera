import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";
import { CardSkleton } from "../LihatDonasi/CardSkleton";
import CardArtikel from "../Artikel/CardArtikel";

export const ArtikelSection = () => {
  const navigate = useNavigate();
  const [artikelList, setArtikelList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArtikel = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/artikel/getall");

      const artikelWithUser = await Promise.all(
        res.data.map(async (artikel) => {
          try {
            const [userRes, detailRes] = await Promise.all([axiosInstance.get(`/user/get/${artikel.artikelUid}`), axiosInstance.get(`/detil/get/${artikel.artikelUid}`)]);

            return {
              ...artikel,
              username: userRes.data.username,
              fotoProfil: detailRes.data.fotoProfil,
              namaLengkap: detailRes.data.namaLengkap,
            };
          } catch (err) {
            console.error("Gagal mengambil data user untuk artikel:", artikel._id, err);
            return artikel; // fallback jika user gagal diambil
          }
        })
      );

      setArtikelList(artikelWithUser);
    } catch (error) {
      console.error("Gagal mengambil artikel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  const handleClick = (id) => {
    navigate(`/artikel/detail-artikel/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-20 mb-24 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between px-8 sm:items-center mb-6 gap-2 sm:gap-0">
        <h2 className="text-3xl font-semibold text-left sm:text-left">Artikel</h2>
        <Link to={"artikel"} className="text-[#045394] md:text-sm text-xs text-left  hover:underline sm:text-right">
          Lihat semua
        </Link>
      </div>
      {loading && (
        <div className="flex flex-wrap justify-center gap-4">
          {Array(3)
            .fill(null)
            .map((_, idx) => (
              <CardSkleton key={idx} />
            ))}
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-6">
        {artikelList?.slice(0, 3).map((item) => (
          <CardArtikel
            key={item._id}
            id={item._id}
            title={item.judulArtikel}
            description={item.deskArtikel}
            imageSrc={item.coverUrl}
            date={new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            author={item.namaLengkap}
            username={`@${item.username}`}
            avatarSrc={item.fotoProfil}
            handleClick={() => handleClick(item._id)}
          />
        ))}
      </div>
    </div>
  );
};
