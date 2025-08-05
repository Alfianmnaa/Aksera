import React, { useContext, useEffect, useState } from "react";
import addPhotoIcon from "../../assets/UploadDonasi/addPhoto.png";
import sendIcon from "../../assets/UploadDonasi/send.png";
import { axiosInstance } from "../../config";
import { v4 as uuidv4 } from "uuid";
import upload from "../../utils/upload";
import Indonesia from "./dataProvinsi";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaChevronDown } from "react-icons/fa";
import "../../App.css";

export default function FormUpload() {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    donasiUid: user?._id,
    namaBarang: "",
    fotoBarang: "", // akan diisi URL string
    provinsi: "",
    kabupaten: "",
    deskripsi: "",
    kategori: "",
    kondisiBarang: "",
    disimpan: [],
  });
  const [kabupatenOptions, setKabupatenOptions] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [dropdowns, setDropdowns] = useState({
    provinsi: false,
    kabupaten: false,
    kategori: false,
    kondisiBarang: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      setFormData((prevData) => ({
        ...prevData,
        donasiUid: user._id,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "provinsi") {
      const selectedProvince = Indonesia.find((provinsi) => provinsi.namaProvinsi === value);
      setKabupatenOptions(selectedProvince ? selectedProvince.kabupatenKota : []);
      setFormData((prevData) => ({
        ...prevData,
        kabupaten: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prevData) => ({
      ...prevData,
      fotoBarang: file,
    }));
    setFile(file);
    setFilePreview({
      url: URL.createObjectURL(file),
      name: file.name,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Anda Belum Login",
        text: "Silakan login terlebih dahulu untuk dapat mengirim donasi.",
        confirmButtonText: "Login Sekarang",
        showCancelButton: true,
        cancelButtonText: "Nanti Saja"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/masuk");
        }
      });
      return; 
    }
    if (user?.role === "komunitas") {
      Swal.fire({
        icon: "warning",
        title: "Akses Ditolak",
        text: "Maaf, komunitas tidak bisa berdonasi.",
      }).then(() => {
        navigate("/lihat-donasi");
      });
    }

    if (!formData.namaBarang || !file || !formData.kategori || !formData.kondisiBarang || !formData.deskripsi || !formData.provinsi || !formData.kabupaten) {
      Swal.fire("Peringatan!", "Harap lengkapi semua informasi sebelum mengirim donasi", "warning");
      return;
    }

    try {
      Swal.fire({
        title: "Mengirim...",
        text: "Mohon tunggu, donasi Anda sedang diproses.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const imageUrl = await upload(file);

      const formToSend = {
        ...formData,
        fotoBarang: imageUrl,
      };

      await axiosInstance.post("/donasi/create", formToSend);

      Swal.fire("Berhasil!", "Donasi Anda telah berhasil dikirim.", "success").then(() => {
        navigate("/lihat-donasi");
      });
    } catch (error) {
      console.error("Gagal mengirim donasi:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengirim donasi. Silakan coba lagi.", "error");
    }
  };

  const toggleDropdown = (name) => {
    setDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const selectOption = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setDropdowns({ ...dropdowns, [field]: false });
  };

  return (
    <div className="max-w-3xl mx-auto px-8 sm:px-6 md:px-16 py-10 sm:py-16 mb-16 rounded-xl sm:rounded-2xl shadow-md sm:shadow-[0px_0px_6px_2px_rgba(0,0,0,0.12)]">
      <h2 className="text-xl sm:text-2xl text-center text-primary font-semibold mb-8 sm:mb-12">Silakan Isi Form Donasi Barang secara Detail</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-sm sm:text-base mb-2">Nama Barang</label>
          <input type="text" name="namaBarang" value={formData.namaBarang} onChange={handleChange} placeholder="Ketikkan Nama Barang" className="w-full p-4 border-2 border-gray-300 rounded-lg outline-none text-sm sm:text-base" />
        </div>

        <div>
          <label className="block font-semibold text-sm sm:text-base mb-2">Upload Foto</label>
          <label htmlFor="upload-foto">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition">
              {filePreview ? (
                <div className="mt-4 text-sm text-gray-700 w-full">
                  {formData.fotoBarang?.type.startsWith("image/") ? (
                    <div className="w-full flex justify-center">
                      <img src={filePreview.url} alt="Preview" className="w-full max-h-[200px] object-cover rounded border" />
                    </div>
                  ) : (
                    <p className="italic">Tidak dapat menampilkan pratinjau untuk file ini</p>
                  )}
                  <p className="mt-2 text-gray-600 text-center text-sm">Nama file: {filePreview.name}</p>
                </div>
              ) : (
                <>
                  <img src={addPhotoIcon} alt="upload icon" className="w-10 h-10 mb-4" />
                  <p className="text-sm font-medium text-gray-700">Upload a file or drag and drop</p>
                  <p className="text-xs text-gray-500">JPEG, JPG, PNG, PDF (max 5MB each)</p>
                </>
              )}
            </div>
          </label>
          <input id="upload-foto" type="file" name="foto" accept=".jpeg,.jpg,.png,.pdf" onChange={handleFileChange} className="hidden" multiple />
        </div>

        <div className="relative">
          <label className="block font-semibold text-sm sm:text-base mb-2">Kategori Barang</label>
          <div onClick={() => toggleDropdown("kategori")} className="w-full p-4 pr-10 border-2 border-gray-300 rounded-lg outline-none text-sm sm:text-base cursor-pointer">
            {formData.kategori || "Pilih kategori barang"}
          </div>
          <FaChevronDown className="w-3 absolute right-4 top-[68%] -translate-y-1/2 text-gray-500 pointer-events-none" />
          {dropdowns.kategori && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg animate-fadeIn">
              {["pendidikan", "disabilitas", "elektronik"].map((item) => (
                <div key={item} onClick={() => selectOption("kategori", item)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block font-semibold text-sm sm:text-base mb-2">Jenis Barang</label>
          <div onClick={() => toggleDropdown("kondisiBarang")} className="w-full p-4 pr-10 border-2 border-gray-300 rounded-lg outline-none text-sm sm:text-base cursor-pointer">
            {formData.kondisiBarang || "Pilih Jenis Barang"}
          </div>
          <FaChevronDown className="w-3 absolute right-4 top-[68%] -translate-y-1/2 text-gray-500 pointer-events-none" />
          {dropdowns.kondisiBarang && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg animate-fadeIn">
              {["Baru", "Layak Pakai"].map((item) => (
                <div key={item} onClick={() => selectOption("kondisiBarang", item)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold text-sm sm:text-base mb-2">Deskripsi Barang</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="Jelaskan secara detail barang yang ingin anda upload"
            className="w-full p-4 border-2 border-gray-300 rounded-lg outline-none text-sm sm:text-base"
            rows="4"
          />
        </div>

        {/* Provinsi */}
        <div className="relative">
          <label className="block font-semibold text-sm sm:text-base mb-2">Provinsi</label>
          <div onClick={() => toggleDropdown("provinsi")} className="w-full p-4 border-2 border-gray-300 rounded-lg outline-none text-sm sm:text-base cursor-pointer">
            {formData.provinsi || "Pilih Provinsi"}
          </div>
          <FaChevronDown className="w-3 absolute right-4 top-[68%] -translate-y-1/2 text-gray-500 pointer-events-none" />
          {dropdowns.provinsi && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg animate-fadeIn">
              {Indonesia.map((provinsi) => (
                <div
                  key={provinsi.namaProvinsi}
                  onClick={() => {
                    selectOption("provinsi", provinsi.namaProvinsi);
                    setKabupatenOptions(provinsi.kabupatenKota);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {provinsi.namaProvinsi}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kabupaten */}
        {formData.provinsi && (
          <div className="relative">
            <label className="block font-semibold text-sm sm:text-base mb-2">Kabupaten</label>
            <div onClick={() => toggleDropdown("kabupaten")} className="w-full p-4 border-2 border-gray-300 rounded-lg outline-none text-sm sm:text-base cursor-pointer">
              {formData.kabupaten || "Pilih Kabupaten"}
            </div>
            <FaChevronDown className="w-3 absolute right-4 top-[68%] -translate-y-1/2 text-gray-500 pointer-events-none" />
            {dropdowns.kabupaten && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg animate-fadeIn">
                {kabupatenOptions.map((kabupaten) => (
                  <div key={kabupaten} onClick={() => selectOption("kabupaten", kabupaten)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {kabupaten}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="bg-primary hover:bg-primary-700 flex gap-2 text-white font-semibold px-6 py-3 rounded-full shadow-md transition text-sm sm:text-base">
            <p>Kirim</p>
            <img src={sendIcon} className="w-5 sm:w-6" alt="" />
          </button>
        </div>
      </form>
    </div>
  );
}
