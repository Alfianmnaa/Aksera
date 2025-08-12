const DetilDonasiSchema = require("../models/detilDonasi");
const DonasiSchema = require("../models/donasi");

exports.getDetilDonasi = async (req, res) => {
  try {
    const getDonasi = await DonasiSchema.findById(req.params.id);
    if (!getDonasi) {
      res.status(404).json("Detil Tidak Ditemukan");
    }
    const getDetil = await DetilDonasiSchema.findOne({ donasiId: getDonasi._id.toString() });
    res.status(200).json(getDetil);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAllDetilDonasi = async (req, res) => {
  try {
    const getAllDetil = await DetilDonasiSchema.find();
    if (!getAllDetil) {
      res.status(404).json("Tidak ada data");
    }
    res.status(200).json(getAllDetil);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateDetilDonasi = async (req, res) => {
  try {
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
    res.status(500).json(error);
  }
};

exports.tambahPermohonan = async (req, res) => {
  try {
    const { pemohonId, tujuanPermohonan } = req.body;

    const detilDonasi = await DetilDonasiSchema.findById(req.params.id);
    if (!detilDonasi) {
      return res.status(404).json("Detil Donasi tidak ditemukan");
    }

    detilDonasi.permohonan.push({ pemohonId, tujuanPermohonan });
    await detilDonasi.save();

    res.status(200).json(detilDonasi);
  } catch (error) {
    res.status(500).json(error);
  }
};
