const ChatSession = require("../models/chatSession");

// Membuat sesi chat baru
exports.createChatSession = async (req, res) => {
  try {
    const { userId, initialContent, mode = "chat", sourceMateri = "Chat Umum" } = req.body;
    if (!userId || !initialContent) {
      return res.status(400).json({ message: "userId dan initialContent diperlukan." });
    }

    // Perbaikan: Menangani pembuatan judul untuk mode non-chat
    let title;
    if (mode === "chat" || mode === "askPdf" || mode === "summarizePdf") {
      title = initialContent.substring(0, 50) + (initialContent.length > 50 ? "..." : "");
    } else if (mode === "quiz") {
      title = `Sesi Kuis Baru (${sourceMateri})`;
    } else if (mode === "flashcards") {
      title = `Sesi Flashcard Baru (${sourceMateri})`;
    } else if (mode === "mindmap") {
      title = `Sesi Mind Map Baru (${sourceMateri})`;
    } else {
      title = `Sesi Baru (${sourceMateri})`;
    }

    const newSession = new ChatSession({
      userId,
      title,
      mode,
      sourceMateri,
      // Konten awal disimpan sesuai dengan mode
      ...(mode === "chat" || mode === "askPdf" || mode === "summarizePdf"
        ? { messages: [{ role: "user", content: initialContent }] }
        : mode === "quiz"
        ? { quizQuestions: initialContent }
        : mode === "flashcards"
        ? { flashcards: initialContent }
        : mode === "mindmap"
        ? { mindMap: initialContent }
        : {}),
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

// Fungsi baru untuk memperbarui judul sesi chat
exports.updateChatSessionTitle = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Judul baru diperlukan." });
    }

    const updatedSession = await ChatSession.findByIdAndUpdate(sessionId, { $set: { title: title, updatedAt: new Date() } }, { new: true });

    if (!updatedSession) {
      return res.status(404).json({ message: "Sesi chat tidak ditemukan." });
    }
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Error memperbarui judul sesi chat:", error);
    res.status(500).json({ message: "Gagal memperbarui judul sesi chat.", error: error.message });
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
