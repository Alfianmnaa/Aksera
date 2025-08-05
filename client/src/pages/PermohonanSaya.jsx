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
  const [filter, setFilter] = useState("Terbaru");
  const [activeTab, setActiveTab] = useState("donasi");

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
      }
    };

    if (user?._id) fetchData();
  }, [user?._id]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return filter === "Terbaru" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <>
      <Profil />
      <div className="max-w-5xl md:px-0 px-4 mx-auto mb-64">
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "donasi" ? (
          <>
            <FilterSection filter={filter} handleFilterChange={handleFilterChange} itemCount={items.length} />
            <ListPermohonan items={sortedItems} />
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
    <div className="flex  mt-4 font-medium">
      <button className={` px-5 border-b-2 md:text-md text-sm border-0 bg-transparent rounded-none pb-2 ${activeTab === "donasi" ? "text-primary border-primary" : "text-gray-500"}`} onClick={() => setActiveTab("donasi")}>
        Permohonan Saya
      </button>
      <button className={`px-5 border-b-2 md:text-md text-sm border-0 bg-transparent rounded-none pb-2 ${activeTab === "disimpan" ? "text-primary border-primary" : "text-gray-500"}`} onClick={() => setActiveTab("disimpan")}>
        Disimpan
      </button>
    </div>
  );
}

function FilterSection({ filter, handleFilterChange, itemCount }) {
  return (
    <div className="flex justify-between items-center mt-6 mb-4">
      <div className="flex items-center gap-2">
        <label htmlFor="filter" className="text-sm">
          Urutkan:
        </label>
        <select id="filter" value={filter} onChange={handleFilterChange} className="border rounded px-2 py-1 text-sm">
          <option value="Terbaru">Terbaru</option>
          <option value="Terlama">Terlama</option>
        </select>
      </div>
      <div className="font-semibold px-8 text-center">
        Total Donasi
        <p className="text-sm">
          <span className="text-primary text-2xl px-1">{itemCount}</span> Barang
        </p>
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

function ListPermohonan({ items }) {
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
  return (
    <div className="overflow-x-auto border border-primary rounded-md">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-primary text-white border-2 border-primary">
          <tr>
            <th className="p-2 border">No</th>
            <th className="p-2 border">Pemilik Donasi</th>
            <th className="p-2 border">Nama Barang</th>
            <th className="p-2 border">Tanggal Permintaan</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.no} className="text-center border-t-primary border-t">
              <td className="p-2 border-r-primary border-r">{index + 1}</td>
              <td className="p-2 border-r-primary border-r">{item.pemilik}</td>
              <td className="p-2 border-r-primary border-r">
                <Link to={`/lihat-donasi/donasi-tersedia/detail-barang/${item.idBarang}`} className="text-blue-500 hover:underline">
                  {item.barang}
                </Link>
              </td>
              <td className="p-2 border-r-primary border-r">{formattedDate(item.createdAt)}</td>
              <td className="p-2">
                <StatusIcon status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
