const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Skema untuk setiap pesan dalam sesi chat
const ChatMessageSchema = new Schema({
  role: {
    type: String, // 'user' atau 'model'
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Skema untuk Flashcard
const FlashcardSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

// Skema untuk Kuis
const QuizQuestionSchema = new Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ["multipleChoice", "fillInTheBlank"], required: true },
  options: [{ type: String }],
  answer: { type: String, required: true },
});

// Skema untuk sesi chat keseluruhan
const ChatSessionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Sesi Baru",
    },
    mode: {
      type: String, // 'chat', 'quiz', 'flashcards', 'mindmap'
      default: "chat",
    },
    sourceMateri: {
      // Menyimpan informasi materi yang digunakan
      type: String,
      default: "Chat Umum",
    },
    messages: [ChatMessageSchema], // Digunakan hanya untuk mode 'chat'
    quizQuestions: [QuizQuestionSchema], // Digunakan untuk mode 'quiz'
    flashcards: [FlashcardSchema], // Digunakan untuk mode 'flashcards'
    mindMap: {
      // Digunakan untuk mode 'mindmap'
      type: String, // Mind map bisa disimpan sebagai teks terstruktur atau JSON
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatSession", ChatSessionSchema);
