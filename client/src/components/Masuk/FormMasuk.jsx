import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";
import { Eye, EyeOff, BookOpen } from "lucide-react";
import akseraLogo from "../../assets/Daftar/Aksera_svg.svg";

export default function FormMasuk() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMasuk = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // --- PERBAIKAN DI SINI: Tambahkan { withCredentials: true } ---
      const response = await axiosInstance.post("/auth/login", formData, { withCredentials: true });

      if (response.data) {
        setUser(response.data);
        Swal.fire({
          icon: "success",
          title: "Berhasil Masuk!",
          text: "Selamat datang kembali",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      }
    } catch (err) {
      console.error("Login gagal", err);
      let errorMessage = "Login gagal. Silakan coba lagi.";

      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Login Gagal!",
        text: errorMessage,
        timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffbea] via-[#e8f5e9] to-[#e3f2fd] px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center">
            {" "}
            {/* Changed bg-primary to bg-[#045394] */}
            <img src={akseraLogo} alt="aksera icon" />
            {/* <BookOpen className="w-8 h-8 text-white" /> */}
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Selamat <span className="text-[#045394]">Datang!</span> {/* Changed text-primary to text-[#045394] */}
          </h1>
          <p className="text-gray-600 mt-2 mb-8">
            <span className="text-[#045394]">Masuk</span> ke akun anda untuk melanjutkan {/* Changed text-primary to text-[#045394] */}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleMasuk} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="text-gray-700 text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username anda"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#045394] focus:ring-2 focus:ring-[#045394]" // Changed focus:border-blue-500 to focus:border-[#045394]
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-gray-700 text-sm font-medium">
                Password
              </label>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 text-sm hover:text-gray-700 flex items-center gap-1">
                {showPassword ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show
                  </>
                )}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password anda"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#045394] focus:ring-2 focus:ring-[#045394]" // Changed focus:border-blue-500 to focus:border-[#045394]
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#045394] hover:bg-[#045394]/80 text-white py-3 mt-6 rounded-full font-medium text-sm
              transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
              relative overflow-hidden group" // Changed bg-primary to bg-[#045394]
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-[#045394]/50 to-transparent
              transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" // Changed from-primary/50 to from-[#045394]/50
            ></span>
            <span className="relative">{loading ? "Loading..." : "Masuk"}</span>
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Belum punya akun?{" "}
            <Link to="/daftar" className="text-[#045394] hover:text-[#045394]/80 font-medium">
              {" "}
              {/* Changed text-primary to text-[#045394] */}
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
