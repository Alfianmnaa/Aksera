const DonasiSchema = require("../models/donasi");
const DetilDonasiSchema = require("../models/detilDonasi");

// buat postingan donasi
exports.buatDonasi = async (req, res) => {
  try {
    const donasiBaru = new DonasiSchema(req.body);
    const simpanDonasi = await donasiBaru.save();
    const detilDonasiBaru = new DetilDonasiSchema({
      donasiId: simpanDonasi._id,
      permohonan: [],
      namaStatus: "tersedia",
      deskripsiStatus: "",
      komunitasPengambilId: "",
    });

    const simpanDetilDonasi = await detilDonasiBaru.save();
    res.status(200).json({
      message: "Donasi & DetilDonasi Berhasil Dibuat",
      donasi: simpanDonasi,
      detilDonasi: simpanDetilDonasi,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// get one donasi
exports.getOneDonasi = async (req, res) => {
  try {
    const getOne = await DonasiSchema.findById(req.params.id);
    if (!getOne) {
      return res.status(404).json("Donasi tidak ditemukan");
    }
    res.status(200).json(getOne);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET
exports.getAllDonasi = async (req, res) => {
  try {
    const { provinsi, judul } = req.query;

    const filter = {};

    if (provinsi) {
      filter.provinsi = { $regex: new RegExp(provinsi, "i") }; // match lokasi
    }

    if (judul) {
      filter.namaBarang = { $regex: new RegExp(judul, "i") };
    }

    const getAll = await DonasiSchema.find(filter);
    res.status(200).json(getAll);
  } catch (error) {
    res.status(500).json(error);
  }
};

// update Donasi
exports.updateDonasi = async (req, res) => {
  try {
    const temukanDanUpdate = await DonasiSchema.findByIdAndUpdate(
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

// hapus Donasi
exports.hapusDonasi = async (req, res) => {
  try {
    const temukanDonasi = await DonasiSchema.findById(req.params.id);
    if (!temukanDonasi) {
      return res.status(404).json("Donasi tidak ditemukan");
    }
    await DetilDonasiSchema.findOneAndDelete({ donasiId: temukanDonasi._id });
    await DonasiSchema.findByIdAndDelete(req.params.id);

    res.status(200).json("Postingan dan detil Berhasil Dihapus!");
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get donasi yang disimpan oleh user
exports.getSavedDonasi = async (req, res) => {
  try {
    const userId = req.params.id;
    const savedDonasi = await DonasiSchema.find({ disimpan: userId });
    res.status(200).json(savedDonasi);
  } catch (error) {
    res.status(500).json(error);
  }
};

// toggle simpan
exports.toggleSimpan = async (req, res) => {
  try {
    const donasiId = req.params.id;
    const userId = req.body.userId;

    const donasi = await DonasiSchema.findById(donasiId);
    if (!donasi) return res.status(404).json("Donasi tidak ditemukan");

    const index = donasi.disimpan.indexOf(userId);
    if (index === -1) {
      donasi.disimpan.push(userId);
    } else {
      donasi.disimpan.splice(index, 1);
    }

    await donasi.save();
    res.status(200).json({ message: "Toggle simpan berhasil", disimpan: donasi.disimpan });
  } catch (error) {
    res.status(500).json(error);
  }
};
