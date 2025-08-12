import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import whatsappIcon from "../../assets/DonasiSaya/whatsapp.png";
import shareIcon from "../../assets/CardDonasi/share.png";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";
import CardSkleton2 from "../LihatDonasi/CardSkleton2";
import { UserContext } from "../../context/UserContext";
import personProfile from "../../assets/Navbar/personProfile.png"; // Pastikan path ini benar

export default function DetailDonasiSaya() {
  const { user } = useContext(UserContext);
  const [donasi, setDonasi] = useState(null);
  const [detilDonasi, setDetilDonasi] = useState(null);
  const [dataUser, setDataUser] = useState(null); // Data user donatur
  const [detilUser, setDetilUser] = useState(null); // Detail user donatur
  const [listKomunitas, setListKomunitas] = useState([]); // List komunitas yang mengajukan permohonan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const path = window.location.pathname.split("/")[3]; // Ambil ID donasi dari URL

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Donasi
        const resDonasi = await axiosInstance.get(`/donasi/get/${path}`);
        setDonasi(resDonasi.data);

        // Fetch Detil Donasi
        const resDetilDonasi = await axiosInstance.get(`/donasi/detil/get/${path}`);
        setDetilDonasi(resDetilDonasi.data);

        // Fetch Data User Donatur (pemilik donasi)
        const uid = resDonasi.data.donasiUid;
        if (uid) {
          const resUser = await axiosInstance.get(`/user/get/${uid}`);
          setDataUser(resUser.data);

          const resDetilUser = await axiosInstance.get(`/detil/get/${uid}`);
          setDetilUser(resDetilUser.data);
        }

        // Fetch List Komunitas yang Mengajukan Permohonan
        if (resDetilDonasi.data.permohonan?.length > 0) {
          const komunitasDataPromises = resDetilDonasi.data.permohonan.map(async (permohonan) => {
            try {
              // Pastikan pemohonId dikonversi ke string untuk URL
              const res = await axiosInstance.get(`/detil/get/${String(permohonan.pemohonId)}`);
              return res.data; // Mengembalikan data komunitas
            } catch (innerErr) {
              console.error(`Error fetching detail for pemohonId ${permohonan.pemohonId}:`, innerErr);
              return null; // Mengembalikan null jika ada error pada satu permohonan
            }
          });
          const fetchedKomunitasData = await Promise.all(komunitasDataPromises);
          // Filter out any null values from the array before setting the state
          setListKomunitas(fetchedKomunitasData.filter((item) => item !== null));
        } else {
          setListKomunitas([]); // Pastikan listKomunitas kosong jika tidak ada permohonan
        }
      } catch (err) {
        console.error("Error fetching data in DetailDonasiSaya:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    if (path) {
      fetchData();
    }
  }, [path]); // Dependensi path agar data di-fetch ulang jika ID berubah

  const handleDeleteDonasi = async () => {
    const confirmResult = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data donasi yang sudah dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axiosInstance.delete(`/donasi/delete/${donasi._id}`);
        await Swal.fire("Terhapus!", "Donasi telah dihapus.", "success");
        window.location.href = "/donasi-saya"; // arahkan ke halaman donasi user
      } catch (err) {
        console.error("Error deleting donasi:", err);
        Swal.fire("Gagal", err?.response?.data?.message || "Terjadi kesalahan saat menghapus donasi.", "error");
      }
    }
  };

  if (loading) return <CardSkleton2 />;
  if (error) return <div className="text-center mt-20 text-md h-screen text-red-500">{error}</div>;
  if (!donasi) return <div className="text-center mt-20 text-md h-screen text-gray-500">Donasi tidak ditemukan.</div>;

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
      Swal.fire("Informasi", "Fungsi share tidak didukung di browser ini. Anda bisa menyalin URL secara manual.", "info");
    }
  };

  const hasValidProfilePhotoDonatur = detilUser?.fotoProfil && typeof detilUser.fotoProfil === "string" && detilUser.fotoProfil.trim() !== "";

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pastikan src gambar donasi tidak kosong */}
          <img src={donasi?.fotoBarang || "https://placehold.co/400x300/e0e0e0/ffffff?text=No+Image"} alt={donasi?.namaBarang} className="w-full h-72 object-cover rounded-lg" />
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
                  {hasValidProfilePhotoDonatur ? (
                    <img src={detilUser?.fotoProfil} alt={dataUser.username} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <img src={personProfile} alt="profile" className="p-2 bg-gray-500 bg-opacity-75 w-10 h-10 rounded-full object-cover" />
                  )}
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

      {/* Komponen ListKomunitas */}
      {detilDonasi &&
        donasi && ( // Pastikan detilDonasi dan donasi ada sebelum merender ListKomunitas
          <ListKomunitas
            items={listKomunitas}
            permohonan={detilDonasi.permohonan}
            detilDonasi={detilDonasi}
            donasiId={detilDonasi._id}
            donaturNoWa={detilUser?.noWa} // Kirim nomor WA donatur
          />
        )}
    </div>
  );
}

