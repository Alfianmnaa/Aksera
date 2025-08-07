import React, { useCallback, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../config";
import { UserContext } from "../context/UserContext";
import { Profil } from "./DonasiSaya";
import { Link, useNavigate } from "react-router-dom";
import CardDonasi from "../components/LihatDonasi/CardDonasi";
import { CardSkleton } from "../components/LihatDonasi/CardSkleton";

export default function PermohonanSaya() {
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [activeTab, setActiveTab] = useState("donasi");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDetil = await axiosInstance.get("/donasi/detil/getall");
        const allDetil = resDetil.data;

        const permohonansSaya = allDetil
          .map((detil) => {
            const permohonanUser = detil.permohonan?.find((p) => p.pemohonId === user._id);
            return permohonanUser ? { detil, permohonanUser } : null;
          })
          .filter(Boolean);

        const donasiPromises = permohonansSaya.map((p) => axiosInstance.get(`/donasi/get/${p.detil.donasiId}`));
        const donasiResponses = await Promise.all(donasiPromises);

        const userPromises = donasiResponses.map((res) => {
          const donasi = res.data;
          return axiosInstance.get(`/user/get/${donasi.donasiUid}`);
        });
        const userResponses = await Promise.all(userPromises);

        const finalItems = donasiResponses.map((res, idx) => {
          const donasi = res.data;
          const pemilik = userResponses[idx].data;
          const { detil } = permohonansSaya[idx];

          let statusIcon = "";

          if (detil.namaStatus === "tersedia") {
            statusIcon = "waiting";
          } else if (detil.namaStatus === "disalurkan") {
            if (detil.komunitasPengambilId === user._id) {
              statusIcon = "accepted";
            } else {
              statusIcon = "rejected";
            }
          }

          return {
            no: idx + 1,
            pemilik: pemilik.username,
            barang: donasi.namaBarang,
            idBarang: detil.donasiId,
            status: statusIcon,
            createdAt: detil.createdAt || donasi.createdAt || null,
          };
        });

        setItems(finalItems);
      } catch (error) {
        console.error("Gagal mengambil data permohonan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) fetchData();
  }, [user?._id]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredAndSortedItems = [...items]
    .filter(item => {
      if (filter === "Semua") return true;
      return item.status === filter.toLowerCase();
    })
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <>
      <Profil />
      <div className="max-w-5xl md:px-0 px-4 mx-auto mb-64">
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "donasi" ? (
          <>
            <FilterSection 
              filter={filter} 
              handleFilterChange={handleFilterChange} 
              itemCount={items.filter(item => item.status === "waiting").length} 
            />
            <ListPermohonan items={filteredAndSortedItems} isLoading={isLoading} />
          </>
        ) : (
          <Disimpan />
        )}
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
            activeTab === "donasi" ? "translate-x-1" : "translate-x-full"
          } w-[calc(50%-2px)] bg-white rounded-md shadow-md left-[0px]`}
        />
        <button
          onClick={() => setActiveTab("donasi")}
          className={`flex-1 py-2 px-4 rounded-md md:text-sm text-xs font-medium transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
            activeTab === "donasi" 
              ? "text-primary transform scale-105" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/>
          </svg>
          Permohonan Saya
        </button>
        <button
          onClick={() => setActiveTab("disimpan")}
          className={`flex-1 py-2 px-4 rounded-md md:text-sm text-xs font-medium transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
            activeTab === "disimpan" 
              ? "text-primary transform scale-105" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
          Disimpan
        </button>
      </div>
    </div>
  );
}

function FilterSection({ filter, handleFilterChange, itemCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const pendingRequests = itemCount || 0;

  const filterOptions = [
    { value: 'Semua', icon: 'list', label: 'Semua' },
    { value: 'waiting', icon: 'clock', label: 'Menunggu' },
    { value: 'accepted', icon: 'check', label: 'Diterima' },
    { value: 'rejected', icon: 'x', label: 'Ditolak' }
  ];

  const handleOptionClick = (value) => {
    handleFilterChange({ target: { value } });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-3 sm:px-6 mb-6 gap-4 sm:gap-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Permohonan Saya</h2>
        {pendingRequests > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full self-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span className="text-sm text-yellow-800">{pendingRequests} menunggu</span>
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
          <span className="flex-1 text-center text-sm">{filterOptions.find(opt => opt.value === filter)?.label || filter}</span>
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
            <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2
                    ${filter === option.value ? 'text-primary bg-primary/5 font-medium' : 'text-gray-700'}
                    transition-colors duration-150`}
                >
                  {filter === option.value && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  <span className={filter === option.value ? 'ml-0' : 'ml-6'}>{option.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusIcon({ status }) {
  switch (status) {
    case "waiting":
      return <span className="text-xl">⏳</span>;
    case "accepted":
      return <span className="text-xl text-green-600">✅</span>;
    case "rejected":
      return <span className="text-xl text-red-500">❌</span>;
    default:
      return null;
  }
}

function ListPermohonan({ items, isLoading }) {
  const formattedDate = (createdAt) => {
    if (!createdAt) return "-";
    return new Date(createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden md:mx-6 mx-0">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">No</th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Pemilik Donasi</th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Nama Barang</th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Tanggal</th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-2 sm:px-4"><div className="h-4 bg-gray-200 rounded w-4"></div></td>
                  <td className="py-4 px-2 sm:px-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="py-4 px-2 sm:px-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                  <td className="py-4 px-2 sm:px-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                  <td className="py-4 px-2 sm:px-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Permohonan</h3>
          <p className="text-gray-600">Anda belum mengajukan permohonan donasi apapun.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden md:mx-6 mx-0">
      <div className="overflow-x-auto min-w-full">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">No</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Pemilik Donasi</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Nama Barang</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Tanggal</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.map((item, index) => (
              <tr key={item.no} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{index + 1}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 font-medium whitespace-nowrap">{item.pemilik}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                  <Link 
                    to={`/lihat-donasi/donasi-tersedia/detail-barang/${item.idBarang}`} 
                    className="text-primary hover:text-primary/80 text-xs sm:text-sm font-medium hover:underline"
                  >
                    {item.barang}
                  </Link>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{formattedDate(item.createdAt)}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  switch (status) {
    case "waiting":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          Menunggu
        </span>
      );
    case "accepted":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          Diterima
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          Ditolak
        </span>
      );
    default:
      return null;
  }
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
