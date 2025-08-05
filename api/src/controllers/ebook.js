const EbookSchema = require("../models/ebook");

// Buat Materi Baru
exports.buatMateri = async (req, res) => {
  try {
    const materiBaru = new EbookSchema(req.body);
    const simpanMateri = await materiBaru.save();
    res.status(201).json({
      message: "Materi berhasil dibuat!",
      materi: simpanMateri,
    });
  } catch (error) {
    console.error("Error saat membuat materi:", error);
    res.status(500).json(error);
  }
};

// Dapatkan satu materi berdasarkan ID
exports.getOneMateri = async (req, res) => {
  try {
    const getOne = await EbookSchema.findById(req.params.id);
    if (!getOne) {
      return res.status(404).json("Materi tidak ditemukan");
    }
    res.status(200).json(getOne);
  } catch (error) {
    console.error("Error saat mendapatkan satu materi:", error);
    res.status(500).json(error);
  }
};

// Dapatkan semua materi dengan filter dan pencarian
// exports.getAllMateri = async (req, res) => {
//   try {
//     const { kategori, judul } = req.query;

//     const filter = {};

//     // Filter berdasarkan kategori
//     if (kategori && kategori !== "all") {
//       filter.kategori = { $regex: new RegExp(kategori, "i") };
//     }

//     // Pencarian berdasarkan judulMateri
//     if (judul) {
//       filter.judulMateri = { $regex: new RegExp(judul, "i") };
//     }

//     // Mengurutkan berdasarkan waktu pembuatan terbaru
//     const getAll = await EbookSchema.find(filter).sort({ createdAt: -1 });
//     res.status(200).json(getAll);
//   } catch (error) {
//     console.error("Error saat mendapatkan semua materi:", error);
//     res.status(500).json(error);
//   }
// };

exports.getAllMateri = async (req, res) => {
  try {
    const { kategori, judul, statusMateri } = req.query; // <-- MENAMBAHKAN statusMateri di sini
    const filter = {};

    // Filter berdasarkan kategori
    if (kategori && kategori !== "all") {
      filter.kategori = { $regex: new RegExp(kategori, "i") };
    }

    // Pencarian berdasarkan judulMateri
    if (judul) {
      filter.judulMateri = { $regex: new RegExp(judul, "i") };
    }

    // <-- MENAMBAHKAN FILTER BERDASARKAN STATUS MATERI
    if (statusMateri) {
      filter.statusMateri = statusMateri;
    }

    // Mengurutkan berdasarkan waktu pembuatan terbaru
    const getAll = await EbookSchema.find(filter).sort({ createdAt: -1 });
    res.status(200).json(getAll);
  } catch (error) {
    console.error("Error saat mendapatkan semua materi:", error);
    res.status(500).json(error);
  }
};

// Perbarui Materi
exports.updateMateri = async (req, res) => {
  try {
    const temukanDanUpdate = await EbookSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    if (!temukanDanUpdate) {
      return res.status(404).json("Materi tidak ditemukan");
    }
    res.status(200).json(temukanDanUpdate);
  } catch (error) {
    console.error("Error saat memperbarui materi:", error);
    res.status(500).json(error);
  }
};

// Hapus Materi
exports.hapusMateri = async (req, res) => {
  try {
    const temukanMateri = await EbookSchema.findById(req.params.id);
    if (!temukanMateri) {
      return res.status(404).json("Materi tidak ditemukan");
    }

    await EbookSchema.findByIdAndDelete(req.params.id);
    res.status(200).json("Materi berhasil dihapus!");
  } catch (error) {
    console.error("Error saat menghapus materi:", error);
    res.status(500).json(error);
  }
};

// Dapatkan materi yang disimpan oleh user
exports.getSavedMateri = async (req, res) => {
  try {
    const userId = req.params.id;
    const savedMateris = await EbookSchema.find({ disimpan: userId });
    res.status(200).json(savedMateris);
  } catch (error) {
    console.error("Error saat mendapatkan materi yang disimpan:", error);
    res.status(500).json(error);
  }
};

// Toggle (tambah/hapus) status simpan materi oleh user
exports.toggleSimpanMateri = async (req, res) => {
  try {
    const materiId = req.params.id;
    const userId = req.body.userId;

    const materi = await EbookSchema.findById(materiId);
    if (!materi) return res.status(404).json("Materi tidak ditemukan");

    const index = materi.disimpan.indexOf(userId);
    if (index === -1) {
      materi.disimpan.push(userId);
    } else {
      materi.disimpan.splice(index, 1);
    }

    await materi.save();
    res.status(200).json({ message: "Toggle simpan berhasil", disimpan: materi.disimpan });
  } catch (error) {
    console.error("Error saat toggle simpan materi:", error);
    res.status(500).json(error);
  }
};
