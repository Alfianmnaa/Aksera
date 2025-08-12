import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../config";
import { UserContext } from "../context/UserContext";
import shareIcon from "../assets/CardDonasi/share.png";
import donaturSampul from "../assets/DonasiSaya/donaturSampul.png";
import komunitasSampul from "../assets/DonasiSaya/komunitasSampul.png";
import editProfilButton from "../assets/PermohonanSaya/editProfilButton.png";
import personProfile from "../assets/Navbar/personProfile.png";
import { CardSkleton } from "../components/LihatDonasi/CardSkleton";
import CardDonasi from "../components/LihatDonasi/CardDonasi";

export default function DonasiSaya() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [activeTab, setActiveTab] = useState("donasi");
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    const fetchDonasiUser = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/donasi/getall");
        const allDonasi = res.data || [];

        const donasiSaya = allDonasi.filter((donasi) => donasi.donasiUid === user._id);

        const dataGabungan = await Promise.all(
          donasiSaya.map(async (donasi) => {
            try {
              const { data: detilDonasi } = await axiosInstance.get(`/donasi/detil/get/${donasi._id}`);
              const { data: detilPemilik } = await axiosInstance.get(`/detil/get/${donasi.donasiUid}`);

              return {
                id: donasi._id,
                title: donasi.namaBarang,
                kategoriBarang: donasi.kategori,
                jenisBarang: donasi.kondisiBarang,
                status: detilDonasi.namaStatus,
                jumlahRequest: detilDonasi.permohonan?.length || 0,
                tujuanRequest: detilDonasi.permohonan?.map((req) => req.namaKomunitas),
                date: new Date(donasi.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
                description: donasi.deskripsi,
                author: user.username,
                location: `${donasi.kabupaten}, ${donasi.provinsi}`,
                imageSrc: donasi.fotoBarang,
                avatarSrc: detilPemilik?.fotoProfil,
                createdAt: new Date(donasi.createdAt),
              };
            } catch (err) {
              console.warn("Gagal ambil detil donasi:", err);
              return null;
            }
          })
        );

        const hasilValid = dataGabungan.filter(Boolean);

        const filtered = hasilValid.sort((a, b) => b.createdAt - a.createdAt);
        setDonations(filtered);
      } catch (err) {
        console.error("Gagal ambil data donasi saya:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonasiUser();
  }, [user, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <Profil />
      <div className="max-w-5xl mx-auto mb-64 ">
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "donasi" ? (
          <>
            <FilterSection filter={filter} handleFilterChange={handleFilterChange} itemCount={donations.filter((item) => item.status === "tersedia").length} />
            <div className="px-4 flex gap-4 flex-wrap sm:justify-start justify-center">
              {loading && (
                <div className="flex flex-wrap justify-start gap-4">
                  {Array(6)
                    .fill(null)
                    .map((_, idx) => (
                      <CardSkleton key={idx} />
                    ))}
                </div>
              )}

              {!loading && donations.length === 0 && <p>Tidak ada donasi ditemukan.</p>}
              {donations
                ?.filter((item) => (filter === "Semua" ? true : item.status === filter))
                ?.map((item) => (
                  <CardDonasiSaya key={item.id} {...item} />
                ))}
            </div>
          </>
        ) : (
          <Disimpan />
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
      console.log(error);
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
        {/* <button className="border hidden md:block self-end h-fit rounded-full text-sm" onClick={handleClick}>
          <img src={editProfilButton} alt="Edit Profil" className="w-32" />
        </button> */}
      </div>
    </>
  );
}

function TabSelector({ activeTab, setActiveTab }) {
  return (
    <div className="px-6 mt-4 mb-12">
      <div className="flex bg-gray-100 rounded-lg p-1 relative max-w-md">
        <div className={`absolute top-1 bottom-1 transition-transform duration-300 ease-in-out transform ${activeTab === "donasi" ? "translate-x-1" : "translate-x-full"} w-[calc(50%-2px)] bg-white rounded-md shadow-md left-[0px]`} />
        <button
          onClick={() => setActiveTab("donasi")}
          className={`flex-1 py-2 px-4 rounded-md md:text-sm text-xs font-medium transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
            activeTab === "donasi" ? "text-primary transform scale-105" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
          </svg>
          Donasi Saya
        </button>
        <button
          onClick={() => setActiveTab("disimpan")}
          className={`flex-1 py-2 px-4 rounded-md md:text-sm text-xs font-medium transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
            activeTab === "disimpan" ? "text-primary transform scale-105" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
          Disimpan
        </button>
      </div>
    </div>
  );
}

function FilterSection({ filter, handleFilterChange, itemCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const pendingDonations = itemCount || 0;

  const filterOptions = [
    { value: "Semua", icon: "list", label: "Semua" },
    { value: "tersedia", icon: "clock", label: "Menunggu" },
    { value: "disalurkan", icon: "check", label: "Disalurkan" },
  ];

  const handleOptionClick = (value) => {
    handleFilterChange({ target: { value } });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-3 sm:px-6 mb-6 gap-4 sm:gap-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Donasi Saya</h2>
        {pendingDonations > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full self-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-sm text-yellow-800">{pendingDonations} menunggu</span>
          </div>
        )}
      </div>

      <div className="relative w-full sm:w-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm w-full sm:w-auto
            hover:border-gray-400 transition-all duration-200 cursor-pointer min-w-[160px]
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span className="flex-1 text-center text-sm">{filterOptions.find((opt) => opt.value === filter)?.label || filter}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 bg-transparent" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2
                    ${filter === option.value ? "text-primary bg-primary/5 font-medium" : "text-gray-700"}
                    transition-colors duration-150`}
                >
                  {filter === option.value && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span className={filter === option.value ? "ml-0" : "ml-6"}>{option.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CardDonasiSaya({ id, title, kategoriBarang, jenisBarang, status, jumlahRequest, date, description, author, location, imageSrc, avatarSrc }) {
  const navigate = useNavigate();
  const isLongText = description.length > 100;
  const displayText = isLongText ? description.slice(0, 100) + "..." : description;

  const handleClick = () => {
    navigate(`detail-donasi/${id}`);
  };

  const handleShare = (e) => {
    e.stopPropagation(); // agar tidak trigger klik ke detail

    const baseUrl = window.location.href;
    const urlToShare = `${baseUrl}/${id}`;
    if (navigator.share) {
      navigator
        .share({
          url: urlToShare,
        })
        .then(() => console.log("Berhasil berbagi"))
        .catch((error) => console.error("Error berbagi:", error));
    } else {
      console.log("Fungsi share tidak didukung di browser ini.");
    }
  };
  return (
    <div onClick={handleClick} className="rounded-[28px] shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)] border-1 p-4 w-full max-w-xs bg-white flex flex-col cursor-pointer hover:shadow-[0px_0px_10px_2px_rgba(0,0,0,0.15)] transition">
      <span className={`w-fit self-end mb-2 -mt-2 text-xs font-semibold px-3 py-1 rounded-full ${status === "tersedia" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
        {status === "tersedia" ? "Menunggu" : "Disalurkan"}
      </span>
      <div className="h-36 bg-gray-200 rounded-lg mb-4 overflow-hidden">
        <img src={imageSrc} alt="donasi" className="object-cover w-full h-full" />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between">
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-gray-400 mt-1">{date}</div>
        </div>
        <div className="text-xs text-gray-500">{jenisBarang}</div>
        <p className="text-sm text-gray-700 mt-2">
          {displayText}
          {isLongText && <span className="text-blue-500 ml-1">(Baca Selengkapnya)</span>}
        </p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <img src={avatarSrc} alt="author" className="w-8 h-8 rounded-full object-cover mr-2" />
          <div>
            <div className="text-sm font-medium">{author}</div>
            <div className="text-xs text-gray-500">{location}</div>
          </div>
        </div>
        <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100">
          <img src={shareIcon} alt="Share" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Disimpan() {
  const [dataDisimpan, setDataDisimpan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchDonasiDisimpan = useCallback(async () => {
    if (!user?._id) return;

    try {
      const { data: savedList } = await axiosInstance.get(`/donasi/saved/${user._id}`);

      const detailList = await Promise.all(
        savedList.map(async (item) => {
          try {
            const [detilDonasi, pemilik, detilPemilik] = await Promise.all([axiosInstance.get(`/donasi/detil/get/${item._id}`), axiosInstance.get(`/user/get/${item.donasiUid}`), axiosInstance.get(`/detil/get/${item.donasiUid}`)]);

            return {
              id: item._id,
              title: item.namaBarang,
              kategoriBarang: item.kategori,
              jenisBarang: item.kondisiBarang,
              status: detilDonasi.data.namaStatus,
              date: new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              description: item.deskripsi,
              author: pemilik?.data?.username || "Anonymous",
              location: `${item.kabupaten}, ${item.provinsi}`,
              imageSrc: item?.fotoBarang || null,
              avatarSrc: detilPemilik?.data?.fotoProfil || null,
            };
          } catch (err) {
            console.warn("Gagal ambil detail salah satu donasi disimpan:", err);
            return null;
          }
        })
      );

      setDataDisimpan(detailList.filter(Boolean));
    } catch (err) {
      console.error("Gagal mengambil daftar donasi yang disimpan:", err);
      setError("Gagal mengambil data. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDonasiDisimpan();
  }, [fetchDonasiDisimpan, dataDisimpan]);

  const handleClick = (id) => {
    navigate(`/lihat-donasi/donasi-tersedia/detail-barang/${id}`);
  };

  return (
    <div className="mt-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Donasi yang Disimpan</h2>

      {loading && (
        <div className="flex flex-wrap justify-center gap-4">
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <CardSkleton key={idx} />
            ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
      {!loading && dataDisimpan.length === 0 && <p>Tidak ada donasi yang disimpan.</p>}

      <div className="flex gap-4 flex-wrap justify-center">
        {dataDisimpan.map((item) => (
          <div key={item.id} className="w-full sm:w-[48%] md:w-[31%] flex justify-center">
            <CardDonasi {...item} handleClick={() => handleClick(item.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
