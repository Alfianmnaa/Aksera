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
    <div className="p-0 my-10 px-6  ">
      <h2 className="text-xl font-semibold mb-4">Buat Artikel Baru</h2>
      <form onSubmit={handleSubmit} className="border rounded-lg p-6 space-y-4 shadow-sm bg-white">
        <div>
          <label className="block font-medium mb-1">Judul Artikel:</label>
          <input type="text" placeholder="Masukkan judul artikel" className="w-full border rounded px-3 py-2" value={formData.judulArtikel} onChange={(e) => setFormData((prev) => ({ ...prev, judulArtikel: e.target.value }))} required />
        </div>

        <div>
          <label className="block font-medium mb-1">Isi Artikel:</label>
          <textarea
            placeholder="Masukkan isi artikel"
            className="w-full border rounded px-3 py-2 h-32 resize-none"
            value={formData.deskArtikel}
            onChange={(e) => setFormData((prev) => ({ ...prev, deskArtikel: e.target.value }))}
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Foto Artikel:</label>
          <div className="flex gap-4 flex-wrap items-start">
            {preview && <img src={preview} alt="Preview" className="w-36 h-36 object-cover border rounded" />}
            <div className="flex flex-col">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFotoChange} />
                <span className="px-3 py-1 text-sm bg-gray-100 border rounded hover:bg-gray-200">Pilih Foto ✎</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">Maks. ukuran 2MB. Format: .jpg, .jpeg, .png</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => navigate("/artikel")} className="px-5 py-3 border-primary border rounded text-primary hover:bg-gray-100 md:text-base text-sm">
            Batal
          </button>
          <button type="submit" className="bg-primary text-white md:text-base text-sm px-5 py-3 rounded hover:bg-primary-700">
            Simpan Artikel
          </button>
        </div>
      </form>
    </div>
  );
}
