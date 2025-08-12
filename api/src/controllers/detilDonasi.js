const DetilDonasiSchema = require("../models/detilDonasi");
const DonasiSchema = require("../models/donasi");
const mongoose = require("mongoose"); // Impor mongoose untuk ObjectId

exports.getDetilDonasi = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID Donasi tidak valid." });
    }
    const getDonasi = await DonasiSchema.findById(req.params.id);
    if (!getDonasi) {
      res.status(404).json("Detil Tidak Ditemukan");
      return;
    }
    const getDetil = await DetilDonasiSchema.findOne({ donasiId: getDonasi._id });
    res.status(200).json(getDetil);
  } catch (error) {
    console.error("Error getting donation detail:", error);
    res.status(500).json(error);
  }
};

exports.getAllDetilDonasi = async (req, res) => {
  try {
    const getAllDetil = await DetilDonasiSchema.find();
    // Kondisi ini tidak diperlukan karena find() akan mengembalikan array kosong jika tidak ada data
    // if (!getAllDetil) {
    //   res.status(404).json("Tidak ada data");
    //   return;
    // }
    res.status(200).json(getAllDetil);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateDetilDonasi = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID Detil Donasi tidak valid." });
    }

    // Jika req.body.komunitasPengambilId dikirim dari frontend, pastikan itu adalah ID yang valid atau null
    if (req.body.komunitasPengambilId !== undefined && req.body.komunitasPengambilId !== null && !mongoose.Types.ObjectId.isValid(req.body.komunitasPengambilId)) {
      return res.status(400).json({ message: "ID Komunitas Pengambil tidak valid." });
    }

    const temukanDanUpdate = await DetilDonasiSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    if (!temukanDanUpdate) {
      res.status(404).json("Postingan tidak ditemukan");
    }
    res.status(200).json(temukanDanUpdate);
  } catch (error) {
    console.error("Error updating donation detail:", error);
    res.status(500).json(error);
  }
};

exports.tambahPermohonan = async (req, res) => {
  try {
    const { pemohonId, tujuanPermohonan } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pemohonId)) {
      return res.status(400).json({ message: "ID pemohon tidak valid." });
    }

    const detilDonasi = await DetilDonasiSchema.findById(req.params.id);
    if (!detilDonasi) {
      return res.status(404).json("Detil Donasi tidak ditemukan");
    }

    // Memastikan permohonan.pemohonId disimpan sebagai ObjectId
    detilDonasi.permohonan.push({ pemohonId: new mongoose.Types.ObjectId(pemohonId), tujuanPermohonan });
    await detilDonasi.save();

    res.status(200).json(detilDonasi);
  } catch (error) {
    console.error("Error adding permohonan:", error);
    res.status(500).json(error);
  }
};
