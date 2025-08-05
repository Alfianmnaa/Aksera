import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { axiosInstance } from "../config";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BookCardSkeleton from "../components/UmmahBook/BookCardSkeleton";
import Chart from "chart.js/auto";

function AdminDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");

  const [rawBooks, setRawBooks] = useState([]);
  const [rawDonations, setRawDonations] = useState([]);
  const [rawUsers, setRawUsers] = useState([]);
  const [rawArticles, setRawArticles] = useState([]);

  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);

  const [errorBooks, setErrorBooks] = useState(null);
  const [errorDonations, setErrorDonations] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorArticles, setErrorArticles] = useState(null);

  const [searchTermBooks, setSearchTermBooks] = useState("");
  const [searchTermDonations, setSearchTermDonations] = useState("");
  const [searchTermUsers, setSearchTermUsers] = useState("");
  const [searchTermArticles, setSearchTermArticles] = useState("");

  const bookCategoryChartRef = useRef(null);
  const donationProvinceChartRef = useRef(null);
  const userRoleChartRef = useRef(null);

  const chartInstances = useRef({});

  const destroyChart = (chartId) => {
    if (chartInstances.current[chartId]) {
      chartInstances.current[chartId].destroy();
      delete chartInstances.current[chartId];
    }
  };

  const fetchAllBooks = useCallback(async () => {
    setLoadingBooks(true);
    setErrorBooks(null);
    try {
      const response = await axiosInstance.get("/materi/getall");
      setRawBooks(response.data);
    } catch (err) {
      console.error("Error fetching all books:", err);
      setErrorBooks("Gagal memuat daftar materi.");
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  const fetchAllDonations = useCallback(async () => {
    setLoadingDonations(true);
    setErrorDonations(null);
    try {
      const response = await axiosInstance.get("/donasi/getall");
      setRawDonations(response.data);
    } catch (err) {
      console.error("Error fetching all donations:", err);
      setErrorDonations("Gagal memuat daftar donasi.");
    } finally {
      setLoadingDonations(false);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const response = await axiosInstance.get("/user/getall");
      setRawUsers(response.data);
    } catch (err) {
      console.error("Error fetching all users:", err);
      setErrorUsers("Gagal memuat daftar pengguna.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchAllArticles = useCallback(async () => {
    setLoadingArticles(true);
    setErrorArticles(null);
    try {
      const response = await axiosInstance.get("/artikel/getall");
      setRawArticles(response.data);
    } catch (err) {
      console.error("Error fetching all articles:", err);
      setErrorArticles("Gagal memuat daftar artikel.");
    } finally {
      setLoadingArticles(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user?.role !== "admin") {
        Swal.fire("Akses Ditolak", "Anda tidak memiliki izin untuk mengakses halaman ini.", "error").then(() => {
          navigate("/");
        });
        return;
      }
      fetchAllBooks();
      fetchAllDonations();
      fetchAllUsers();
      fetchAllArticles();
    } else {
    }
  }, [user, navigate, fetchAllBooks, fetchAllDonations, fetchAllUsers, fetchAllArticles]);

  useEffect(() => {
    if (activeSection === "overview" && !loadingBooks && !loadingDonations && !loadingUsers) {
      if (bookCategoryChartRef.current) {
        destroyChart("bookCategoryChart");
        const ctx = bookCategoryChartRef.current.getContext("2d");
        const categoryCounts = rawBooks.reduce((acc, book) => {
          acc[book.kategori] = (acc[book.kategori] || 0) + 1;
          return acc;
        }, {});

        chartInstances.current.bookCategoryChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: Object.keys(categoryCounts),
            datasets: [
              {
                data: Object.values(categoryCounts),
                backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0", "#00BCD4", "#FFEB3B", "#8BC34A", "#E91E63", "#673AB7"],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  font: {
                    family: "Inter",
                  },
                },
              },
              title: {
                display: true,
                text: "Distribusi Kategori Materi (Ebook)",
                font: {
                  size: 16,
                  family: "Inter",
                },
              },
            },
          },
        });
      }

      if (donationProvinceChartRef.current) {
        destroyChart("donationProvinceChart");
        const ctx = donationProvinceChartRef.current.getContext("2d");
        const provinceCounts = rawDonations.reduce((acc, donasi) => {
          acc[donasi.provinsi] = (acc[donasi.provinsi] || 0) + 1;
          return acc;
        }, {});

        const sortedProvinces = Object.entries(provinceCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);

        chartInstances.current.donationProvinceChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: sortedProvinces.map(([province]) => province),
            datasets: [
              {
                label: "Jumlah Donasi",
                data: sortedProvinces.map(([, count]) => count),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Donasi Berdasarkan Provinsi (Top 5)",
                font: {
                  size: 16,
                  family: "Inter",
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                  font: {
                    family: "Inter",
                  },
                },
              },
              x: {
                ticks: {
                  font: {
                    family: "Inter",
                  },
                },
              },
            },
          },
        });
      }

      if (userRoleChartRef.current) {
        destroyChart("userRoleChart");
        const ctx = userRoleChartRef.current.getContext("2d");
        const roleCounts = rawUsers.reduce((acc, userItem) => {
          acc[userItem.role] = (acc[userItem.role] || 0) + 1;
          return acc;
        }, {});

        chartInstances.current.userRoleChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: Object.keys(roleCounts),
            datasets: [
              {
                data: Object.values(roleCounts),
                backgroundColor: ["#A16207", "#16A34A", "#DC2626", "#4F46E5"],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  font: {
                    family: "Inter",
                  },
                },
              },
              title: {
                display: true,
                text: "Distribusi Role Pengguna",
                font: {
                  size: 16,
                  family: "Inter",
                },
              },
            },
          },
        });
      }
    }

    return () => {
      Object.values(chartInstances.current).forEach((chart) => chart.destroy());
      chartInstances.current = {};
    };
  }, [activeSection, loadingBooks, loadingDonations, loadingUsers, rawBooks, rawDonations, rawUsers]);

  const handleApprove = async (bookId) => {
    Swal.fire({
      title: "Konfirmasi Verifikasi",
      text: "Apakah Anda yakin ingin memverifikasi materi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Verifikasi!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Memverifikasi...",
          text: "Mohon tunggu...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          await axiosInstance.put(`/materi/update/${bookId}`, {
            statusMateri: "terverifikasi",
          });
          Swal.fire("Berhasil!", "Materi berhasil diverifikasi.", "success");
          fetchAllBooks();
        } catch (error) {
          console.error("Error approving book:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat memverifikasi materi.", "error");
        }
      }
    });
  };

  const handleUnverify = async (bookId) => {
    Swal.fire({
      title: "Batalkan Verifikasi",
      text: "Apakah Anda yakin ingin membatalkan verifikasi materi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Batalkan!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Membatalkan Verifikasi...",
          text: "Mohon tunggu...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          await axiosInstance.put(`/materi/update/${bookId}`, {
            statusMateri: "belum terverifikasi",
          });
          Swal.fire("Berhasil!", "Verifikasi materi berhasil dibatalkan.", "success");
          fetchAllBooks();
        } catch (error) {
          console.error("Error unverifying book:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat membatalkan verifikasi materi.", "error");
        }
      }
    });
  };

  const handleDeleteBook = async (bookId) => {
    Swal.fire({
      title: "Konfirmasi Hapus Materi",
      text: "Apakah Anda yakin ingin menghapus materi ini? Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Menghapus Materi...",
          text: "Mohon tunggu...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          await axiosInstance.delete(`/materi/delete/${bookId}`);
          Swal.fire("Berhasil!", "Materi berhasil dihapus.", "success");
          fetchAllBooks();
        } catch (error) {
          console.error("Error deleting book:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus materi.", "error");
        }
      }
    });
  };

  const handleDeleteDonation = async (donasiId) => {
    Swal.fire({
      title: "Konfirmasi Hapus Donasi",
      text: "Apakah Anda yakin ingin menghapus donasi ini? Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Menghapus Donasi...",
          text: "Mohon tunggu...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          await axiosInstance.delete(`/donasi/delete/${donasiId}`);
          Swal.fire("Berhasil!", "Donasi berhasil dihapus.", "success");
          fetchAllDonations();
        } catch (error) {
          console.error("Error deleting donation:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus donasi.", "error");
        }
      }
    });
  };

  const handleDeleteArticle = async (artikelId) => {
    Swal.fire({
      title: "Konfirmasi Hapus Artikel",
      text: "Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Menghapus Artikel...",
          text: "Mohon tunggu...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          await axiosInstance.delete(`/artikel/delete/${artikelId}`);
          Swal.fire("Berhasil!", "Artikel berhasil dihapus.", "success");
          fetchAllArticles();
        } catch (error) {
          console.error("Error deleting article:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus artikel.", "error");
        }
      }
    });
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: "Konfirmasi Hapus Pengguna",
      text: "Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Menghapus Pengguna...",
          text: "Mohon tunggu...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          await axiosInstance.delete(`/user/delete/${userId}`);
          Swal.fire("Berhasil!", "Pengguna berhasil dihapus.", "success");
          fetchAllUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus pengguna.", "error");
        }
      }
    });
  };

  const handleEditUserRole = async (userId, currentRole) => {
    const { value: newRole } = await Swal.fire({
      title: "Edit Role Pengguna",
      input: "select",
      inputOptions: {
        donatur: "Donatur",
        komunitas: "Komunitas",
        admin: "Admin",
      },
      inputValue: currentRole,
      inputPlaceholder: "Pilih role baru",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value) {
          return "Anda harus memilih role!";
        }
      },
    });

    if (newRole && newRole !== currentRole) {
      Swal.fire({
        title: "Memperbarui Role...",
        text: "Mohon tunggu...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        await axiosInstance.put(`/user/update/${userId}`, { role: newRole });
        Swal.fire("Berhasil!", `Role pengguna berhasil diubah menjadi ${newRole}.`, "success");
        fetchAllUsers();
      } catch (error) {
        console.error("Error updating user role:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui role pengguna.", "error");
      }
    }
  };

  const filteredBooks = rawBooks.filter(
    (book) => book.judulMateri.toLowerCase().includes(searchTermBooks.toLowerCase()) || book.penulis.toLowerCase().includes(searchTermBooks.toLowerCase()) || book.kategori.toLowerCase().includes(searchTermBooks.toLowerCase())
  );

  const filteredDonations = rawDonations.filter(
    (donasi) =>
      donasi.namaBarang.toLowerCase().includes(searchTermDonations.toLowerCase()) ||
      donasi.provinsi.toLowerCase().includes(searchTermDonations.toLowerCase()) ||
      donasi.kabupaten.toLowerCase().includes(searchTermDonations.toLowerCase()) ||
      donasi.kategori.toLowerCase().includes(searchTermDonations.toLowerCase())
  );

  const filteredUsers = rawUsers.filter(
    (userItem) => userItem.username.toLowerCase().includes(searchTermUsers.toLowerCase()) || userItem.email.toLowerCase().includes(searchTermUsers.toLowerCase()) || userItem.role.toLowerCase().includes(searchTermUsers.toLowerCase())
  );

  const filteredArticles = rawArticles.filter((artikel) => artikel.judulArtikel.toLowerCase().includes(searchTermArticles.toLowerCase()) || artikel.deskArtikel.toLowerCase().includes(searchTermArticles.toLowerCase()));

  const unverifiedBooks = filteredBooks.filter((book) => book.statusMateri === "belum terverifikasi");
  const verifiedBooks = filteredBooks.filter((book) => book.statusMateri === "terverifikasi");

  const isLoadingInitialData = loadingBooks || loadingDonations || loadingUsers || loadingArticles;
  const hasError = errorBooks || errorDonations || errorUsers || errorArticles;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Memuat data pengguna...</p>
      </div>
    );
  }

  if (user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg rounded-r-xl">
        <div className="text-2xl font-bold text-center mb-10 text-indigo-400">Admin Panel</div>
        <nav className="flex-1">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition duration-200 ${activeSection === "overview" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001 1h3v-9a2 2 0 012-2h0a2 2 0 012 2v9h3a1 1 0 001-1v-10M9 21h6"
                  ></path>
                </svg>
                Overview
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveSection("ebooks")}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition duration-200 ${activeSection === "ebooks" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 19.523 5.754 20 7.5 20s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 19.523 18.246 20 16.5 20c-1.747 0-3.332-.477-4.5-1.253"
                  ></path>
                </svg>
                Manajemen Ebook
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveSection("donations")}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition duration-200 ${activeSection === "donations" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Manajemen Donasi
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveSection("users")}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition duration-200 ${activeSection === "users" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Manajemen Pengguna
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveSection("articles")}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition duration-200 ${activeSection === "articles" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-3m-2 2l-4 4m0 0l-4-4m4 4v7"></path>
                </svg>
                Manajemen Artikel
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {isLoadingInitialData ? (
          <div className="max-w-7xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Memuat Dashboard...</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <BookCardSkeleton key={index} />
                ))}
            </div>
          </div>
        ) : hasError ? (
          <div className="max-w-7xl mx-auto py-8 text-center text-red-600">
            <p className="text-xl font-semibold">Terjadi kesalahan saat memuat data:</p>
            <p>{errorBooks || errorDonations || errorUsers || errorArticles}</p>
            <p className="text-sm text-gray-500 mt-2">Coba muat ulang halaman atau periksa koneksi Anda.</p>
          </div>
        ) : (
          <>
            {activeSection === "overview" && (
              <section className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Overview Dashboard</h1>

                <div className="mb-12 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Ringkasan Statistik</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transform transition duration-300 hover:scale-105">
                      <div className="text-5xl font-bold mb-2">{rawUsers.length}</div>
                      <p className="text-xl">Total Pengguna</p>
                    </div>
                    <div className="bg-green-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transform transition duration-300 hover:scale-105">
                      <div className="text-5xl font-bold mb-2">{rawDonations.length}</div>
                      <p className="text-xl">Total Donasi</p>
                    </div>
                    <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transform transition duration-300 hover:scale-105">
                      <div className="text-5xl font-bold mb-2">{rawBooks.length}</div>
                      <p className="text-xl">Total Materi (Ebook)</p>
                    </div>
                    <div className="bg-yellow-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transform transition duration-300 hover:scale-105">
                      <div className="text-5xl font-bold mb-2">{rawArticles.length}</div>
                      <p className="text-xl">Total Artikel</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-96">
                    <canvas ref={bookCategoryChartRef}></canvas>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-96">
                    <canvas ref={donationProvinceChartRef}></canvas>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-96 lg:col-span-2">
                    <canvas ref={userRoleChartRef}></canvas>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "ebooks" && (
              <section className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Manajemen Ebook</h1>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Cari materi berdasarkan judul, penulis, atau kategori..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    value={searchTermBooks}
                    onChange={(e) => setSearchTermBooks(e.target.value)}
                  />
                </div>
                <div className="mb-12 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Materi Belum Terverifikasi ({unverifiedBooks.length})</h2>
                  {unverifiedBooks.length === 0 ? (
                    <div className="text-center py-10 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-gray-600 text-lg">Tidak ada materi yang menunggu verifikasi saat ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {unverifiedBooks.map((book) => (
                        <div key={book._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
                          <img className="h-48 w-full object-cover rounded-t-lg" src={book.coverMateri || "https://placehold.co/200x280/cccccc/333333?text=No+Cover"} alt={book.judulMateri} />
                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{book.judulMateri}</h3>
                            <p className="text-sm text-gray-600 mb-1">Penulis: {book.penulis}</p>
                            <p className="text-sm text-gray-600 mb-1">Kategori: {book.kategori}</p>
                            <p className="text-sm text-gray-600 mb-2">
                              Status: <span className="font-bold text-red-500">{book.statusMateri}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-auto">Diunggah pada: {new Date(book.createdAt).toLocaleDateString()}</p>
                            <div className="mt-4 flex gap-3">
                              <button
                                onClick={() => handleApprove(book._id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
                              >
                                Verifikasi
                              </button>
                              <button
                                onClick={() => handleDeleteBook(book._id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-12 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Materi Sudah Terverifikasi ({verifiedBooks.length})</h2>
                  {verifiedBooks.length === 0 ? (
                    <div className="text-center py-10 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-gray-600 text-lg">Tidak ada materi yang sudah terverifikasi saat ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {verifiedBooks.map((book) => (
                        <div key={book._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
                          <img className="h-48 w-full object-cover rounded-t-lg" src={book.coverMateri || "https://placehold.co/200x280/cccccc/333333?text=No+Cover"} alt={book.judulMateri} />
                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{book.judulMateri}</h3>
                            <p className="text-sm text-gray-600 mb-1">Penulis: {book.penulis}</p>
                            <p className="text-sm text-gray-600 mb-1">Kategori: {book.kategori}</p>
                            <p className="text-sm text-gray-600 mb-2">
                              Status: <span className="font-bold text-green-600">{book.statusMateri}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-auto">Diunggah pada: {new Date(book.createdAt).toLocaleDateString()}</p>
                            <div className="mt-4 flex gap-3">
                              <button
                                onClick={() => handleUnverify(book._id)}
                                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
                              >
                                Batalkan Verifikasi
                              </button>
                              <button
                                onClick={() => handleDeleteBook(book._id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "donations" && (
              <section className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Manajemen Donasi</h1>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Cari donasi berdasarkan nama barang, provinsi, kabupaten, atau kategori..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    value={searchTermDonations}
                    onChange={(e) => setSearchTermDonations(e.target.value)}
                  />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Daftar Donasi ({filteredDonations.length})</h2>
                  {filteredDonations.length === 0 ? (
                    <div className="text-center py-10 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-gray-600 text-lg">Tidak ada donasi yang tersedia saat ini.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nama Barang
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kategori
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Provinsi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kabupaten
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kondisi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal Dibuat
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredDonations.map((donasi) => (
                            <tr key={donasi._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donasi.namaBarang}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donasi.kategori}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donasi.provinsi}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donasi.kabupaten}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donasi.kondisiBarang}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(donasi.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteDonation(donasi._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "users" && (
              <section className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Manajemen Pengguna</h1>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Cari pengguna berdasarkan username, email, atau role..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    value={searchTermUsers}
                    onChange={(e) => setSearchTermUsers(e.target.value)}
                  />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Daftar Pengguna ({filteredUsers.length})</h2>
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-10 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-gray-600 text-lg">Tidak ada pengguna terdaftar saat ini.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Username
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal Registrasi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.map((userItem) => (
                            <tr key={userItem._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{userItem.username}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userItem.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${userItem.role === "admin" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"}`}>{userItem.role}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(userItem.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                <button
                                  onClick={() => handleEditUserRole(userItem._id, userItem.role)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
                                >
                                  Edit Role
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(userItem._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "articles" && (
              <section className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Manajemen Artikel</h1>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Cari artikel berdasarkan judul atau deskripsi..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    value={searchTermArticles}
                    onChange={(e) => setSearchTermArticles(e.target.value)}
                  />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Daftar Artikel ({filteredArticles.length})</h2>
                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-10 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-gray-600 text-lg">Tidak ada artikel yang tersedia saat ini.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Judul Artikel
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Deskripsi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal Dibuat
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredArticles.map((artikel) => (
                            <tr key={artikel._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{artikel.judulArtikel}</td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{artikel.deskArtikel}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(artikel.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteArticle(artikel._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
