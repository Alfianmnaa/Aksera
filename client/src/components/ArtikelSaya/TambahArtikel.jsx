import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";
import { UserContext } from "../../context/UserContext";
import upload from "../../utils/upload";
import Swal from "sweetalert2";

export default function TambahArtikel() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    artikelUid: user?._id || "",
    judulArtikel: "",
    deskArtikel: "",
    coverUrl: "",
    foto: null,
  });

  const [preview, setPreview] = useState(null);

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, foto: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: "Menyimpan...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let fotoUrl = "";
      if (formData.foto) {
        fotoUrl = await upload(formData.foto);
      }

      const payload = {
        artikelUid: formData.artikelUid,
        judulArtikel: formData.judulArtikel,
        deskArtikel: formData.deskArtikel,
        coverUrl: fotoUrl,
      };

      await axiosInstance.post("/artikel/create", payload);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Artikel berhasil ditambahkan",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/artikel");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menambahkan artikel",
      });
      console.error("Gagal submit artikel:", error);
    }
  };

  return (
    <div className="p-0 my-10 px-6">
      <h2 className="text-xl font-semibold mb-4">Buat Artikel Baru</h2>
      <div className="border rounded-lg shadow-sm bg-white">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Judul Artikel *
            </label>
            <input
              id="title"
              type="text"
              placeholder="Masukkan judul artikel"
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.judulArtikel}
              onChange={(e) => setFormData((prev) => ({ ...prev, judulArtikel: e.target.value }))}
              required
            />
          </div>

          {/* Article Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Foto Artikel</label>
            {preview ? (
              <div className="relative">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setFormData(prev => ({ ...prev, foto: null }));
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">Upload foto artikel</p>
                  <p className="text-sm text-gray-600">PNG, JPG hingga 2MB</p>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFotoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Isi Artikel *
            </label>
            <textarea
              id="content"
              placeholder="Tulis konten artikel Anda di sini..."
              className="w-full px-4 py-2 min-h-[400px] border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.deskArtikel}
              onChange={(e) => setFormData((prev) => ({ ...prev, deskArtikel: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-500">{formData.deskArtikel.length} karakter</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            {/* <button
              type="button"
              onClick={() => navigate("/artikel-saya")}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Batal
            </button> */}
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-700 font-medium inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
