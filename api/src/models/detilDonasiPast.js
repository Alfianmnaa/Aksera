const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetilDonasiSchema = new Schema(
  {
    donasiId: {
      type: String,
      required: true,
    },
    permohonan: [
      {
        pemohonId: {
          type: String,
          required: true,
        },
        tujuanPermohonan: {
          type: String,
          required: true,
        },
      },
    ],
    namaStatus: {
      type: String,
      default: "tersedia",
    },
    deskripsiStatus: {
      type: String,
      default: "",
    },
    komunitasPengambilId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DetilDonasi", DetilDonasiSchema);
