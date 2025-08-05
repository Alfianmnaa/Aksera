const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonasiSchema = new Schema(
  {
    donasiUid: {
      type: String,
      required: true,
    },
    namaBarang: {
      type: String,
      required: true,
    },
    fotoBarang: {
      type: String,
      required: true,
    },
    provinsi: {
      type: String,
      required: true,
    },
    kabupaten: {
      type: String,
      required: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
    kategori: {
      type: String,
      required: true,
    },
    kondisiBarang: {
      type: String,
      required: true,
    },
    disimpan: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donasi", DonasiSchema);
