const DetilUserSchema = require("../models/detilUser");
const UserSchema = require("../models/auth");

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
    }
    const getDetil = await DetilUserSchema.findOne({ detilUid: getUser._id.toString() });
    res.status(200).json(getDetil);
  } catch (error) {
    res.status(500).json(error);
  }
};

// update user
exports.updateDetilUser = async (req, res) => {
  try {
    const updatedDetil = await DetilUserSchema.findOneAndUpdate(
      { detilUid: req.params.id }, // cari berdasarkan UID user
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
