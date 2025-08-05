const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EbookSchema = new Schema(
  {
    materiUid: {
      type: String,
      required: true,
    },
    coverMateri: {
      type: String,
      required: true,
    },
    judulMateri: {
      type: String,
      required: true,
    },
    linkMateri: {
      type: String,
      required: true,
    },
    kategori: {
      type: String,
      required: true,
    },
    penerbit: {
      type: String,
      default: "",
    },
    judulISBN: {
      type: String,
      default: "",
    },
    edisi: {
      type: String,
      default: "",
    },
    penulis: {
      type: String,
      required: true,
    },
    statusMateri: {
      type: String,
      required: true,
      default: "belum terverifikasi",
    },
    disimpan: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ebook", EbookSchema);