// Komponen ListKomunitas
function ListKomunitas({ items, permohonan, detilDonasi, donasiId, donaturNoWa }) {
  const getTujuanPermohonan = (pemohonId) => {
    // Konversi pemohonId ke string untuk perbandingan
    const found = permohonan?.find((p) => String(p.pemohonId) === String(pemohonId));
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
        await axiosInstance.put(`/donasi/detil/update/${String(donasiId)}`, {
          // Konversi donasiId ke string
          namaStatus: "disalurkan",
          komunitasPengambilId: String(pemohonId), // <-- PENTING: Konversi pemohonId ke string
        });

        Swal.fire({
          title: "Berhasil!",
          text: "Donasi telah disalurkan.",
          icon: "success",
        }).then(() => {
          window.location.reload(); // Reload halaman untuk memuat data terbaru
        });
      } catch (error) {
        console.error("Error accepting community:", error);
        Swal.fire({
          title: "Gagal!",
          text: error?.response?.data?.message || "Terjadi kesalahan saat memperbarui data.",
          icon: "error",
        });
      }
    }
  };

  // State isSubmitting didefinisikan di sini
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="mt-8">
      <div className="rounded-lg border bg-white shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Komunitas yang Mengajukan</h3>
            <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{items.length} Permohonan</div>
          </div>

          {items.length === 0 ? (
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Permohonan</h3>
              <p className="text-gray-600">Belum ada komunitas yang mengajukan permohonan untuk donasi ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(
                (item, index) =>
                  // Tambahkan pengecekan null untuk 'item' di sini
                  item && (
                    <div key={item.detilUid}>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {/* Pastikan src gambar profil tidak kosong */}
                            <img
                              src={item.fotoProfil || personProfile} // Fallback ke personProfile jika fotoProfil tidak ada
                              alt={item.namaLengkap}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Link to={`/view-profil/${String(item.detilUid)}`} className="font-semibold text-gray-900 hover:text-primary">
                                {" "}
                                {/* Konversi detilUid ke string */}
                                {item.namaLengkap}
                              </Link>
                            </div>
                            <div className="bg-white p-3 rounded border mt-3">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 mb-1">Alasan Permohonan:</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">{getTujuanPermohonan(item.detilUid)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center mt-3">
                              {item.noWa && ( // Hanya tampilkan jika noWa ada
                                <a href={`https://wa.me/${item.noWa}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm">
                                  <img src={whatsappIcon} alt="Whatsapp" className="w-4 h-4" />
                                  <span>Hubungi WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="sm:w-32">
                          {/* Konversi komunitasPengambilId dan item.detilUid ke string untuk perbandingan */}
                          {detilDonasi?.komunitasPengambilId ? (
                            String(detilDonasi.komunitasPengambilId) === String(item.detilUid) ? (
                              <div className="flex items-center gap-1 text-green-600 font-medium">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Diterima</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Ditolak</span>
                              </div>
                            )
                          ) : (
                            <button onClick={() => handleTerima(item.detilUid)} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full shadow-sm transition">
                              Terima
                            </button>
                          )}
                        </div>
                      </div>
                      {index < items.length - 1 && <div className="h-px bg-gray-200 my-4" />}
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
