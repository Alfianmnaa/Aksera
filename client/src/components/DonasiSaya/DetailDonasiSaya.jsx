import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import whatsappIcon from "../../assets/DonasiSaya/whatsapp.png";
import shareIcon from "../../assets/CardDonasi/share.png";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";
import CardSkleton2 from "../LihatDonasi/CardSkleton2";
import { UserContext } from "../../context/UserContext";

export default function DetailDonasiSaya() {
  const { user } = useContext(UserContext);
  const [donasi, setDonasi] = useState(null);
  const [detilDonasi, setDetilDonasi] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const [detilUser, setDetilUser] = useState(null);
  const [listKomunitas, setListKomunitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const path = window.location.pathname.split("/")[3];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDonasi = await axiosInstance.get(`/donasi/get/${path}`);
        setDonasi(resDonasi.data);

        const resDetilDonasi = await axiosInstance.get(`/donasi/detil/get/${path}`);
        setDetilDonasi(resDetilDonasi.data);

        const uid = resDonasi.data.donasiUid;
        const resUser = await axiosInstance.get(`/user/get/${uid}`);
        setDataUser(resUser.data);

        const resDetilUser = await axiosInstance.get(`/detil/get/${uid}`);
        setDetilUser(resDetilUser.data);

        if (resDetilDonasi.data.permohonan?.length > 0) {
          const komunitasData = await Promise.all(
            resDetilDonasi.data.permohonan.map(async (permohonan) => {
              const res = await axiosInstance.get(`/detil/get/${permohonan.pemohonId}`);
              return res.data;
            })
          );
          setListKomunitas(komunitasData);
        }
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    if (path) {
      fetchData();
    }
  }, [path]);

  const handleDeleteDonasi = async () => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data donasi yang sudah dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`/donasi/delete/${donasi._id}`);
        await Swal.fire("Terhapus!", "Donasi telah dihapus.", "success");
        window.location.href = "/donasi-saya"; // arahkan ke halaman donasi user
      } catch (err) {
        Swal.fire("Gagal", err?.response?.data || "Terjadi kesalahan.", "error");
      }
    }
  };

  if (loading) return <CardSkleton2 />;
  if (error) return <div className="text-center mt-20 text-md h-screen text-red-500">{error}</div>;

  const date = new Date(donasi?.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleShare = () => {
    const baseUrl = window.location.href;
    const urlToShare = `${baseUrl}`;
    if (navigator.share) {
      navigator
        .share({
          url: urlToShare,
        })
        .catch((error) => console.error("Error berbagi:", error));
    } else {
      alert("Fungsi share tidak didukung di browser ini.");
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 mb-64">
      <nav className="text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <Link to="/donasi-saya" className="text-blue-500 hover:underline">
            Donasi Saya
          </Link>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-700">Detail Donasi</span>
        </div>
      </nav>

      <h1 className="text-3xl font-bold py-4">Detail Donasi</h1>

      <div className="p-6 mt-4 rounded-2xl shadow-md border bg-gray-100">
        <div className="grid grid-cols-0 md:grid-cols-3 gap-4">
          <img src={donasi?.fotoBarang} alt={donasi?.namaBarang} className="w-full h-72 object-cover rounded-lg" />
          <div className="md:col-span-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold">{donasi?.namaBarang}</h2>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">{detilDonasi?.permohonan?.length || 0} Permintaan</span>
                  <span className="text-sm text-gray-500">{date}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{donasi?.kondisiBarang}</p>
              <div className="space-y-1">
                <h3 className="font-semibold">Deskripsi:</h3>
                <p className="text-gray-700 text-sm">{donasi?.deskripsi}</p>
              </div>
            </div>

            {dataUser && (
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-3">
                  <img src={detilUser?.fotoProfil || null} alt={dataUser.username} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm">{dataUser.username}</p>
                    <p className="text-gray-500 text-xs">{donasi.kabupaten + ", " + donasi.provinsi}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100">
                    <img src={shareIcon} alt="Share" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            {user && user?._id === donasi?.donasiUid && detilDonasi?.namaStatus === "tersedia" && (
              <div className="mt-6 flex justify-end">
                <button onClick={handleDeleteDonasi} className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-full shadow-md transition">
                  Hapus Donasi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ListKomunitas items={listKomunitas} permohonan={detilDonasi?.permohonan} detilDonasi={detilDonasi} donasiId={detilDonasi?._id} />
    </div>
  );
}

function ListKomunitas({ items, permohonan, detilDonasi, donasiId }) {
  const getTujuanPermohonan = (pemohonId) => {
    const found = permohonan?.find((p) => p.pemohonId === pemohonId);
    return found?.tujuanPermohonan || "-";
  };
  const handleTerima = async (pemohonId) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Yakin ingin menerima komunitas ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Terima",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(`/donasi/detil/update/${donasiId}`, {
          ...detilDonasi,
          komunitasPengambilId: pemohonId,
          namaStatus: "disalurkan",
        });

        Swal.fire({
          title: "Berhasil!",
          text: "Donasi telah disalurkan.",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat memperbarui data.",
          icon: "error",
        });
        console.error(error);
      }
    }
  };

  return (
    <>
      <p className="font-semibold underline pb-6 pt-8">List Komunitas</p>
      <div className="overflow-x-auto border  border-primary rounded-md">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-primary text-white border-2 border-primary">
            <tr>
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama Komunitas</th>
              <th className="p-2 border">Tujuan Request</th>
              <th className="p-2 border">Kontak</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Tidak ada permintaan dari komunitas.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index + 1} className="text-center border-t-primary border-t">
                  <td className="p-2 border-r-primary border-r">{index + 1}</td>
                  <td className="p-2 border-r-primary border-r">
                    <Link to={`/view-profil/${item.detilUid}`} className="text-blue-500 hover:underline flex items-center justify-center">
                      {item.namaLengkap}
                    </Link>
                  </td>
                  <td className="p-2 border-r-primary border-r">
                    <div
                      className="flex justify-center items-center h-full"
                      onClick={() =>
                        Swal.fire({
                          title: "Tujuan Permohonan",
                          text: getTujuanPermohonan(item.detilUid),
                          icon: "info",
                        })
                      }
                    >
                      <svg width="79" height="30" viewBox="0 0 79 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="78" height="29" rx="4.5" fill="#205781" fillOpacity="0.25" stroke="#205781" />
                        <path
                          d="M19.05 21V10.2H22.4325C22.5325 10.2 22.7175 10.2025 22.9875 10.2075C23.2625 10.2125 23.525 10.2325 23.775 10.2675C24.62 10.3725 25.33 10.675 25.905 11.175C26.485 11.675 26.9225 12.31 27.2175 13.08C27.5125 13.845 27.66 14.685 27.66 15.6C27.66 16.52 27.5125 17.365 27.2175 18.135C26.9225 18.9 26.485 19.5325 25.905 20.0325C25.33 20.5275 24.62 20.8275 23.775 20.9325C23.525 20.9675 23.2625 20.9875 22.9875 20.9925C22.7175 20.9975 22.5325 21 22.4325 21H19.05ZM20.655 19.5075H22.4325C22.6025 19.5075 22.805 19.5025 23.04 19.4925C23.275 19.4825 23.4825 19.4625 23.6625 19.4325C24.2125 19.3275 24.6575 19.09 24.9975 18.72C25.3425 18.345 25.595 17.885 25.755 17.34C25.915 16.795 25.995 16.215 25.995 15.6C25.995 14.965 25.9125 14.3775 25.7475 13.8375C25.5825 13.2925 25.3275 12.8375 24.9825 12.4725C24.6425 12.1025 24.2025 11.8675 23.6625 11.7675C23.4825 11.7325 23.2725 11.7125 23.0325 11.7075C22.7975 11.6975 22.5975 11.6925 22.4325 11.6925H20.655V19.5075ZM32.9989 21.225C32.1939 21.225 31.4864 21.05 30.8764 20.7C30.2714 20.345 29.7989 19.8525 29.4589 19.2225C29.1239 18.5875 28.9564 17.8525 28.9564 17.0175C28.9564 16.1325 29.1214 15.365 29.4514 14.715C29.7864 14.065 30.2514 13.5625 30.8464 13.2075C31.4414 12.8525 32.1339 12.675 32.9239 12.675C33.7489 12.675 34.4514 12.8675 35.0314 13.2525C35.6114 13.6325 36.0439 14.175 36.3289 14.88C36.6189 15.585 36.7339 16.4225 36.6739 17.3925H35.1064V16.8225C35.0964 15.8825 34.9164 15.1875 34.5664 14.7375C34.2214 14.2875 33.6939 14.0625 32.9839 14.0625C32.1989 14.0625 31.6089 14.31 31.2139 14.805C30.8189 15.3 30.6214 16.015 30.6214 16.95C30.6214 17.84 30.8189 18.53 31.2139 19.02C31.6089 19.505 32.1789 19.7475 32.9239 19.7475C33.4139 19.7475 33.8364 19.6375 34.1914 19.4175C34.5514 19.1925 34.8314 18.8725 35.0314 18.4575L36.5689 18.945C36.2539 19.67 35.7764 20.2325 35.1364 20.6325C34.4964 21.0275 33.7839 21.225 32.9989 21.225ZM30.1114 17.3925V16.17H35.8939V17.3925H30.1114ZM42.9916 21C42.4816 21.1 41.9816 21.1425 41.4916 21.1275C41.0016 21.1125 40.5641 21.0175 40.1791 20.8425C39.7941 20.6675 39.5041 20.3925 39.3091 20.0175C39.1341 19.6825 39.0391 19.3425 39.0241 18.9975C39.0141 18.6475 39.0091 18.2525 39.0091 17.8125V10.65H40.5841V17.7375C40.5841 18.0625 40.5866 18.345 40.5916 18.585C40.6016 18.825 40.6541 19.0275 40.7491 19.1925C40.9291 19.5025 41.2141 19.68 41.6041 19.725C41.9991 19.765 42.4616 19.7475 42.9916 19.6725V21ZM37.4566 14.16V12.9H42.9916V14.16H37.4566ZM46.9869 21.225C46.3869 21.225 45.8844 21.115 45.4794 20.895C45.0744 20.67 44.7669 20.375 44.5569 20.01C44.3519 19.64 44.2494 19.235 44.2494 18.795C44.2494 18.385 44.3219 18.025 44.4669 17.715C44.6119 17.405 44.8269 17.1425 45.1119 16.9275C45.3969 16.7075 45.7469 16.53 46.1619 16.395C46.5219 16.29 46.9294 16.1975 47.3844 16.1175C47.8394 16.0375 48.3169 15.9625 48.8169 15.8925C49.3219 15.8225 49.8219 15.7525 50.3169 15.6825L49.7469 15.9975C49.7569 15.3625 49.6219 14.8925 49.3419 14.5875C49.0669 14.2775 48.5919 14.1225 47.9169 14.1225C47.4919 14.1225 47.1019 14.2225 46.7469 14.4225C46.3919 14.6175 46.1444 14.9425 46.0044 15.3975L44.5419 14.9475C44.7419 14.2525 45.1219 13.7 45.6819 13.29C46.2469 12.88 46.9969 12.675 47.9319 12.675C48.6569 12.675 49.2869 12.8 49.8219 13.05C50.3619 13.295 50.7569 13.685 51.0069 14.22C51.1369 14.485 51.2169 14.765 51.2469 15.06C51.2769 15.355 51.2919 15.6725 51.2919 16.0125V21H49.9044V19.1475L50.1744 19.3875C49.8394 20.0075 49.4119 20.47 48.8919 20.775C48.3769 21.075 47.7419 21.225 46.9869 21.225ZM47.2644 19.9425C47.7094 19.9425 48.0919 19.865 48.4119 19.71C48.7319 19.55 48.9894 19.3475 49.1844 19.1025C49.3794 18.8575 49.5069 18.6025 49.5669 18.3375C49.6519 18.0975 49.6994 17.8275 49.7094 17.5275C49.7244 17.2275 49.7319 16.9875 49.7319 16.8075L50.2419 16.995C49.7469 17.07 49.2969 17.1375 48.8919 17.1975C48.4869 17.2575 48.1194 17.3175 47.7894 17.3775C47.4644 17.4325 47.1744 17.5 46.9194 17.58C46.7044 17.655 46.5119 17.745 46.3419 17.85C46.1769 17.955 46.0444 18.0825 45.9444 18.2325C45.8494 18.3825 45.8019 18.565 45.8019 18.78C45.8019 18.99 45.8544 19.185 45.9594 19.365C46.0644 19.54 46.2244 19.68 46.4394 19.785C46.6544 19.89 46.9294 19.9425 47.2644 19.9425ZM53.3895 11.5725V10.05H54.957V11.5725H53.3895ZM53.3895 21V12.9H54.957V21H53.3895ZM57.3592 21V9.975H58.9267V21H57.3592Z"
                          fill="#205781"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className=" p-2 border-r-primary border-r">
                    <a href={`https://wa.me/${item.noWa}`} target="_blank" rel="noopener noreferrer">
                      <img src={whatsappIcon} alt="Whatsapp" className="w-6 h-6 mx-auto" />
                    </a>
                  </td>
                  <td className="p-2 px-8">
                    {detilDonasi?.komunitasPengambilId ? (
                      detilDonasi.komunitasPengambilId === item.detilUid ? (
                        <span title="Diterima" className="text-green-600 text-xl">
                          ✅
                        </span>
                      ) : (
                        <span title="Tidak Diterima" className="text-red-600 text-xl">
                          ❌
                        </span>
                      )
                    ) : (
                      <button onClick={() => handleTerima(item.detilUid)} className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-800 transition">
                        Terima
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
