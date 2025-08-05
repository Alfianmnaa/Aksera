import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";
import CardArtikel from "./CardArtikel";
import { CardSkleton } from "../LihatDonasi/CardSkleton";

export default function ListArtikel() {
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
    <div className="max-w-5xl mx-auto px-4 sm:px-2 py-8 sm:py-12  ">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Daftar Artikel Komunitas</h2>

      {loading ? (
        <div className="flex flex-wrap  gap-4 justify-center">
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <CardSkleton key={idx} />
            ))}
        </div>
      ) : (
        <div className="flex gap-6 flex-wrap justify-center">
          {artikelList.map((item) => (
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
      )}
    </div>
  );
}
