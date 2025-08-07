import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../config";
import { UserContext } from "../context/UserContext";
import TambahArtikel from "../components/ArtikelSaya/TambahArtikel";
import komunitasSampul from "../assets/DonasiSaya/komunitasSampul.png";
import personProfile from "../assets/Navbar/personProfile.png";
import { CardSkleton } from "../components/LihatDonasi/CardSkleton";

import CardArtikel from "../components/Artikel/CardArtikel";

export default function ArtikelSaya() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState("Terbaru");
  const [detilUser, setDetilUser] = useState();
  const [activeTab, setActiveTab] = useState("artikel-saya");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/artikel/getall");
        const allArticles = res.data || [];

        const userArticles = allArticles.filter((article) => article.artikelUid === user._id);

        const sortedArticles = userArticles.sort((a, b) => (filter === "Terlama" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)));

        setArticles(sortedArticles);
      } catch (err) {
        console.error("Gagal mengambil artikel:", err);
      } finally {
        setLoading(false);
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
            <div className="px-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6)
                    .fill(null)
                    .map((_, idx) => (
                      <CardSkleton key={idx} />
                    ))}
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada artikel</h3>
                  <p className="text-gray-600">Mulai menulis artikel pertama Anda</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              )}
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
    <div className="px-6 mt-4 mb-12">
      <div className="flex bg-gray-100 rounded-lg p-1 relative max-w-md">
        <div
          className={`absolute top-1 bottom-1 transition-transform duration-300 ease-in-out transform ${
            activeTab === "artikel-saya" ? "translate-x-1" : "translate-x-full"
          } w-[calc(50%-2px)] bg-white rounded-md shadow-md left-[0px]`}
        />
        <button
          onClick={() => setActiveTab("artikel-saya")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
            activeTab === "artikel-saya" 
              ? "text-primary transform scale-105" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
          Artikel Saya
        </button>
        <button
          onClick={() => setActiveTab("tambah-artikel")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
            activeTab === "tambah-artikel" 
              ? "text-primary transform scale-105" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          Tambah Artikel
        </button>
      </div>
    </div>
  );
}

function FilterSection({ filter, handleFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    handleFilterChange({ target: { value } });
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between w-full px-6 mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Artikel Saya</h2>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm
            hover:border-gray-400 transition-all duration-200 cursor-pointer min-w-[160px]
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span className="flex-1 text-center text-sm">{filter}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-transparent" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50
              animate-in fade-in duration-200 slide-in-from-top-1"
            >
              {['Terbaru', 'Terlama', 'Populer'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2
                    ${filter === option ? 'text-primary bg-primary/5 font-medium' : 'text-gray-700'}
                    transition-colors duration-150`}
                >
                  {filter === option && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                  <span className={filter === option ? 'ml-0' : 'ml-6'}>{option}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
