import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { axiosInstance } from "../../config";
import { UserContext } from "../../context/UserContext";

export default function DetailArtikel() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [artikel, setArtikel] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get(`/artikel/get/${id}`);
        const artikelData = res.data;

        const [userRes, detailRes] = await Promise.all([axiosInstance.get(`/user/get/${artikelData.artikelUid}`), axiosInstance.get(`/detil/get/${artikelData.artikelUid}`)]);

        setArtikel({
          ...artikelData,
          username: userRes.data.username,
          fotoProfil: detailRes.data.fotoProfil,
          namaLengkap: detailRes.data.namaLengkap,
        });
      } catch (error) {
        console.error("Gagal mengambil detail artikel:", error);
      }
    };

    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus artikel ini?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`/artikel/delete/${id}`);
        Swal.fire("Berhasil!", "Artikel telah dihapus.", "success");
        navigate("/artikel");
      } catch (error) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus artikel.", "error");
        console.error("Gagal menghapus artikel:", error);
      }
    }
  };

  if (!artikel) {
    return <div className="text-center mt-20 text-md h-screen">Memuat detail artikel...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-4 px-4">
      {/* <nav className="text-sm md:text-sm text-gray-500 mb-4">
        <div className="flex flex-wrap items-center">
          <Link to="/artikel" className="text-primary hover:underline">
            Artikel
          </Link>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-700">Detail Artikel</span>
        </div>
      </nav> */}


      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-end items-center mb-4">
          {user && artikel.artikelUid == user._id && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg
                hover:bg-red-50 transition-all duration-200 font-medium text-sm shadow-sm
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <FaTrash className="w-4 h-4" />
              <span>Hapus Artikel</span>
            </button>
          )}
        </div>
        <h2 className="text-3xl font-semibold mb-6 mt-0">{artikel.judulArtikel}</h2>
        <img src={artikel.coverUrl} alt="Gambar Artikel" className="w-full rounded-md mb-4 object-cover h-64" />
        <div className="flex items-center justify-between mb-4">
          <Link to={`/view-profil/${artikel.artikelUid}`} className="informasiPengupload flex gap-3 items-center">
            <img src={artikel.fotoProfil} alt={artikel.namaLengkap} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="text-sm font-bold flex items-center">{artikel.namaLengkap}</p>
              <p className="text-xs text-gray-500">@{artikel.username}</p>
            </div>
          </Link>
          <span className="text-sm text-gray-600">
            {new Date(artikel.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>


        <div className="text-gray-800 text-lg leading-relaxed space-y-4 mt-6">
          <p>{artikel.deskArtikel}</p>
        </div>
      </div>
    </div>
  );
}
