const UserSchema = require("../models/auth");
const DetilUserSchema = require("../models/detilUser");

exports.getAllUsers = async (req, res) => {
  try {
    const getAll = await UserSchema.find();
    res.status(200).json(getAll);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const getOneUser = await UserSchema.findById(req.params.id);
    res.status(200).json(getOneUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const temukanDanUpdate = await UserSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(temukanDanUpdate);
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete account
exports.hapusAkun = async (req, res) => {
  try {
    // Cari user dulu
    const user = await UserSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User tidak ditemukan");
    }

    // Hapus detil user berdasarkan user._id
    await DetilUserSchema.findOneAndDelete({ detilUid: user._id.toString() });

    // Hapus user itu sendiri
    await UserSchema.findByIdAndDelete(req.params.id);

    res.status(200).json("User dan DetilUser berhasil dihapus");
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
