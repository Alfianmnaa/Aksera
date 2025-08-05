import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import shareIcon from "../../assets/CardBuku/share.png";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import CardSkleton2 from "./CardSkleton2";
import personProfile from "../../assets/Navbar/personProfile.png";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

export default function DetailBarang() {
  const { user } = useContext(UserContext);
  const [buku, setBuku] = useState();
  const [detilBuku, setDetilBuku] = useState();
  const [dataUser, setDataUser] = useState();
  const [detilUser, setDetilUser] = useState();
  const [komunitasPenerimaUser, setKomunitasPenerimaUser] = useState();
  const [komunitasPenerimaDetil, setKomunitasPenerimaDetil] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const location = useLocation();
  const path = window.location.pathname.split("/")[4];
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const fetchBuku = async () => {
        try {
          const response = await axiosInstance.get(`/buku/get/${path}`);

          setBuku(response.data);
        } catch (err) {
          setError(err.message || "Gagal mengambil data buku");
          navigate("/not-found");
          return;
        } finally {
          setLoading(false);
        }
      };
      fetchBuku();
      fetchDetilBuku();
    }
  }, [path]);

  const fetchDetilBuku = async () => {
    try {
      const response = await axiosInstance.get(`/buku/detil/get/${path}`);
      setDetilBuku(response.data);
    } catch (err) {
      setError(err.message || "Gagal mengambil data detail buku");
    } finally {
      setLoading(false);
    }
  };

  const fetchDataUser = async () => {
    try {
      if (buku?.bukuUid) {
        const response = await axiosInstance.get(`/user/get/${buku.bukuUid}`);
        setDataUser(response.data);
      }
    } catch (err) {
      setError(err.message || "Gagal mengambil data user");
    }
  };

  const fetchDetilUser = async () => {
    try {
      if (buku?.bukuUid) {
        const response = await axiosInstance.get(`/detil/get/${buku.bukuUid}`);
        setDetilUser(response.data);
      }
    } catch (err) {
      setError(err.message || "Gagal mengambil data detail user");
    }
  };

  const fetchKomunitasPenerima = async () => {
    try {
      if (detilBuku?.komunitasPengambilId) {
        const resUser = await axiosInstance.get(
          `/user/get/${detilBuku.komunitasPengambilId}`
        );
        setKomunitasPenerimaUser(resUser.data);
        const resDetil = await axiosInstance.get(
          `/detil/get/${detilBuku.komunitasPengambilId}`
        );
        setKomunitasPenerimaDetil(resDetil.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data komunitas penerima:", err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      axiosInstance.get(`/buku/get/${path}`).then((res) => {
        const buku = res.data;
        setIsSaved(buku.disimpan?.includes(user._id));
      });
    }
  }, [path, user?._id]);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user?._id) return alert("Login terlebih dahulu");

    try {
      await axiosInstance.put(`/buku/toggle-simpan/${path}`, {
        userId: user._id,
      });
      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error("Gagal simpan buku:", error);
    }
  };
  useEffect(() => {
    if (buku) {
      fetchDataUser();
      fetchDetilUser();
    }
  }, [buku]);

  useEffect(() => {
    if (detilBuku?.namaStatus === "disalurkan") {
      fetchKomunitasPenerima();
    }
  }, [detilBuku]);

  if (loading) return <CardSkleton2 />;

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const date = new Date(buku?.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hasValidProfilePhoto =
    detilUser?.fotoProfil &&
    typeof detilUser.fotoProfil === "string" &&
    detilUser.fotoProfil.trim() !== "";

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

  const handleDeleteBuku = async () => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data buku yang sudah dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`/buku/delete/${buku._id}`);
        await Swal.fire("Terhapus!", "Buku telah dihapus.", "success");
        window.location.href = "/buku-saya";
      } catch (err) {
        Swal.fire(
          "Gagal",
          err?.response?.data || "Terjadi kesalahan.",
          "error"
        );
      }
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <nav className="text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Link to="/lihat-buku" className="text-primary hover:underline">
              Lihat buku
            </Link>

            {pathSegments.includes("buku-tersedia") && (
              <>
                <span className="mx-2">{">"}</span>
                <Link
                  to="/lihat-semua-buku?status=tersedia"
                  className="text-primary hover:underline"
                >
                  Buku tersedia
                </Link>
              </>
            )}

            {pathSegments.includes("buku-disalurkan") && (
              <>
                <span className="mx-2">{">"}</span>
                <Link
                  to="/lihat-semua-buku?status=disalurkan"
                  className="text-primary hover:underline"
                >
                  Buku disalurkan
                </Link>
              </>
            )}

            <span className="mx-2">{">"}</span>
            <span className="text-gray-700">Detail Barang</span>
          </div>
        </nav>

        <h1 className="text-3xl font-bold py-4">Detail Barang</h1>

        <div className="p-6 md:p-8 mt-4 rounded-2xl shadow-md border bg-[#f8f8f8]">
          <div className="grid grid-cols-0 md:grid-cols-5 gap-6">
            <img
              src={buku.fotoBarang}
              alt={buku.namaBarang}
              className="w-full md:col-span-2 h-72 bg-gray-300 object-cover rounded-lg"
            />

            <div className="md:col-span-3 relative flex flex-col justify-between pt-6 md:pt-2 md:pb-0">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold">{buku.namaBarang}</h2>
                  <div className="absolute -top-2 sm:static sm:w-fit left-0 flex items-center  justify-between w-full space-x-2">
                    {detilBuku?.namaStatus === "tersedia" ? (
                      <span className="bg-green-200 text-green-800 border-green-950 text-xs font-semibold px-3 py-1 rounded-full">
                        Tersedia
                      </span>
                    ) : (
                      <span className="bg-gray-300 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                        Disalurkan
                      </span>
                    )}
                    <span className="text-sm text-gray-500">{date}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm">{buku.kondisiBarang}</p>

                <div className="space-y-1">
                  <h3 className="font-semibold">Deskripsi:</h3>
                  <p className="text-gray-700 text-sm">{buku.deskripsi}</p>
                </div>
              </div>

              {dataUser && (
                <div className="flex flex-wrap md:flex-col justify-between pt-4 gap-4">
                  <div className="flex items-center md:self-start space-x-3">
                    {hasValidProfilePhoto ? (
                      <img
                        src={detilUser?.fotoProfil}
                        alt={dataUser.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={personProfile}
                        alt="profile"
                        className="p-2 bg-gray-500 bg-opacity-75 w-110 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-sm">
                        {dataUser.username}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {buku.kabupaten + ", " + buku.provinsi}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center md:self-end space-x-3">
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <img src={shareIcon} alt="Share" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSave}
                      className="p-1 rounded-full hover:bg-gray-100"
                      aria-label="Simpan"
                    >
                      {isSaved ? (
                        <BsBookmarkFill className="w-5 h-5 text-primary" />
                      ) : (
                        <BsBookmark className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {user &&
                user?._id === buku?.bukuUid &&
                detilBuku?.namaStatus === "tersedia" && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleDeleteBuku}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-full shadow-md transition"
                    >
                      Hapus Buku
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {detilBuku?.namaStatus === "disalurkan" &&
          komunitasPenerimaUser &&
          komunitasPenerimaDetil && (
            <div className="mt-8 p-4 border rounded-xl bg-green-50">
              <h3 className="text-lg font-semibold mb-4">
                Telah diterima oleh:
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={komunitasPenerimaDetil.fotoProfil}
                  alt={komunitasPenerimaUser.username}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <p className="text-md font-bold">
                    {komunitasPenerimaDetil.namaLengkap}
                  </p>
                  <p className="text-gray-600 text-sm">
                    @{komunitasPenerimaUser.username}
                  </p>
                </div>
              </div>
            </div>
          )}

        {user?.role === "komunitas" && detilBuku?.namaStatus === "tersedia" && (
          <AjukanPermohonan
            detilBuku={detilBuku}
            userId={user._id}
            bukuId={detilBuku._id}
          />
        )}
      </div>
    </>
  );
}

function AjukanPermohonan({ detilBuku, userId, bukuId }) {
  const [sudahMengajukan, setSudahMengajukan] = useState(false);
  const [tujuan, setTujuan] = useState("");

  useEffect(() => {
    const isAlreadySubmitted = detilBuku?.permohonan?.some(
      (p) => p.pemohonId === userId
    );
    setSudahMengajukan(isAlreadySubmitted);
  }, [detilBukui, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tujuan.trim()) {
      return Swal.fire(
        "Gagal",
        "Tujuan permohonan tidak boleh kosong.",
        "warning"
      );
    }

    try {
      await axiosInstance.post(`/buku/detil/permohonan/${bukuId}`, {
        pemohonId: userId,
        tujuanPermohonan: tujuan,
      });

      Swal.fire("Berhasil!", "Permohonan Anda telah dikirim.", "success");
      setSudahMengajukan(true);
    } catch (err) {
      Swal.fire("Gagal", err?.response?.data || "Terjadi kesalahan.", "error");
    }
  };

  if (sudahMengajukan) {
    return (
      <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-md">
        <p className="font-semibold">
          ✅ Anda sudah mengajukan permohonan untuk buku ini.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="w-full md:w-1/2">
        <label className="block font-bold text-lg mb-2">Permohonan Buku</label>
        <textarea
          placeholder="Tuliskan alasan atau kebutuhan permohonan Anda"
          value={tujuan}
          onChange={(e) => setTujuan(e.target.value)}
          className="w-full block border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-full shadow-md transition"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
}
