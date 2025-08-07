import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";
import { Eye, EyeOff, BookOpen } from "lucide-react";

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
      const response = await axiosInstance.post("/auth/login", formData);

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
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Selamat <span className="text-primary">Datang!</span>
          </h1>
          <p className="text-gray-600 mt-2 mb-8">
            <span className="text-primary">Masuk</span> ke akun anda untuk melanjutkan
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
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-gray-700 text-sm font-medium">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 text-sm hover:text-gray-700 flex items-center gap-1"
              >
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
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/80 text-white py-3 mt-6 rounded-full font-medium text-sm 
              transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
              relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent 
              transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative">
              {loading ? "Loading..." : "Masuk"}
            </span>
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Belum punya akun?{" "}
            <Link to="/daftar" className="text-primary hover:text-primary/80 font-medium">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
