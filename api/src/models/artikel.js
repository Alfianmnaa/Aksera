const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtikelSchema = new Schema(
  {
    artikelUid: {
      type: String,
      required: true,
    },
    judulArtikel: {
      type: String,
      required: true,
    },
    coverUrl: {
      type: String,
      required: true,
    },
    deskArtikel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ArtikelSchema", ArtikelSchema);
