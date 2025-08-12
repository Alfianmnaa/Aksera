const DonasiSchema = require("../models/donasi");
const DetilDonasiSchema = require("../models/detilDonasi");
const UserSchema = require("../models/auth"); // Untuk mendapatkan nama pengguna/komunitas

// Fungsi untuk mendapatkan peringkat donatur terbanyak berdasarkan jumlah barang didonasikan
exports.getTopDonors = async (req, res) => {
  try {
    const topDonors = await DonasiSchema.aggregate([
      {
        $group: {
          _id: "$donasiUid", // Kelompokkan berdasarkan ID pengguna donatur
          jumlahDonasiBarang: { $sum: 1 }, // Hitung jumlah barang yang didonasikan
        },
      },
      { $sort: { jumlahDonasiBarang: -1 } }, // Urutkan berdasarkan jumlah donasi barang (menurun)
      { $limit: 10 }, // Ambil 10 donatur teratas
      {
        $lookup: {
          from: "users", // Koleksi 'users' (nama model adalah 'User')
          localField: "_id",
          foreignField: "_id",
          as: "donorInfo",
        },
      },
      {
        $unwind: "$donorInfo", // Deconstruct array agar menjadi objek tunggal
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$donorInfo.username",
          email: "$donorInfo.email",
          role: "$donorInfo.role",
          jumlahDonasiBarang: 1, // Proyeksikan jumlahDonasiBarang
        },
      },
    ]);
    res.status(200).json(topDonors);
  } catch (error) {
    console.error("Error fetching top donors:", error);
    res.status(500).json({ message: "Gagal mengambil data donatur teratas", error: error.message });
  }
};

// Fungsi untuk mendapatkan peringkat donasi pengguna saat ini
exports.getUserDonationRank = async (req, res) => {
  try {
    const { userId } = req.params; // Dapatkan ID pengguna dari parameter permintaan

    const allDonors = await DonasiSchema.aggregate([
      {
        $group: {
          _id: "$donasiUid",
          jumlahDonasiBarang: { $sum: 1 },
        },
      },
      { $sort: { jumlahDonasiBarang: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "donorInfo",
        },
      },
      { $unwind: "$donorInfo" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$donorInfo.username",
          jumlahDonasiBarang: 1,
        },
      },
    ]);

    let userRank = null;
    let userDonationData = null;
    for (let i = 0; i < allDonors.length; i++) {
      if (allDonors[i].userId.toString() === userId) {
        userRank = i + 1;
        userDonationData = allDonors[i];
        break;
      }
    }

    if (userRank === null) {
      return res.status(200).json({ rank: null, data: null, message: "Pengguna ini belum memiliki donasi." });
    }

    res.status(200).json({ rank: userRank, data: userDonationData });
  } catch (error) {
    console.error("Error fetching user donation rank:", error);
    res.status(500).json({ message: "Gagal mengambil peringkat donasi pengguna", error: error.message });
  }
};

// Fungsi untuk mendapatkan peringkat komunitas teraktif (berdasarkan jumlah penyaluran barang)
exports.getTopCommunities = async (req, res) => {
  try {
    const topCommunities = await DetilDonasiSchema.aggregate([
      {
        $match: {
          namaStatus: "disalurkan", // Filter untuk barang yang sudah disalurkan
          komunitasPengambilId: { $ne: "" }, // Pastikan ID komunitas ada
        },
      },
      {
        $group: {
          _id: "$komunitasPengambilId", // Kelompokkan berdasarkan ID komunitas
          jumlahPenyaluran: { $sum: 1 }, // Hitung jumlah barang yang disalurkan
        },
      },
      { $sort: { jumlahPenyaluran: -1 } }, // Urutkan berdasarkan jumlah penyaluran (menurun)
      { $limit: 10 }, // Ambil 10 komunitas teratas
      {
        $lookup: {
          from: "users", // Koleksi 'users' (nama model adalah 'User')
          localField: "_id",
          foreignField: "_id",
          as: "communityInfo",
        },
      },
      {
        $unwind: "$communityInfo",
      },
      {
        $project: {
          _id: 0,
          communityId: "$_id",
          username: "$communityInfo.username",
          email: "$communityInfo.email",
          role: "$communityInfo.role",
          jumlahPenyaluran: 1, // Proyeksikan jumlahPenyaluran
        },
      },
    ]);
    res.status(200).json(topCommunities);
  } catch (error) {
    console.error("Error fetching top communities:", error);
    res.status(500).json({ message: "Gagal mengambil data komunitas teratas", error: error.message });
  }
};

// Fungsi untuk mendapatkan peringkat kontribusi komunitas saat ini
exports.getCommunityContributionRank = async (req, res) => {
  try {
    const { communityId } = req.params; // Dapatkan ID komunitas dari parameter permintaan

    const allCommunities = await DetilDonasiSchema.aggregate([
      {
        $match: {
          namaStatus: "disalurkan",
          komunitasPengambilId: { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$komunitasPengambilId",
          jumlahPenyaluran: { $sum: 1 },
        },
      },
      { $sort: { jumlahPenyaluran: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "communityInfo",
        },
      },
      { $unwind: "$communityInfo" },
      {
        $project: {
          _id: 0,
          communityId: "$_id",
          username: "$communityInfo.username",
          jumlahPenyaluran: 1,
        },
      },
    ]);

    let communityRank = null;
    let communityContributionData = null;
    for (let i = 0; i < allCommunities.length; i++) {
      if (allCommunities[i].communityId.toString() === communityId) {
        communityRank = i + 1;
        communityContributionData = allCommunities[i];
        break;
      }
    }

    if (communityRank === null) {
      return res.status(200).json({ rank: null, data: null, message: "Komunitas ini belum memiliki penyaluran." });
    }

    res.status(200).json({ rank: communityRank, data: communityContributionData });
  } catch (error) {
    console.error("Error fetching community contribution rank:", error);
    res.status(500).json({ message: "Gagal mengambil peringkat kontribusi komunitas", error: error.message });
  }
};

// Fungsi untuk mendapatkan jumlah donasi per kategori barang
exports.getDonationCategoryCounts = async (req, res) => {
  try {
    const categoryCounts = await DonasiSchema.aggregate([
      {
        $group: {
          _id: "$kategori",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json(categoryCounts);
  } catch (error) {
    console.error("Error fetching donation category counts:", error);
    res.status(500).json({ message: "Gagal mengambil data kategori donasi", error: error.message });
  }
};

// Fungsi untuk mendapatkan jumlah donasi per provinsi
exports.getProvinceDonationCounts = async (req, res) => {
  try {
    const provinceCounts = await DonasiSchema.aggregate([
      {
        $group: {
          _id: "$provinsi",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json(provinceCounts);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data donasi per provinsi", error: error.message });
  }
};
