// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Skema untuk setiap pesan dalam sesi chat
// const ChatMessageSchema = new Schema({
//   role: {
//     type: String, // 'user' atau 'model'
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Skema untuk sesi chat keseluruhan
// const ChatSessionSchema = new Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId, // Menghubungkan sesi chat ke ID pengguna
//       ref: "User", // Asumsi Anda memiliki model User
//       required: true,
//     },
//     title: {
//       type: String, // Judul singkat untuk sesi chat (misal: "Chat tentang AI", "Kuis tentang SKI")
//       default: "Sesi Chat Baru", // Judul default
//     },
//     messages: [ChatMessageSchema], // Array dari pesan-pesan dalam sesi
//   },
//   { timestamps: true } // Otomatis menambahkan createdAt dan updatedAt
// );

// module.exports = mongoose.model("ChatSession", ChatSessionSchema);
