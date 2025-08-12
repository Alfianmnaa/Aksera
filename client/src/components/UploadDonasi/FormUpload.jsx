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
import locationIcon from "../../assets/LihatDonasi/location.svg";
import arrowDown from "../../assets/LihatDonasi/arrowDown.svg";
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
  const [isOpenKategori, setIsOpenKategori] = useState(false);
  const [isOpenKondisi, setIsOpenKondisi] = useState(false);
  const [isOpenProvinsi, setIsOpenProvinsi] = useState(false);
  const [isOpenKabupaten, setIsOpenKabupaten] = useState(false);

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

  const handleKategoriChange = (value) => {
    setFormData(prev => ({ ...prev, kategori: value }));
    setIsOpenKategori(false);
  };

  const handleKondisiChange = (value) => {
    setFormData(prev => ({ ...prev, kondisiBarang: value }));
    setIsOpenKondisi(false);
  };

  const handleProvinsiChange = (value) => {
    const selectedProvince = Indonesia.find((provinsi) => provinsi.namaProvinsi === value);
    setFormData(prev => ({ 
      ...prev, 
      provinsi: value, 
      kabupaten: "" 
    }));
    setKabupatenOptions(selectedProvince ? selectedProvince.kabupatenKota : []);
    setIsOpenProvinsi(false);
  };

  const handleKabupatenChange = (value) => {
    setFormData(prev => ({ ...prev, kabupaten: value }));
    setIsOpenKabupaten(false);
  };

  return (
    <div className="max-w-5xl md:mx-auto m-3 my-10 p-8 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-center text-[#004b57] mb-10">
        Silakan Isi Form Donasi Barang
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Kiri */}
        <div className="space-y-6">
          {/* Nama Barang */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Barang</label>
            <input 
              type="text" 
              name="namaBarang" 
              value={formData.namaBarang} 
              onChange={handleChange} 
              placeholder="Tulis Nama Barang" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#045394]" 
            />
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Foto</label>
            <label htmlFor="upload-foto" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#045394] transition cursor-pointer block">
              <input id="upload-foto" type="file" name="foto" accept="image/*" onChange={handleFileChange} className="hidden" />
              
              {filePreview ? (
                <div className="flex flex-col items-center justify-center">
                  <img src={filePreview.url} alt="Preview" className="w-full max-h-[200px] object-cover rounded border mb-2" />
                  <p className="text-sm text-gray-600">Nama file: {filePreview.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img alt="upload icon" className="w-10 h-10 mb-4" src={addPhotoIcon} />
                  <p className="text-sm text-gray-500">Upload file atau drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG • Maks 5MB</p>
                </div>
              )}
            </label>
          </div>

          {/* Kategori */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Kategori Barang</label>
            <div
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-800 cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
              onClick={() => setIsOpenKategori(!isOpenKategori)}
            >
              <span className="text-sm">
                {formData.kategori ? formData.kategori.charAt(0).toUpperCase() + formData.kategori.slice(1) : "Pilih kategori barang"}
              </span>
              <img
                src={arrowDown}
                alt="arrowDown"
                className={`w-3 transition-transform ${isOpenKategori ? "rotate-180" : ""}`}
              />
            </div>
            {isOpenKategori && (
              <div className="absolute z-50 w-full max-h-60 overflow-y-auto mt-1 bg-white shadow-lg rounded-lg border border-gray-200">
                <ul className="p-2">
                  {["pendidikan", "disabilitas", "elektronik"].map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer hover:bg-gray-100 p-2 text-sm rounded"
                      onClick={() => handleKategoriChange(item)}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Jenis */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Jenis Barang</label>
            <div
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-800 cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
              onClick={() => setIsOpenKondisi(!isOpenKondisi)}
            >
              <span className="text-sm">
                {formData.kondisiBarang || "Pilih jenis barang"}
              </span>
              <img
                src={arrowDown}
                alt="arrowDown"
                className={`w-3 transition-transform ${isOpenKondisi ? "rotate-180" : ""}`}
              />
            </div>
            {isOpenKondisi && (
              <div className="absolute z-50 w-full max-h-60 overflow-y-auto mt-1 bg-white shadow-lg rounded-lg border border-gray-200">
                <ul className="p-2">
                  {["Baru", "Layak Pakai"].map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer hover:bg-gray-100 p-2 text-sm rounded"
                      onClick={() => handleKondisiChange(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Barang</label>
            <textarea 
              rows="6" 
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Jelaskan secara detail barang yang ingin anda upload" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#045394]"
            />
          </div>

          {/* Provinsi */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Provinsi</label>
            <div
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-800 cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
              onClick={() => setIsOpenProvinsi(!isOpenProvinsi)}
            >
              <div className="flex items-center gap-2">
                <img src={locationIcon} alt="iconLocation" className="w-4" />
                <span className="text-sm">
                  {formData.provinsi || "Pilih Provinsi"}
                </span>
              </div>
              <img
                src={arrowDown}
                alt="arrowDown"
                className={`w-3 transition-transform ${isOpenProvinsi ? "rotate-180" : ""}`}
              />
            </div>
            {isOpenProvinsi && (
              <div className="absolute z-50 w-full max-h-60 overflow-y-auto mt-1 bg-white shadow-lg rounded-lg border border-gray-200">
                <ul className="p-2">
                  {Indonesia.map((provinsi) => (
                    <li
                      key={provinsi.namaProvinsi}
                      className="cursor-pointer hover:bg-gray-100 p-2 text-sm rounded"
                      onClick={() => handleProvinsiChange(provinsi.namaProvinsi)}
                    >
                      {provinsi.namaProvinsi}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Kabupaten */}
          {formData.provinsi && (
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Kabupaten</label>
              <div
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-800 cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors duration-200"
                onClick={() => setIsOpenKabupaten(!isOpenKabupaten)}
              >
                <div className="flex items-center gap-2">
                  <img src={locationIcon} alt="iconLocation" className="w-4" />
                  <span className="text-sm">
                    {formData.kabupaten || "Pilih Kabupaten"}
                  </span>
                </div>
                <img
                  src={arrowDown}
                  alt="arrowDown"
                  className={`w-3 transition-transform ${isOpenKabupaten ? "rotate-180" : ""}`}
                />
              </div>
              {isOpenKabupaten && (
                <div className="absolute z-50 w-full max-h-60 overflow-y-auto mt-1 bg-white shadow-lg rounded-lg border border-gray-200">
                  <ul className="p-2">
                    {kabupatenOptions.map((kabupaten) => (
                      <li
                        key={kabupaten}
                        className="cursor-pointer hover:bg-gray-100 p-2 text-sm rounded"
                        onClick={() => handleKabupatenChange(kabupaten)}
                      >
                        {kabupaten}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tombol */}
          <div className="text-right pt-4">
            <button type="submit" className="bg-[#045394] hover:bg-[#110843] text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-md">
              Kirim Donasi
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
