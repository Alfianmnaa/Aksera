import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../config";
import Swal from "sweetalert2";
import HeaderDaftar from "../components/Daftar/HeaderDaftar";
import RegistrationTypeToggle from "../components/Daftar/RegistrationTypeToggle";
import DonaturForm from "../components/Daftar/DonaturForm";
import KomunitasForm from "../components/Daftar/KomunitasForm";

export default function Daftar() {
  const [role, setRole] = useState("donatur");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    namaLengkap: "",
    pernyataanUrl: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: role,
    }));
  }, [role]);

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
        text: "Akun berhasil dibuat. Silakan masuk.",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
      navigate("/masuk");
    } catch (err) {
      console.error("Daftar gagal", err);
      setLoading(false);

      let errorMessage = "Pendaftaran gagal. Silakan coba lagi.";

      if (err.response && err.response.status === 409) {
        errorMessage = err.response.data.message || "Username atau email sudah terdaftar.";
      } else if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Pendaftaran Gagal!",
        text: errorMessage,
        timer: 3000,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffbea] via-[#e8f5e9] to-[#e3f2fd] px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-10">
        <HeaderDaftar />
        <RegistrationTypeToggle selectedType={role} setSelectedType={setRole} />

        {/* Form */}
        <form onSubmit={handleDaftar} className="space-y-4">
          {role === "donatur" ? (
            <DonaturForm formData={formData} handleInputChange={handleInputChange} showPassword={showPassword} setShowPassword={setShowPassword} />
          ) : (
            <KomunitasForm formData={formData} handleInputChange={handleInputChange} showPassword={showPassword} setShowPassword={setShowPassword} />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/80 text-white py-3 mt-6 rounded-full font-medium text-sm 
              transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
              relative overflow-hidden group"
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent 
              transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            ></span>
            <span className="relative">{loading ? "Loading..." : "Daftar"}</span>
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Sudah punya akun?{" "}
            <Link to="/masuk" className="text-primary hover:text-primary/80 font-medium">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
