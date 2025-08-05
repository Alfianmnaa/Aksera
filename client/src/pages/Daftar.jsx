import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../config";
import FormDaftarDonatur from "../components/Daftar/FormDaftarDonatur";
import FormDaftarKomunitas from "../components/Daftar/FormDaftarKomunitas";
import Swal from "sweetalert2";
import mascotImage from "../assets/Maskot/Luma1.png";

export default function Daftar() {
  const [role, setRole] = useState("donatur");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    namaLengkap: "",
    pernyataanUrl: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: role,
    }));
  }, [role]);

  const handleDaftar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        namaLengkap: formData.namaLengkap,
        pernyataanUrl: formData.pernyataanUrl,
      };

      await axiosInstance.post("/auth/register", payload);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Akun berhasil dibuat. Silakan masuk.", // Pesan sukses yang lebih relevan
        timer: 2000, // Tambah waktu sedikit agar user bisa membaca
        showConfirmButton: false,
      });
      setLoading(false);
      navigate("/masuk");
    } catch (err) {
      console.error("Daftar gagal", err);
      setLoading(false);

      let errorMessage = "Pendaftaran gagal. Silakan coba lagi."; // Pesan default

      // Cek apakah ada respons dari server dan statusnya 409 (Conflict)
      if (err.response && err.response.status === 409) {
        errorMessage = err.response.data.message || "Username atau email sudah terdaftar.";
      } else if (err.response && err.response.data && err.response.data.message) {
        // Tangani error lain yang mungkin dikirim dari backend dengan pesan spesifik
        errorMessage = err.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Pendaftaran Gagal!",
        text: errorMessage,
        timer: 3000, // Beri waktu lebih lama untuk pesan error
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffbea] via-[#e8f5e9] to-[#e3f2fd] px-4 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-[500px]">
        <HeaderDaftar role={role} />

        <RoleSelector role={role} setRole={setRole} />

        {role === "donatur" ? (
          <FormDaftarDonatur formData={formData} setFormData={setFormData} handleDaftar={handleDaftar} loading={loading} />
        ) : (
          <FormDaftarKomunitas formData={formData} setFormData={setFormData} handleDaftar={handleDaftar} loading={loading} />
        )}

        <div className="flex justify-center mt-5">
          <p>
            Sudah punya akun?
            <Link to="/masuk" className="underline font-bold text-primary ml-1">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function HeaderDaftar({ role }) {
  return (
    // 2. Gunakan Flexbox pada div pembungkus utama
    <div className="flex justify-between items-center mb-8">
      {/* Teks di sebelah kiri */}
      <div>
        <p className="md:text-heading-[36px] sm:text-3xl text-[28px] font-extrabold mb-2 mt-5">
          {role === "donatur" ? "Yuk" : "Yuk"} <span className="text-primary">{role === "donatur" ? "Daftar!" : "Daftar!"}</span>
        </p>
      </div>

      {/* 3. Gambar di sebelah kanan */}
      <div>
        <img
          src={mascotImage}
          alt="Maskot Pendaftaran"
          className="w-24 sm:w-28" // Atur ukuran lebar gambar di sini
        />
      </div>
    </div>
  );
}

function RoleSelector({ role, setRole }) {
  return (
    <>
      <p className="mb-5 text-body-lg">Pilih daftar sebagai</p>
      <div className="flex gap-4 mb-6 w-full max-w-md justify-center text-body-lg">
        <button className={`pb-2 md:text-normal text-[15px] font-medium border-0 rounded-none bg-white ${role === "donatur" ? "border-primary border-b-2" : ""} focus:outline-none`} onClick={() => setRole("donatur")}>
          Individu
        </button>
        <button className={`pb-2 md:text-normal text-[15px] font-medium border-0 rounded-none bg-white ${role === "komunitas" ? "border-primary border-b-2" : ""} focus:outline-none`} onClick={() => setRole("komunitas")}>
          Komunitas
        </button>
      </div>
    </>
  );
}
