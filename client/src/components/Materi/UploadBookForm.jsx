import React, { useState, useContext, useRef } from "react";
import { axiosInstance } from "../../config";
import upload from "../../utils/upload"; // Pastikan path ini benar
import { UserContext } from "../../context/UserContext"; // Pastikan path ini benar
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS Toastify
import { FiUploadCloud, FiBookOpen, FiFileText, FiUser, FiHash, FiEdit3 } from "react-icons/fi"; // Ikon dari Lucide React
import { FaChevronDown } from "react-icons/fa";

const FilePreview = ({ file, onClear, type }) => (
  <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between text-sm text-gray-700 border border-blue-200">
    <div className="flex items-center">
      {type === "image" ? <img src={file.previewUrl} alt="Preview" className="h-8 w-8 object-cover rounded-md mr-2" /> : <FiFileText className="h-5 w-5 mr-2 text-[#045394]" />}
      <span className="font-semibold truncate max-w-[150px]">{file.name}</span>
    </div>
    <button type="button" onClick={onClear} className="text-red-500 hover:text-red-700 text-xs font-semibold ml-2 transition-colors duration-200">
      Hapus
    </button>
  </div>
);

function UploadBookForm({ onUploadSuccess }) {
  const { user } = useContext(UserContext);
  const [judul, setJudul] = useState("");
  const [sampul, setSampul] = useState(null);
  const [filePdf, setFilePdf] = useState(null);
  const [penerbit, setPenerbit] = useState("");
  const [isbn, setIsbn] = useState("");
  const [edisi, setEdisi] = useState("");
  const [penulis, setPenulis] = useState("");
  const [kategori, setKategori] = useState("");
  const [loading, setLoading] = useState(false);

  const sampulInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleSampulChange = (file) => {
    if (sampul && sampul.previewUrl) {
      URL.revokeObjectURL(sampul.previewUrl);
    }
    if (file) {
      setSampul({ file, previewUrl: URL.createObjectURL(file), name: file.name });
    } else {
      setSampul(null);
    }
  };

  const handlePdfChange = (file) => {
    if (file) {
      setFilePdf({ file, name: file.name });
    } else {
      setFilePdf(null);
    }
  };

  const createDragHandlers = (setFileHandler, allowedMimeType, errorMessage) => ({
    handleDragOver: (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.add("border-[#045394]", "bg-blue-50");
    },
    handleDragLeave: (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove("border-[#045394]", "bg-blue-50");
    },
    handleDrop: (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove("border-[#045394]", "bg-blue-50");

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (typeof allowedMimeType === "string" && file.type === allowedMimeType) {
          setFileHandler(file);
        } else if (Array.isArray(allowedMimeType) && allowedMimeType.includes(file.type)) {
          setFileHandler(file);
        } else if (typeof allowedMimeType === "function" && allowedMimeType(file.type)) {
          setFileHandler(file);
        } else {
          toast.error(errorMessage);
        }
      }
    },
  });

  const {
    handleDragOver: handleDragOverSampul,
    handleDragLeave: handleDragLeaveSampul,
    handleDrop: handleDropSampul,
  } = createDragHandlers(handleSampulChange, (type) => type.startsWith("image/"), "Hanya file gambar (JPEG, PNG) yang diizinkan untuk sampul.");

  const { handleDragOver: handleDragOverPdf, handleDragLeave: handleDragLeavePdf, handleDrop: handleDropPdf } = createDragHandlers(handlePdfChange, "application/pdf", "Hanya file PDF yang diizinkan untuk materi.");

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
      const coverImageUrl = await upload(sampul.file);
      const pdfUrl = await upload(filePdf.file);

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

      // Reset form
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
    <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-lg w-full">
      <h3 className="text-2xl font-bold text-[#045394] mb-8 flex items-center justify-center">
        <FiUploadCloud className="h-7 w-7 mr-3 text-blue-600" />
        Unggah Buku Baru
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Judul Buku */}
        <div>
          <label htmlFor="judul-buku" className="block text-sm font-medium text-gray-700 mb-2">
            Judul Buku <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="judul-buku"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Ketikkan Judul Buku"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#045394] focus:border-transparent sm:text-sm transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
            Kategori <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              id="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#045394] focus:border-transparent sm:text-sm appearance-none transition-all duration-200"
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              <option value="SD/MI">SD/MI</option>
              <option value="SMP/MTs">SMP/MTs</option>
              <option value="SMA/MA">SMA/MA</option>
              <option value="Umum">Umum</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Upload Sampul */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Sampul Buku <span className="text-red-500">*</span>
          </label>
          <label
            htmlFor="sampul-buku"
            className="mt-1 flex flex-col items-center justify-center px-6 pt-6 pb-7 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition-all duration-200 hover:border-[#045394] hover:bg-blue-50"
            onDragOver={handleDragOverSampul}
            onDragLeave={handleDragLeaveSampul}
            onDrop={handleDropSampul}
          >
            <div className="space-y-2 text-center">
              {sampul ? (
                <img src={sampul.previewUrl} alt="Sampul Preview" className="mx-auto h-28 w-auto object-contain rounded-md mb-2 shadow-md" />
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
                <p className="font-medium text-[#045394] hover:text-blue-700">Unggah file</p>
                <p className="pl-1">atau seret dan lepas</p>
              </div>
              <p className="text-xs text-gray-500">JPEG, JPG, PNG (maks 5MB)</p>
            </div>
          </label>
          <input id="sampul-buku" name="sampul-buku" type="file" ref={sampulInputRef} className="sr-only" onChange={(e) => handleSampulChange(e.target.files[0])} accept="image/jpeg, image/png" required />
          {sampul && <FilePreview file={sampul} onClear={() => handleSampulChange(null)} type="image" />}
        </div>

        {/* Upload PDF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File PDF <span className="text-red-500">*</span>
          </label>
          <label
            htmlFor="file-pdf"
            className="mt-1 flex flex-col items-center justify-center px-6 pt-6 pb-7 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition-all duration-200 hover:border-[#045394] hover:bg-blue-50"
            onDragOver={handleDragOverPdf}
            onDragLeave={handleDragLeavePdf}
            onDrop={handleDropPdf}
          >
            <div className="space-y-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <p className="font-medium text-[#045394] hover:text-blue-700">Unggah file</p>
                <p className="pl-1">atau seret dan lepas</p>
              </div>
              <p className="text-xs text-gray-500">Hanya file PDF</p>
            </div>
          </label>
          <input id="file-pdf" name="file-pdf" type="file" ref={pdfInputRef} className="sr-only" onChange={(e) => handlePdfChange(e.target.files[0])} accept=".pdf" required />
          {filePdf && <FilePreview file={filePdf} onClear={() => handlePdfChange(null)} type="pdf" />}
        </div>

        {/* Penerbit */}
        <div>
          <label htmlFor="penerbit" className="block text-sm font-medium text-gray-700 mb-2">
            Penerbit
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="penerbit"
              value={penerbit}
              onChange={(e) => setPenerbit(e.target.value)}
              placeholder="Ketikkan Penerbit"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#045394] focus:border-transparent sm:text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
            Judul ISBN
          </label>
          <div className="relative">
            <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Ketikkan Judul ISBN"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#045394] focus:border-transparent sm:text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Edisi */}
        <div>
          <label htmlFor="edisi" className="block text-sm font-medium text-gray-700 mb-2">
            Edisi
          </label>
          <div className="relative">
            <FiEdit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="edisi"
              value={edisi}
              onChange={(e) => setEdisi(e.target.value)}
              placeholder="Ketikkan Edisi Buku"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#045394] focus:border-transparent sm:text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Penulis */}
        <div>
          <label htmlFor="penulis" className="block text-sm font-medium text-gray-700 mb-2">
            Penulis <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="penulis"
              value={penulis}
              onChange={(e) => setPenulis(e.target.value)}
              placeholder="Ketikkan Penulis Buku"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#045394] focus:border-transparent sm:text-sm transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center py-3 px-8 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-[#045394] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#045394] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Mengunggah..." : "Kirim Materi"}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default UploadBookForm;
