import React, { useState, useContext, useRef } from "react";
import { axiosInstance } from "../../config";
import upload from "../../utils/upload";
import { UserContext } from "../../context/UserContext";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

const FilePreview = ({ file, onClear }) => (
  <div className="mt-2 text-sm text-center">
    <p className="font-semibold truncate">{file.name}</p>
    <button type="button" onClick={onClear} className="text-red-500 hover:text-red-700 text-xs">
      Hapus
    </button>
  </div>
);

function UploadBookForm({ onUploadSuccess }) {
  const { user } = useContext(UserContext);
  const [judul, setJudul] = useState("");
  const [sampul, setSampul] = useState(null);
  const [sampulPreviewUrl, setSampulPreviewUrl] = useState(null);
  const [filePdf, setFilePdf] = useState(null);
  const [filePdfPreview, setFilePdfPreview] = useState(null);
  const [penerbit, setPenerbit] = useState("");
  const [isbn, setIsbn] = useState("");
  const [edisi, setEdisi] = useState("");
  const [penulis, setPenulis] = useState("");
  const [kategori, setKategori] = useState("");
  const [loading, setLoading] = useState(false);

  const sampulInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleSampulChange = (file) => {
    if (sampulPreviewUrl) {
      URL.revokeObjectURL(sampulPreviewUrl);
    }
    if (file) {
      setSampul(file);
      setSampulPreviewUrl(URL.createObjectURL(file));
    } else {
      setSampul(null);
      setSampulPreviewUrl(null);
    }
  };

  const handlePdfChange = (file) => {
    if (file) {
      setFilePdf(file);
      setFilePdfPreview({ name: file.name });
    } else {
      setFilePdf(null);
      setFilePdfPreview(null);
    }
  };

  const handleDragOverSampul = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("border-teal-500", "bg-gray-50");
  };

  const handleDragLeaveSampul = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-teal-500", "bg-gray-50");
  };

  const handleDropSampul = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-teal-500", "bg-gray-50");

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleSampulChange(file);
      } else {
        toast.error("Hanya file gambar (JPEG, PNG) yang diizinkan untuk sampul.");
      }
    }
  };

  const handleDragOverPdf = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("border-teal-500", "bg-gray-50");
  };

  const handleDragLeavePdf = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-teal-500", "bg-gray-50");
  };

  const handleDropPdf = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-teal-500", "bg-gray-50");

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        handlePdfChange(file);
      } else {
        toast.error("Hanya file PDF yang diizinkan untuk materi.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!judul || !sampul || !filePdf || !penulis || !kategori) {
      toast.warn("Harap lengkapi semua bidang yang wajib diisi!");
      return;
    }

    if (!user?._id) {
      toast.error("Anda harus login untuk mengunggah materi.");
      return;
    }

    setLoading(true);
    Swal.fire({
      title: "Mengunggah Materi...",
      text: "Mohon tunggu, materi Anda sedang diproses.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const coverImageUrl = await upload(sampul);
      const pdfUrl = await upload(filePdf);

      const formDataToSend = {
        materiUid: user._id,
        coverMateri: coverImageUrl,
        judulMateri: judul,
        linkMateri: pdfUrl,
        kategori: kategori,
        penerbit: penerbit,
        judulISBN: isbn,
        edisi: edisi,
        penulis: penulis,
        statusMateri: "belum terverifikasi",
        disimpan: [],
      };

      const res = await axiosInstance.post("/materi/create", formDataToSend);

      toast.success("Materi Anda berhasil diunggah dan menunggu verifikasi admin.");

      setJudul("");
      handleSampulChange(null);
      handlePdfChange(null);
      setPenerbit("");
      setIsbn("");
      setEdisi("");
      setPenulis("");
      setKategori("");

      if (onUploadSuccess) {
        onUploadSuccess(res.data.materi);
      }
    } catch (error) {
      console.error("Gagal mengunggah materi:", error);
      toast.error("Terjadi kesalahan saat mengunggah materi. Silakan coba lagi.");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Upload Buku
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Judul Buku */}
        <div>
          <label htmlFor="judul-buku" className="block text-sm font-medium text-gray-700 mb-1">
            Judul Buku <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="judul-buku"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Ketikkan Judul Buku"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="" disabled>
              Pilih Kategori
            </option>
            <option value="SD/MI">SD/MI</option>
            <option value="SMP/MTs">SMP/MTs</option>
            <option value="SMA/MA">SMA/MA</option>
            <option value="Umum">Umum</option>
          </select>
        </div>

        {/* Upload Sampul */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Sampul Buku <span className="text-red-500">*</span>
          </label>

          <label
            htmlFor="sampul-buku"
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer transition-all duration-200 hover:border-teal-500 hover:bg-gray-50"
            onDragOver={handleDragOverSampul}
            onDragLeave={handleDragLeaveSampul}
            onDrop={handleDropSampul}
          >
            <div className="space-y-1 text-center">
              {sampulPreviewUrl ? (
                <img src={sampulPreviewUrl} alt="Sampul Preview" className="mx-auto h-32 w-auto object-contain rounded-md mb-2" />
              ) : (
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <div className="flex text-sm text-gray-600 justify-center">
                <p className="font-medium text-teal-600 hover:text-teal-500">Upload a file</p>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">JPEG, JPG, PNG (maks 5MB)</p>
            </div>
          </label>
          <input id="sampul-buku" name="sampul-buku" type="file" ref={sampulInputRef} className="sr-only" onChange={(e) => handleSampulChange(e.target.files[0])} accept="image/jpeg, image/png" required />
          {sampul && <FilePreview file={sampul} onClear={() => handleSampulChange(null)} />}
        </div>

        {/* Upload PDF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload File PDF <span className="text-red-500">*</span>
          </label>

          <label
            htmlFor="file-pdf"
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer transition-all duration-200 hover:border-teal-500 hover:bg-gray-50"
            onDragOver={handleDragOverPdf}
            onDragLeave={handleDragLeavePdf}
            onDrop={handleDropPdf}
          >
            <div className="space-y-1 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <p>Upload a file or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">Hanya file PDF</p>
            </div>
          </label>
          <input id="file-pdf" name="file-pdf" type="file" ref={pdfInputRef} className="sr-only" onChange={(e) => handlePdfChange(e.target.files[0])} accept=".pdf" required />
          {filePdfPreview && <FilePreview file={filePdfPreview} onClear={() => handlePdfChange(null)} />}
        </div>

        {/* Penerbit */}
        <div>
          <label htmlFor="penerbit" className="block text-sm font-medium text-gray-700 mb-1">
            Penerbit
          </label>
          <input
            type="text"
            id="penerbit"
            value={penerbit}
            onChange={(e) => setPenerbit(e.target.value)}
            placeholder="Ketikkan Penerbit"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
            Judul ISBN
          </label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Ketikkan Judul ISBN"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* Edisi */}
        <div>
          <label htmlFor="edisi" className="block text-sm font-medium text-gray-700 mb-1">
            Edisi
          </label>
          <input
            type="text"
            id="edisi"
            value={edisi}
            onChange={(e) => setEdisi(e.target.value)}
            placeholder="Ketikkan Edisi Buku"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* Penulis */}
        <div>
          <label htmlFor="penulis" className="block text-sm font-medium text-gray-700 mb-1">
            Penulis <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="penulis"
            value={penulis}
            onChange={(e) => setPenulis(e.target.value)}
            placeholder="Ketikkan Penulis Buku"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Mengunggah..." : "Kirim"}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default UploadBookForm;
