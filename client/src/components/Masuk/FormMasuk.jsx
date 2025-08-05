import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import InputField from "../Form/InputField";
import SubmitButton from "../Form/SubmitButton";
import { axiosInstance } from "../../config";
import loadingWhite from "../../assets/Daftar/loadingWhite.gif";
import Swal from "sweetalert2";

export default function FormMasuk() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleMasuk = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/login", { username, password }, { withCredentials: true });

      setUser(res.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login gagal. Cek kembali username/password.";
      Swal.fire({
        icon: "error",
        title: "Login gagal. ",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fefcea] via-[#f1f1f1] to-[#e0f7fa] px-4">
        <div className="bg-white shadow-md rounded-xl w-full max-w-[500px] p-8">
          <HeaderMasuk />
          <form onSubmit={handleMasuk} className="flex flex-col gap-5">
            <InputField
              label="Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <InputField
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ketik Password"
            />
            <SubmitButton loading={loading}>Masuk</SubmitButton>
          </form>
          <div className="flex justify-center mt-5">
            <p>
              Belum punya akun?
              <Link to="/daftar" className="underline text-primary font-bold ml-1">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


function HeaderMasuk() {
  return (
    <div className="mb-8 ">
      <p className="md:text-heading-[36px] sm:text-3xl text-[28px] font-extrabold mb-2 mt-5">
        Barangmu Harapan <span className="text-primary">Mereka!</span>
      </p>
      <p>
        <span className="text-primary">Masuk</span> ke akun anda
      </p>
    </div>
  );
}
