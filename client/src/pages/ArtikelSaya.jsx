import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../config";
import { UserContext } from "../context/UserContext";
import TambahArtikel from "../components/ArtikelSaya/TambahArtikel";
import komunitasSampul from "../assets/DonasiSaya/komunitasSampul.png";
import personProfile from "../assets/Navbar/personProfile.png";

import CardArtikel from "../components/Artikel/CardArtikel";

export default function ArtikelSaya() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState("Terbaru");
  const [detilUser, setDetilUser] = useState();
  const [activeTab, setActiveTab] = useState("artikel-saya");

  useEffect(() => {
    if (!user) return;

    const fetchArticles = async () => {
      try {
        const res = await axiosInstance.get("/artikel/getall");
        const allArticles = res.data || [];

        const userArticles = allArticles.filter((article) => article.artikelUid === user._id);

        const sortedArticles = userArticles.sort((a, b) => (filter === "Terlama" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)));

        setArticles(sortedArticles);
      } catch (err) {
        console.error("Gagal mengambil artikel:", err);
      }
    };

    fetchArticles();
    fetchUser();
  }, [user, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleClick = (id) => {
    navigate(`/artikel/detail-artikel/${id}`);
  };

  const fetchUser = async () => {
    try {
      const detilUser = await axiosInstance.get(`/detil/get/${user._id}`);
      setDetilUser(detilUser.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  return (
    <>
      <Profil />
      <div className="max-w-5xl mx-auto mb-64">
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "artikel-saya" ? (
          <>
            <FilterSection filter={filter} handleFilterChange={handleFilterChange} itemCount={articles.length} />
            <div className="flex px-6 gap-4 flex-wrap justify-center">
              {articles.map((item) => (
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
                  author={detilUser?.namaLengkap}
                  username={`@${user?.username}`}
                  avatarSrc={detilUser?.fotoProfil}
                  handleClick={() => handleClick(item._id)}
                />
              ))}
            </div>
          </>
        ) : (
          <TambahArtikel />
        )}
      </div>
    </>
  );
}

export function Profil() {
  const [detilUser, setDetilUser] = useState(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      fetchDetilUser();
    }
  }, [user]);

  const fetchDetilUser = async () => {
    try {
      const res = await axiosInstance.get(`/detil/get/${user._id}`);
      setDetilUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClick = () => {
    navigate(`/edit-profil`);
  };

  const hasValidProfilePhoto = detilUser?.fotoProfil && typeof detilUser.fotoProfil === "string" && detilUser.fotoProfil.trim() !== "";
  return (
    <>
      <div className="bg-gray-200 rounded-b-[36px] w-full box-border h-fit relative">
        {user?.role === "donatur" ? <img src={donaturSampul} alt="" className="object-cover object-[30%_0%] h-56" /> : <img src={komunitasSampul} alt="" className="object-cover object-[30%_0%] h-56" />}
      </div>
      <div className="max-w-5xl mx-auto pt-4 px-8 flex md:flex-row flex-col justify-between">
        <div className="flex gap-4 md:gap-8">
          {hasValidProfilePhoto ? (
            <img src={detilUser.fotoProfil} alt="profile" className="w-24 h-24 md:w-36 md:h-36 bg-gray-500 border-4 relative md:-top-16 -top-10 border-white rounded-md object-cover" />
          ) : (
            <img src={personProfile} alt="profile" className="w-24 h-24 md:w-36 md:h-36 bg-gray-500 border-4 relative md:-top-16 -top-10 border-white rounded-md object-cover" />
          )}
          <div>
            {user?.namaLengkap ? (
              <>
                <h1 className="text-lg md:text-2xl font-semibold">{user?.namaLengkap}</h1>
                <p className="text-gray-600">{user?.username}</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">{user?.username}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
function TabSelector({ activeTab, setActiveTab }) {
  return (
    <div className="flex px-6 mt-4 font-medium">
      <button className={`px-5 border-b-2 border-0 bg-transparent rounded-none pb-2 ${activeTab === "artikel-saya" ? "text-primary border-primary" : "text-gray-500"}`} onClick={() => setActiveTab("artikel-saya")}>
        Artikel Saya
      </button>
      <button className={`px-5 border-b-2 border-0 bg-transparent rounded-none pb-2 ${activeTab === "tambah-artikel" ? "text-primary border-primary" : "text-gray-500"}`} onClick={() => setActiveTab("tambah-artikel")}>
        Tambah Artikel
      </button>
    </div>
  );
}

function FilterSection({ filter, handleFilterChange, itemCount }) {
  return (
    <div className="px-6 flex justify-between items-center mt-4 mb-8  ">
      <div className="flex items-center gap-2">
        <label htmlFor="filter" className="text-sm">
          Urutkan:
        </label>
        <select id="filter" value={filter} onChange={handleFilterChange} className="border rounded px-2 py-1 text-sm">
          <option value="Terbaru">Terbaru</option>
          <option value="Terlama">Terlama</option>
        </select>
      </div>
    </div>
  );
}
