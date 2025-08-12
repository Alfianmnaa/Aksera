const DetilUserSchema = require("../models/detilUser");
const UserSchema = require("../models/auth");
const mongoose = require("mongoose"); // Impor mongoose untuk ObjectId

exports.buatDetilUser = async (req, res) => {
  try {
    const buatDetil = new DetilUserSchema(req.body);
    const simpanDetil = await buatDetil.save();
    res.status(200).json({
      message: "Detil User Behasil Dibuat!",
      data: simpanDetil,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getDetilUser = async (req, res) => {
  try {
    const getUser = await UserSchema.findById(req.params.id);
    if (!getUser) {
      res.status(404).json("Detil Tidak Ditemukan");
      return; // Tambahkan return untuk menghentikan eksekusi
    }
    // Menggunakan getUser._id (tipe ObjectId) secara langsung
    const getDetil = await DetilUserSchema.findOne({ detilUid: getUser._id });
    res.status(200).json(getDetil);
  } catch (error) {
    console.error("Error getting user detail:", error); // Log error
    res.status(500).json(error);
  }
};

// update user
exports.updateDetilUser = async (req, res) => {
  try {
    // Pastikan req.params.id adalah ObjectId yang valid jika detilUid adalah ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID pengguna tidak valid." });
    }

    const updatedDetil = await DetilUserSchema.findOneAndUpdate(
      { detilUid: req.params.id }, // cari berdasarkan UID user (sekarang ObjectId)
      { $set: req.body },
      { new: true }
    );

    if (!updatedDetil) {
      return res.status(404).json({ message: "Detil user tidak ditemukan." });
    }

    res.status(200).json(updatedDetil);
  } catch (error) {
    console.error("Gagal update detil user:", error);
    res.status(500).json({ message: "Gagal memperbarui detil user.", error });
  }
};
