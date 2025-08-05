import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";
import CardArtikel from "./CardArtikel";

export default function HasilPencarianArtikel({ resultData }) {
  const navigate = useNavigate();
  const [artikelLengkap, setArtikelLengkap] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const hasilLengkap = await Promise.all(
        resultData.map(async (artikel) => {
          try {
            const [userRes, detailRes] = await Promise.all([axiosInstance.get(`/user/get/${artikel.artikelUid}`), axiosInstance.get(`/detil/get/${artikel.artikelUid}`)]);

            return {
              ...artikel,
              username: userRes.data.username,
              fotoProfil: detailRes.data.fotoProfil,
              namaLengkap: detailRes.data.namaLengkap,
            };
          } catch (err) {
            console.error("Gagal ambil user detail untuk artikel:", artikel._id, err);
            return artikel;
          }
        })
      );

      setArtikelLengkap(hasilLengkap);
    };

    if (resultData.length > 0) {
      fetchUserData();
    }
  }, [resultData]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-2 sm:py-12  py-2">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Hasil Pencarian Artikel</h2>

      <div className="flex gap-6 flex-wrap justify-center max-w-5xl">
        {artikelLengkap.map((artikel) => (
          <CardArtikel
            key={artikel._id}
            id={artikel._id}
            title={artikel.judulArtikel}
            description={artikel.deskArtikel}
            imageSrc={artikel.coverUrl}
            author={artikel.namaLengkap || "Anonim"}
            username={`@${artikel.username || "pengguna"}`}
            date={new Date(artikel.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            avatarSrc={artikel.fotoProfil}
            handleClick={() => navigate(`/artikel/detail-artikel/${artikel._id}`)}
          />
        ))}
      </div>
    </div>
  );
}
