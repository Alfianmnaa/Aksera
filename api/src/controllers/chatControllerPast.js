const ChatSession = require("../models/chatSessionPast");

// Membuat sesi chat baru
exports.createChatSession = async (req, res) => {
  try {
    const { userId, initialMessage } = req.body;
    if (!userId || !initialMessage || !initialMessage.role || !initialMessage.content) {
      return res.status(400).json({ message: "userId dan initialMessage (dengan role dan content) diperlukan." });
    }

    const newSession = new ChatSession({
      userId,
      title: initialMessage.content.substring(0, 50) + (initialMessage.content.length > 50 ? "..." : ""),
      messages: [{ role: initialMessage.role, content: initialMessage.content }],
    });
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.error("Error membuat sesi chat:", error);
    res.status(500).json({ message: "Gagal membuat sesi chat.", error: error.message });
  }
};

// Mendapatkan semua sesi chat untuk seorang pengguna
exports.getChatSessionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error mendapatkan sesi chat berdasarkan pengguna:", error);
    res.status(500).json({ message: "Gagal mengambil sesi chat.", error: error.message });
  }
};

// Mendapatkan sesi chat spesifik berdasarkan ID
exports.getChatSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Sesi chat tidak ditemukan." });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error("Error mendapatkan sesi chat berdasarkan ID:", error);
    res.status(500).json({ message: "Gagal mengambil sesi chat.", error: error.message });
  }
};

// Menambahkan pesan ke sesi chat yang sudah ada
exports.addMessageToSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { newMessage } = req.body;

    if (!newMessage || !newMessage.role || !newMessage.content) {
      return res.status(400).json({ message: "newMessage dengan role dan content diperlukan." });
    }

    const updatedSession = await ChatSession.findByIdAndUpdate(sessionId, { $push: { messages: newMessage }, $set: { updatedAt: new Date() } }, { new: true });

    if (!updatedSession) {
      return res.status(404).json({ message: "Sesi chat tidak ditemukan." });
    }
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Error menambahkan pesan ke sesi:", error);
    res.status(500).json({ message: "Gagal menambahkan pesan ke sesi.", error: error.message });
  }
};

// Menghapus sesi chat
exports.deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const deletedSession = await ChatSession.findByIdAndDelete(sessionId);
    if (!deletedSession) {
      return res.status(404).json({ message: "Sesi chat tidak ditemukan." });
    }
    res.status(200).json({ message: "Sesi chat berhasil dihapus." });
  } catch (error) {
    console.error("Error menghapus sesi chat:", error);
    res.status(500).json({ message: "Gagal menghapus sesi chat.", error: error.message });
  }
};
