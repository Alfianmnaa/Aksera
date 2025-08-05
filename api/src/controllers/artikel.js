const artikelSchema = require("../models/artikel");

exports.buatArtikel = async (req, res) => {
  try {
    const buatArtikel = new artikelSchema(req.body);
    const simpanArtikel = await buatArtikel.save();
    res.status(200).json({
      message: "Artikel Berhasil Dibuat!",
      data: simpanArtikel,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getOneArtikel = async (req, res) => {
  try {
    const getArtikel = await artikelSchema.findById(req.params.id);
    res.status(200).json(getArtikel);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAllArtikel = async (req, res) => {
  try {
    const getAll = await artikelSchema.find();
    res.status(200).json(getAll);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateArtikel = async (req, res) => {
  try {
    const temukanDanUpdate = await artikelSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    if (!temukanDanUpdate) {
      res.status(404).json("Artikel tidak ditemukan");
    }
    res.status(200).json(temukanDanUpdate);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.hapusArtikel = async (req, res) => {
  try {
    const hapusArtikel = await artikelSchema.findByIdAndDelete(req.params.id);
    if (!hapusArtikel) {
      res.status(404).json("Artikel tidak ditemukan");
    }
    res.status(200).json("Artikel berhasil dihapus!");
  } catch (error) {
    res.status(500).json(error);
  }
};
