import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { axiosInstance } from "../config"; // Pastikan axiosInstance Anda terkonfigurasi dengan benar untuk cookies dan URL backend
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export const Leaderboard = () => {
  // Dapatkan informasi user dari context. UserContext harus menyediakan objek user
  // dengan setidaknya properti _id, username, dan role.
  const { user } = useContext(UserContext);
  // Warna utama aplikasi sesuai permintaan
  const primaryColor = "#045394";

  // State untuk menyimpan data leaderboard dan visualisasi
  const [topDonors, setTopDonors] = useState([]);
  const [userDonationRank, setUserDonationRank] = useState(null);
  const [userDonationData, setUserDonationData] = useState(null);

  const [topCommunities, setTopCommunities] = useState([]);
  const [communityContributionRank, setCommunityContributionRank] = useState(null);
  const [communityContributionData, setCommunityContributionData] = useState(null);

  const [categoryData, setCategoryData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);

  // State untuk menangani status loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Top Donors
        const donorsRes = await axiosInstance.get("/leaderboard/donors/top");
        setTopDonors(donorsRes.data);

        // Fetch User's Donation Rank if logged in and is a 'user' role
        if (user && user._id && user.role === "user") {
          const userRankRes = await axiosInstance.get(`/leaderboard/donors/rank/${user._id}`);
          // Backend akan mengembalikan null jika user tidak ada donasi, jadi cek ini
          if (userRankRes.data.rank !== null) {
            setUserDonationRank(userRankRes.data.rank);
            setUserDonationData(userRankRes.data.data);
          } else {
            setUserDonationRank(null);
            setUserDonationData(null);
          }
        }

        // Fetch Top Communities
        const communitiesRes = await axiosInstance.get("/leaderboard/communities/top");
        setTopCommunities(communitiesRes.data);

        // Fetch Community's Contribution Rank if logged in and is a 'community' role
        if (user && user._id && user.role === "community") {
          const communityRankRes = await axiosInstance.get(`/leaderboard/communities/rank/${user._id}`);
          // Backend akan mengembalikan null jika komunitas tidak ada penyaluran, jadi cek ini
          if (communityRankRes.data.rank !== null) {
            setCommunityContributionRank(communityRankRes.data.rank);
            setCommunityContributionData(communityRankRes.data.data);
          } else {
            setCommunityContributionRank(null);
            setCommunityContributionData(null);
          }
        }

        // Fetch Category Data for Visualization
        const categoriesRes = await axiosInstance.get("/leaderboard/data/categories");
        // Mengubah format data agar sesuai dengan Recharts (_id menjadi name)
        setCategoryData(categoriesRes.data.map((item) => ({ name: item._id, count: item.count })));

        // Fetch Province Data for Visualization
        const provincesRes = await axiosInstance.get("/leaderboard/data/provinces");
        // Mengubah format data agar sesuai dengan Recharts (_id menjadi name)
        setProvinceData(provincesRes.data.map((item) => ({ name: item._id, count: item.count })));
      } catch (err) {
        // Set pesan error yang lebih user-friendly
        setError("Gagal memuat data papan peringkat. Silakan coba lagi nanti.");
      } finally {
        // Pastikan status loading berakhir setelah semua data diambil atau ada error
        setLoading(false);
      }
    };

    // Panggil fungsi fetchData saat komponen dimuat atau user berubah
    fetchData();
  }, [user]); // Dependensi user memastikan data diperbarui jika pengguna login/logout

  // Tampilkan pesan loading saat data sedang dimuat
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl md:text-2xl text-gray-700">Memuat Papan Peringkat...</p>
      </div>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <p className="text-xl md:text-2xl text-red-600">{error}</p>
      </div>
    );
  }

  // Render konten leaderboard setelah data dimuat
  return (
    <div className="container max-w-6xl mx-auto px-4 pb-12 sm:py-12 md:px-8 bg-gray-50 min-h-screen ">
      {/* Judul Halaman */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-12 tracking-tight" style={{ color: primaryColor }}>
        Papan Peringkat Kebaikan ✨
      </h1>

      {/* Leaderboard Donatur */}
      <section className="mb-10 md:mb-12 bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-b-4" style={{ borderColor: primaryColor }}>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="trophy">
            🏆
          </span>{" "}
          Donatur Teratas
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100" style={{ color: primaryColor }}>
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-base md:text-lg">Peringkat</th>
                <th className="py-3 px-4 text-left font-semibold text-base md:text-lg">Donatur</th>
                <th className="py-3 px-4 text-left font-semibold text-base md:text-lg">Jumlah Donasi Barang</th>
              </tr>
            </thead>
            <tbody>
              {/* Tampilkan data donatur teratas jika ada */}
              {topDonors.length > 0 ? (
                topDonors.map((donor, index) => (
                  <tr key={donor.userId} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-200 ease-in-out`}>
                    <td className="py-3 px-4 text-base  font-medium text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4 text-base  text-gray-700">
                      {donor.username} {user && user._id === donor.userId && <span className="text-green-600 font-semibold">(Anda)</span>}
                    </td>
                    <td className="py-3 px-4 text-base text-gray-700">{donor.jumlahDonasiBarang}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500 text-base md:text-lg">
                    Belum ada donatur teratas. Mulai berdonasi sekarang!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tampilkan peringkat donasi pengguna saat ini jika login sebagai 'user' */}
        {user && user.role === "user" && userDonationRank !== null && (
          <div className="mt-8 p-4 md:p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-inner flex items-center gap-3">
            <span role="img" aria-label="star" className="text-3xl">
              🌟
            </span>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-1" style={{ color: primaryColor }}>
                Peringkat Donasi Anda
              </h3>
              <p className="text-base md:text-lg text-gray-700">
                Anda berada di peringkat ke-<span className="font-semibold text-blue-800">{userDonationRank}</span> dengan total <span className="font-semibold text-blue-800">{userDonationData?.jumlahDonasiBarang}</span> donasi barang.
                Teruslah berbuat baik!
              </p>
            </div>
          </div>
        )}
        {/* Pesan jika user belum memiliki donasi */}
        {user && user.role === "user" && userDonationRank === null && (
          <div className="mt-8 p-4 md:p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-inner flex items-center gap-3">
            <span role="img" aria-label="thinking face" className="text-3xl">
              🤔
            </span>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-1 text-yellow-800">Peringkat Donasi Anda</h3>
              <p className="text-base md:text-lg text-gray-700">Anda belum memiliki donasi yang tercatat di papan peringkat. Saatnya mulai berbagi!</p>
            </div>
          </div>
        )}
      </section>

      {/* Leaderboard Komunitas */}
      <section className="mb-10 md:mb-12 bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-b-4" style={{ borderColor: primaryColor }}>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="rocket">
            🚀
          </span>{" "}
          Komunitas Teraktif
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100" style={{ color: primaryColor }}>
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-base md:text-lg">Peringkat</th>
                <th className="py-3 px-4 text-left font-semibold text-base md:text-lg">Komunitas</th>
                <th className="py-3 px-4 text-left font-semibold text-base md:text-lg">Jumlah Penyaluran Barang</th>
              </tr>
            </thead>
            <tbody>
              {/* Tampilkan data komunitas teratas jika ada */}
              {topCommunities.length > 0 ? (
                topCommunities.map((community, index) => (
                  <tr key={community.communityId} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-200 ease-in-out`}>
                    <td className="py-3 px-4 text-base md:text-lg font-medium text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4 text-base md:text-lg text-gray-700">
                      {community.username} {user && user._id === community.communityId && <span className="text-green-600 font-semibold">(Anda)</span>}
                    </td>
                    <td className="py-3 px-4 text-base md:text-lg text-gray-700">{community.jumlahPenyaluran}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500 text-base md:text-lg">
                    Belum ada komunitas teraktif. Ajak komunitas Anda berpartisipasi!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tampilkan peringkat kontribusi komunitas saat ini jika login sebagai 'community' */}
        {user && user.role === "community" && communityContributionRank !== null && (
          <div className="mt-8 p-4 md:p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-inner flex items-center gap-3">
            <span role="img" aria-label="sparkles" className="text-3xl">
              ✨
            </span>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-1" style={{ color: primaryColor }}>
                Peringkat Kontribusi Komunitas Anda
              </h3>
              <p className="text-base md:text-lg text-gray-700">
                Komunitas Anda berada di peringkat ke-<span className="font-semibold text-blue-800">{communityContributionRank}</span> dengan total{" "}
                <span className="font-semibold text-blue-800">{communityContributionData?.jumlahPenyaluran}</span> penyaluran barang. Kerja bagus!
              </p>
            </div>
          </div>
        )}
        {/* Pesan jika komunitas belum memiliki penyaluran */}
        {user && user.role === "community" && communityContributionRank === null && (
          <div className="mt-8 p-4 md:p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-inner flex items-center gap-3">
            <span role="img" aria-label="empty box" className="text-3xl">
              📦
            </span>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-1 text-yellow-800">Peringkat Kontribusi Komunitas Anda</h3>
              <p className="text-base md:text-lg text-gray-700">Komunitas Anda belum memiliki penyaluran yang tercatat di papan peringkat. Ayo mulai menyalurkan kebaikan!</p>
            </div>
          </div>
        )}
      </section>

      {/* Visualisasi Data: Kategori Barang Terbanyak & Provinsi dengan Donasi Terbanyak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-b-4" style={{ borderColor: primaryColor }}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <span role="img" aria-label="bar chart">
              📊
            </span>{" "}
            Kategori Barang Donasi Terbanyak
          </h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} fontSize={14} />
                <YAxis fontSize={14} />
                <Tooltip formatter={(value) => `${value} Donasi`} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="count" name="Jumlah Donasi" fill={primaryColor}>
                  {categoryData.map((entry, index) => (
                    <Cell cursor="pointer" fill={primaryColor} key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 text-base md:text-lg">Tidak ada data kategori donasi untuk ditampilkan.</p>
          )}
        </section>

        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-b-4" style={{ borderColor: primaryColor }}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <span role="img" aria-label="map">
              🗺️
            </span>{" "}
            Provinsi dengan Jumlah Donasi Terbanyak
          </h2>
          {provinceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={provinceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} fontSize={14} />
                <YAxis fontSize={14} />
                <Tooltip formatter={(value) => `${value} Donasi`} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="count" name="Jumlah Donasi" fill={primaryColor}>
                  {provinceData.map((entry, index) => (
                    <Cell cursor="pointer" fill={primaryColor} key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 text-base md:text-lg">Tidak ada data provinsi donasi untuk ditampilkan.</p>
          )}
        </section>
      </div>
    </div>
  );
};
