import React, { useContext, useState } from "react";
import sendIcon from "../../assets/UploadDonasi/send.png"; // Ganti path sesuai proyek Anda
import addPhotoIcon from "../../assets/UploadDonasi/addPhoto.png"; // Ganti path sesuai proyek Anda
import { axiosInstance } from "../../config";
import uploadFileToCloudinary from "../../utils/uploadbook"; // Re-use fungsi upload yang sudah disesuaikan
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";

export default function FormUploadMateri({ onUploadSuccess }) {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    materiUid: user?._id,
    judulMateri: "",
    deskripsi: "",
    kategori: "",
  });
  const [pdfFile, setPdfFile] = useState(null); // State untuk file PDF
  const [coverFile, setCoverFile] = useState(null); // State untuk file Cover
  const [pdfFilePreview, setPdfFilePreview] = useState(null);
  const [coverFilePreview, setCoverFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePdfFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPdfFile(selectedFile);
      setPdfFilePreview({
        url: URL.createObjectURL(selectedFile),
        name: selectedFile.name,
        type: selectedFile.type,
      });
    }
  };

  const handleCoverFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setCoverFile(selectedFile);
      setCoverFilePreview({
        url: URL.createObjectURL(selectedFile),
        name: selectedFile.name,
        type: selectedFile.type,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judulMateri || !formData.deskripsi || !formData.kategori || !pdfFile || !coverFile) {
      Swal.fire("Peringatan!", "Harap lengkapi semua data, unggah file PDF, dan unggah cover materi.", "warning");
      return;
    }

    try {
      setIsUploading(true);
      Swal.fire({
        title: "Mengunggah...",
        text: "Materi sedang diproses, mohon tunggu.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Unggah file PDF ke Cloudinary
      const pdfUrl = await uploadFileToCloudinary(pdfFile);
      // Unggah file Cover ke Cloudinary
      const coverUrl = await uploadFileToCloudinary(coverFile);

      // Siapkan data untuk dikirim ke backend
      const formToSend = {
        ...formData,
        linkMateri: pdfUrl, // URL dari Cloudinary untuk PDF
        coverMateri: coverUrl, // URL dari Cloudinary untuk Cover
        materiUid: user._id,
      };

      // Kirim data ke API
      await axiosInstance.post("/materi/create", formToSend);

      Swal.fire("Berhasil!", "Materi berhasil diunggah.", "success");
      // Reset form
      setFormData({
        materiUid: user?._id,
        judulMateri: "",
        deskripsi: "",
        kategori: "",
      });
      setPdfFile(null);
      setCoverFile(null);
      setPdfFilePreview(null);
      setCoverFilePreview(null);
      setIsUploading(false);
      onUploadSuccess(); // Panggil fungsi untuk memuat ulang data di halaman utama
    } catch (error) {
      console.error("Gagal mengunggah materi:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengunggah materi. Silakan coba lagi.", "error");
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4 text-center">Unggah Materi Baru</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Judul Materi */}
        <div>
          <label className="block font-semibold text-sm mb-1">Judul Materi</label>
          <input type="text" name="judulMateri" value={formData.judulMateri} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Contoh: Panduan Berwirausaha Islami" />
        </div>

        {/* Input Deskripsi */}
        <div>
          <label className="block font-semibold text-sm mb-1">Deskripsi</label>
          <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="w-full p-2 border rounded" rows="3" placeholder="Jelaskan isi materi secara singkat..."></textarea>
        </div>

        {/* Input Kategori */}
        <div>
          <label className="block font-semibold text-sm mb-1">Kategori</label>
          <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Pilih Kategori</option>
            <option value="Tafsir">Tafsir</option>
            <option value="Aqidah">Aqidah</option>
            <option value="Fiqh">Fiqh</option>
            <option value="Sirah Nabawiyah">Sirah Nabawiyah</option>
            <option value="Kewirausahaan">Kewirausahaan</option>
          </select>
        </div>

        {/* Input File PDF */}
        <div>
          <label className="block font-semibold text-sm mb-1">Unggah File PDF</label>
          <label htmlFor="upload-pdf" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition">
            {pdfFilePreview ? (
              <div className="flex flex-col items-center">
                <p className="text-xl mb-2">📄</p>
                <p className="text-sm font-medium text-gray-700">File terpilih: {pdfFilePreview.name}</p>
              </div>
            ) : (
              <>
                <img src={addPhotoIcon} alt="upload icon" className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium text-gray-700">Klik untuk memilih file</p>
                <p className="text-xs text-gray-500">Hanya file PDF</p>
              </>
            )}
          </label>
          <input id="upload-pdf" type="file" accept=".pdf" onChange={handlePdfFileChange} className="hidden" />
        </div>

        {/* Input File Cover Materi */}
        <div>
          <label className="block font-semibold text-sm mb-1">Unggah Cover Materi (Gambar)</label>
          <label htmlFor="upload-cover" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition">
            {coverFilePreview ? (
              <div className="mt-4 text-sm text-gray-700 w-full">
                <div className="w-full flex justify-center">
                  <img src={coverFilePreview.url} alt="Cover Preview" className="w-full max-h-[150px] object-contain rounded border" />
                </div>
                <p className="mt-2 text-gray-600 text-center text-sm">Nama file: {coverFilePreview.name}</p>
              </div>
            ) : (
              <>
                <img src={addPhotoIcon} alt="upload icon" className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium text-gray-700">Klik untuk memilih gambar cover</p>
                <p className="text-xs text-gray-500">JPEG, JPG, PNG, WEBP</p>
              </>
            )}
          </label>
          <input id="upload-cover" type="file" accept=".jpeg,.jpg,.png,.webp" onChange={handleCoverFileChange} className="hidden" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isUploading} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full flex gap-2 items-center disabled:opacity-50">
            Unggah <img src={sendIcon} className="w-4" alt="" />
          </button>
        </div>
      </form>
    </div>
  );
}
