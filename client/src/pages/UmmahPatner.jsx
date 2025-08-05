import React, { useEffect, useState, useContext, useRef } from "react";
import { axiosInstance } from "../config";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaFilePdf,
  FaQuestionCircle,
  FaBookOpen,
  FaSpinner,
  FaCopy,
  FaDownload,
  FaSearch,
  FaPlus,
  FaHistory,
  FaTrash,
  FaTimes, // Untuk tombol close modal
  FaLightbulb, // Untuk flashcards
  FaProjectDiagram, // Untuk mind maps
  FaEdit, // New: Untuk tombol edit
  FaCheck, // New: Untuk tombol simpan
} from "react-icons/fa";
import * as pdfjs from "pdfjs-dist";
import { jsPDF } from "jspdf";
import mermaid from "mermaid";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

// Konfigurasi PDF.js worker. Pastikan file ini ada di public/pdf-worker/
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.js";

// Konfigurasi Mermaid.js sekali saat aplikasi dimuat
mermaid.initialize({
  startOnLoad: false,
  theme: "forest",
  fontFamily: "Inter, sans-serif",
});

// Flashcard component for the UI
const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="flashcard-container perspective-1000 w-full max-w-sm mx-auto h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transform-style-3d transition-transform duration-500 rounded-xl shadow-lg ${isFlipped ? "rotate-y-180" : ""}`}>
        {/* Front side */}
        <div className="absolute backface-hidden w-full h-full bg-white rounded-xl flex items-center justify-center p-6 text-center text-gray-800">
          <p className="font-semibold text-lg">{question}</p>
        </div>
        {/* Back side */}
        <div className="absolute backface-hidden rotate-y-180 w-full h-full bg-[#F79319] rounded-xl flex items-center justify-center p-6 text-center text-white">
          <p className="text-lg">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default function UmmahPartner() {
  const { user } = useContext(UserContext);
  const chatContainerRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const mindMapRef = useRef(null); // Ref for mind map div
  const mindMapSvgRef = useRef(null); // Ref for the rendered SVG

  // State untuk mode dan input chat
  const [currentMode, setCurrentMode] = useState("chat");
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Untuk proses generate
  const [isTyping, setIsTyping] = useState(false); // Untuk efek 'mengetik...'

  // State untuk riwayat sesi chat
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatSessionId, setCurrentChatSessionId] = useState(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null); // New: State untuk melacak sesi yang sedang diedit
  const [newSessionTitle, setNewSessionTitle] = useState(""); // New: State untuk judul baru

  // State untuk fitur PDF
  const [materis, setMateris] = useState([]);
  const [pdfSourceType, setPdfSourceType] = useState("database");
  const [selectedDatabaseMateriId, setSelectedDatabaseMateriId] = useState("");
  const [searchMateriQuery, setSearchMateriQuery] = useState("");
  const [filteredDatabaseMateris, setFilteredDatabaseMateris] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [uploadedPdfFile, setUploadedPdfFile] = useState(null);
  const [uploadedPdfFileName, setUploadedPdfFileName] = useState("");
  const [pdfTextContent, setPdfTextContent] = useState("");
  const [isPdfProcessing, setIsPdfProcessing] = useState(false);
  const [askPdfQuestion, setAskPdfQuestion] = useState("");

  // State untuk generated content
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [mindMapContent, setMindMapContent] = useState("");
  const [mindMapImage, setMindMapImage] = useState(null);
  const [quizType, setQuizType] = useState("multipleChoice");
  const [numQuestions, setNumQuestions] = useState(3);

  // --- Side Effects ---

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const fetchMateris = async () => {
      try {
        const res = await axiosInstance.get("/materi/getall");
        setMateris(res.data);
        setFilteredDatabaseMateris(res.data);
      } catch (err) {
        console.error("Gagal memuat daftar materi:", err);
        Swal.fire("Error", "Gagal memuat daftar materi. Silakan coba lagi.", "error");
      }
    };
    fetchMateris();
  }, []);

  useEffect(() => {
    if (searchMateriQuery) {
      const filtered = materis.filter((materi) => materi.judulMateri.toLowerCase().includes(searchMateriQuery.toLowerCase()));
      setFilteredDatabaseMateris(filtered);
    } else {
      setFilteredDatabaseMateris(materis);
    }
    setShowSearchDropdown(searchMateriQuery.length > 0 && filteredDatabaseMateris.length > 0);
  }, [searchMateriQuery, materis]);

  useEffect(() => {
    setPdfTextContent("");
    if (pdfSourceType === "database" && selectedDatabaseMateriId) {
      const materi = materis.find((m) => m._id === selectedDatabaseMateriId);
      if (materi) {
        processPdf(materi.linkMateri);
      }
    } else if (pdfSourceType === "upload" && uploadedPdfFile) {
      processPdf(uploadedPdfFile);
    }
  }, [pdfSourceType, selectedDatabaseMateriId, uploadedPdfFile, materis]);

  useEffect(() => {
    if (mindMapContent && mindMapSvgRef.current) {
      const renderMindMap = async () => {
        try {
          // Membersihkan konten dari tag kode dan spasi yang tidak perlu
          const cleanedMindMapContent = mindMapContent.replace(/```mermaid\n|```/g, "").trim();

          const finalContent = cleanedMindMapContent.startsWith("mindmap") ? cleanedMindMapContent : `mindmap\n${cleanedMindMapContent}`;

          const { svg } = await mermaid.render("mindmap-svg", finalContent);
          mindMapSvgRef.current.innerHTML = svg;
        } catch (error) {
          console.error("Mermaid rendering error:", error);
          mindMapSvgRef.current.innerHTML = `<p class="text-center text-red-500">Gagal merender mind map. Sintaks tidak valid.</p><pre>${mindMapContent}</pre>`;
        }
      };
      renderMindMap();
    }
  }, [mindMapContent]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchChatSessions(user._id);
    }
  }, [user?._id]);

  const fetchChatSessions = async (userId) => {
    setIsHistoryLoading(true);
    try {
      const res = await axiosInstance.get(`/chat/user/${userId}`);
      setChatSessions(res.data);
    } catch (err) {
      console.error("Gagal memuat sesi chat:", err);
      Swal.fire("Error", "Gagal memuat riwayat chat. Silakan coba lagi.", "error");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const loadSession = async (session) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/chat/${session._id}`);
      const loadedSession = res.data;
      setCurrentChatSessionId(session._id);
      setCurrentMode(loadedSession.mode);

      setChatHistory([]);
      setQuizQuestions([]);
      setFlashcards([]);
      setMindMapContent("");

      if (loadedSession.mode === "chat" || loadedSession.mode === "askPdf" || loadedSession.mode === "summarizePdf") {
        setChatHistory(
          loadedSession.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            parts: [{ text: msg.content }],
          }))
        );
      } else if (loadedSession.mode === "quiz") {
        setQuizQuestions(loadedSession.quizQuestions);
      } else if (loadedSession.mode === "flashcards") {
        setFlashcards(loadedSession.flashcards);
      } else if (loadedSession.mode === "mindmap") {
        setMindMapContent(loadedSession.mindMap);
      }

      Swal.fire({ icon: "success", title: "Sesi Dimuat", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
      setShowHistoryModal(false);
    } catch (err) {
      console.error("Gagal memuat sesi chat:", err);
      Swal.fire("Error", "Gagal memuat sesi chat. Silakan coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentChatSessionId(null);
    setChatHistory([]);
    setInputMessage("");
    setAskPdfQuestion("");
    setQuizQuestions([]);
    setFlashcards([]);
    setMindMapContent("");
    Swal.fire({
      icon: "info",
      title: "Chat Baru Dimulai",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
    setShowHistoryModal(false);
  };

  const deleteChatSession = async (sessionId) => {
    Swal.fire({
      title: "Anda yakin?",
      text: "Sesi chat ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F79319",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/chat/${sessionId}`);
          Swal.fire("Dihapus!", "Sesi chat Anda telah dihapus.", "success");
          fetchChatSessions(user._id);
          if (currentChatSessionId === sessionId) {
            startNewChat();
          }
        } catch (err) {
          console.error("Gagal menghapus sesi chat:", err);
          Swal.fire("Error", "Gagal menghapus sesi chat. Silakan coba lagi.", "error");
        }
      }
    });
  };

  // New: Fungsi untuk mengupdate judul sesi chat
  const handleRenameSession = async (sessionId, newTitle) => {
    if (!newTitle.trim()) {
      Swal.fire("Peringatan", "Judul sesi tidak boleh kosong.", "warning");
      return;
    }
    try {
      await axiosInstance.put(`/chat/update-title/${sessionId}`, { title: newTitle });
      Swal.fire({ icon: "success", title: "Judul diperbarui!", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
      setEditingSessionId(null);
      fetchChatSessions(user._id);
    } catch (error) {
      console.error("Gagal memperbarui judul sesi:", error);
      Swal.fire("Error", "Gagal memperbarui judul sesi. Silakan coba lagi.", "error");
    }
  };

  const startRenaming = (session) => {
    setEditingSessionId(session._id);
    setNewSessionTitle(session.title);
  };

  const handleSaveRename = (sessionId) => {
    handleRenameSession(sessionId, newSessionTitle);
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
    setNewSessionTitle("");
  };

  const saveMessageToBackend = async (message, currentSessionId) => {
    if (!user?._id) return null;

    try {
      if (!currentSessionId) {
        const res = await axiosInstance.post("/chat", {
          userId: user._id,
          initialContent: message.content,
          mode: "chat",
          sourceMateri: "Chat Umum",
        });
        setCurrentChatSessionId(res.data._id);
        fetchChatSessions(user._id);
        return res.data._id;
      } else {
        await axiosInstance.put(`/chat/${currentSessionId}/message`, {
          newMessage: { role: message.role, content: message.content },
        });
        fetchChatSessions(user._id);
        return currentSessionId;
      }
    } catch (error) {
      console.error("Gagal menyimpan pesan ke backend:", error);
      Swal.fire("Error", "Gagal menyimpan riwayat chat. Silakan coba lagi.", "error");
      return null;
    }
  };

  const saveGeneratedContentToBackend = async (content, mode, materiTitle) => {
    if (!user?._id) return null;

    try {
      // Perbaikan: initialContent untuk mode non-chat dikirim sebagai array/objek
      // Backend sekarang sudah diperbaiki untuk menangani ini dengan benar
      const res = await axiosInstance.post("/chat", {
        userId: user._id,
        initialContent: content,
        mode,
        sourceMateri: materiTitle,
      });
      setCurrentChatSessionId(res.data._id);
      fetchChatSessions(user._id);
      return res.data._id;
    } catch (error) {
      console.error("Gagal menyimpan konten ke backend:", error);
      Swal.fire("Error", "Gagal menyimpan konten. Silakan coba lagi.", "error");
      return null;
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const processPdf = async (source) => {
    if (!source) {
      setPdfTextContent("");
      return;
    }
    setIsPdfProcessing(true);
    setPdfTextContent("");
    try {
      let pdfData;
      if (typeof source === "string") {
        pdfData = source;
      } else if (source instanceof File) {
        pdfData = await readFileAsArrayBuffer(source);
      } else {
        throw new Error("Invalid PDF source.");
      }

      const loadingTask = pdfjs.getDocument(pdfData);
      const pdf = await loadingTask.promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
      }
      setPdfTextContent(fullText);
    } catch (err) {
      console.error("Gagal memproses PDF:", err);
      Swal.fire("Error", "Gagal mengekstrak teks dari PDF. Pastikan URL PDF valid atau file tidak rusak.", "error");
      setPdfTextContent("Gagal mengekstrak teks dari PDF.");
    } finally {
      setIsPdfProcessing(false);
    }
  };

  const callGeminiApi = async (conversationForGemini, schema = null) => {
    if (currentMode === "chat" || currentMode === "askPdf" || currentMode === "summarizePdf") {
      setIsTyping(true);
    } else {
      setIsLoading(true);
    }

    if (!conversationForGemini || conversationForGemini.length === 0) {
      console.error("Error: 'contents' array is empty for Gemini API call.");
      throw new Error("Pesan untuk AI tidak boleh kosong.");
    }

    const payload = {
      contents: conversationForGemini,
    };

    if (schema) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema,
      };
    }

    const apiKey = "";

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        console.error("API response not OK (status:", response.status, "):", result);
        throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(result)}`);
      }

      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        return text;
      } else {
        console.error("Unexpected API response structure:", result);
        throw new Error("AI response is not in the expected format.");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      Swal.fire("Error", `An error occurred while communicating with AI: ${error.message}. Please try again.`, "error");
      return null;
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const checkLoginAndProceed = async (callback) => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Anda Belum Login",
        text: "Silakan login untuk menggunakan fitur Ummah Partner AI.",
        showCancelButton: true,
        confirmButtonText: "Login Sekarang",
        cancelButtonText: "Nanti Saja",
        confirmButtonColor: "#F79319",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/masuk";
        }
      });
      return false;
    }
    return await callback();
  };

  const handleGeneralChatSubmit = async (e) => {
    e.preventDefault();
    if (!(await checkLoginAndProceed(() => true))) return;
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage, parts: [{ text: inputMessage }] };
    const conversationForGemini = [...chatHistory, userMessage].map((msg) => ({ role: msg.role, parts: msg.parts }));

    setChatHistory((prev) => [...prev, userMessage]);
    setInputMessage("");

    const activeSessionId = await saveMessageToBackend(userMessage, currentChatSessionId);
    if (!activeSessionId) return;

    const modelResponseText = await callGeminiApi(conversationForGemini);

    if (modelResponseText) {
      const modelMessage = { role: "model", content: modelResponseText, parts: [{ text: modelResponseText }] };
      setChatHistory((prev) => [...prev, modelMessage]);
      await saveMessageToBackend(modelMessage, activeSessionId);
    }
  };

  const handleAskPdfSubmit = async (e) => {
    e.preventDefault();
    if (!(await checkLoginAndProceed(() => true))) return;
    if (!pdfTextContent.trim() || !askPdfQuestion.trim()) {
      Swal.fire("Warning", "Teks PDF belum dimuat atau pertanyaan kosong.", "warning");
      return;
    }
    const materiTitle = pdfSourceType === "database" && selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "PDF Lokal";
    const userMessageContent = `Pertanyaan: ${askPdfQuestion}`;
    const userMessage = { role: "user", content: userMessageContent, parts: [{ text: userMessageContent }] };

    setChatHistory((prev) => [...prev, userMessage]);
    setAskPdfQuestion("");
    setIsTyping(true);

    const prompt = `Berdasarkan teks PDF berikut:\n\n${pdfTextContent}\n\nJawab pertanyaan ini: ${askPdfQuestion}`;
    const modelResponseText = await callGeminiApi([{ role: "user", parts: [{ text: prompt }] }]);
    setIsTyping(false);

    if (modelResponseText) {
      const modelMessage = { role: "model", content: modelResponseText, parts: [{ text: modelResponseText }] };
      setChatHistory((prev) => [...prev, modelMessage]);
      const activeSessionId = await saveMessageToBackend(userMessage, currentChatSessionId);
      if (activeSessionId) {
        await saveMessageToBackend(modelMessage, activeSessionId);
      }
    }
  };

  const handleSummarizePdf = async () => {
    if (!(await checkLoginAndProceed(() => true))) return;
    if (!pdfTextContent.trim()) {
      Swal.fire("Warning", "Teks PDF belum dimuat atau kosong.", "warning");
      return;
    }
    const materiTitle = pdfSourceType === "database" && selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "PDF Lokal";
    const userMessageContent = `[Ringkas PDF] Materi: ${materiTitle}`;
    const userMessage = { role: "user", content: userMessageContent, parts: [{ text: userMessageContent }] };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const prompt = `Ringkas teks PDF berikut dalam format poin-poin penting:\n\n${pdfTextContent}`;
    const modelResponseText = await callGeminiApi([{ role: "user", parts: [{ text: prompt }] }]);
    setIsTyping(false);

    if (modelResponseText) {
      const modelMessage = { role: "model", content: modelResponseText, parts: [{ text: modelResponseText }] };
      setChatHistory((prev) => [...prev, modelMessage]);
      const activeSessionId = await saveMessageToBackend(userMessage, currentChatSessionId);
      if (activeSessionId) {
        await saveMessageToBackend(modelMessage, activeSessionId);
      }
    }
  };

  const handleGenerateQuiz = async () => {
    if (!(await checkLoginAndProceed(() => true))) return;
    if (!pdfTextContent.trim()) {
      Swal.fire("Warning", "Teks PDF belum dimuat atau kosong.", "warning");
      return;
    }

    setQuizQuestions([]);
    setIsLoading(true);
    const materiTitle = pdfSourceType === "database" && selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "PDF Lokal";

    let prompt = `Buat ${numQuestions} pertanyaan ${
      quizType === "multipleChoice" ? "pilihan ganda dengan 4 opsi dan 1 jawaban benar" : "isian singkat"
    } dari materi berikut. Format output harus JSON array of objects dengan properti 'question', 'answer'${quizType === "multipleChoice" ? ", dan 'options'" : ""}, serta 'type' yang sesuai. Materi: ${pdfTextContent}`;

    const quizSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          type: { type: "STRING", enum: ["multipleChoice", "fillInTheBlank"] },
          options: { type: "ARRAY", items: { type: "STRING" } },
          answer: { type: "STRING" },
        },
        required: ["question", "answer", "type"],
      },
    };

    const jsonResponse = await callGeminiApi([{ role: "user", parts: [{ text: prompt }] }], quizSchema);
    if (jsonResponse) {
      try {
        const parsedQuiz = JSON.parse(jsonResponse);
        setQuizQuestions(parsedQuiz);
        await saveGeneratedContentToBackend(parsedQuiz, "quiz", materiTitle);
        Swal.fire("Success!", "Kuis berhasil dibuat dan disimpan.", "success");
      } catch (e) {
        console.error("Failed to parse quiz response:", e);
        Swal.fire("Error", "Gagal membuat kuis. Respon AI tidak valid.", "error");
      }
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!(await checkLoginAndProceed(() => true))) return;
    if (!pdfTextContent.trim()) {
      Swal.fire("Warning", "Teks PDF belum dimuat atau kosong.", "warning");
      return;
    }

    setFlashcards([]);
    setIsLoading(true);
    const materiTitle = pdfSourceType === "database" && selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "PDF Lokal";
    const prompt = `Buat flashcards dari materi berikut. Format output harus JSON array of objects dengan properti "question" dan "answer". Berikan setidaknya 10 flashcards. Materi: ${pdfTextContent}`;

    const flashcardSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { question: { type: "STRING" }, answer: { type: "STRING" } },
        required: ["question", "answer"],
      },
    };

    const jsonResponse = await callGeminiApi([{ role: "user", parts: [{ text: prompt }] }], flashcardSchema);
    if (jsonResponse) {
      try {
        const parsedFlashcards = JSON.parse(jsonResponse);
        setFlashcards(parsedFlashcards);
        await saveGeneratedContentToBackend(parsedFlashcards, "flashcards", materiTitle);
        Swal.fire("Success!", "Flashcards berhasil dibuat dan disimpan.", "success");
      } catch (e) {
        console.error("Failed to parse flashcard response:", e);
        Swal.fire("Error", "Gagal membuat flashcards. Respon AI tidak valid.", "error");
      }
    }
  };

  const handleGenerateMindMap = async () => {
    if (!(await checkLoginAndProceed(() => true))) return;
    if (!pdfTextContent.trim()) {
      Swal.fire("Warning", "Teks PDF belum dimuat atau kosong.", "warning");
      return;
    }

    setMindMapContent("");
    setMindMapImage(null);
    setIsLoading(true);
    const materiTitle = pdfSourceType === "database" && selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "PDF Lokal";

    const prompt = `Buat mind map dari materi berikut dalam sintaks Mermaid.js dengan format 'mindmap'. Fokus hanya pada topik utama dan sub-topik penting, hindari cabang yang terlalu banyak dan detail yang tidak perlu seperti 'penulis' atau 'ISBN'. Gunakan hierarki berbasis indentasi.
    Contoh struktur yang diinginkan:
    mindmap
      root((Topik Utama))
        Sub-Topik 1
          Key Point 1
          Key Point 2
        Sub-Topik 2
          Key Point 3
    Materi: ${pdfTextContent}`;

    try {
      const textResponse = await callGeminiApi([{ role: "user", parts: [{ text: prompt }] }]);
      if (textResponse) {
        const cleanedResponse = textResponse
          .replace(/```mermaid\n|```/g, "")
          .replace(/^[ \t]*mindmap/i, "mindmap")
          .trim();

        // Simpan konten mentah untuk dirender oleh useEffect
        setMindMapContent(cleanedResponse);
        await saveGeneratedContentToBackend(cleanedResponse, "mindmap", materiTitle);
        Swal.fire("Success!", "Mind map berhasil dibuat dan disimpan.", "success");
      }
    } catch (e) {
      Swal.fire("Error", "Gagal membuat mind map. Silakan coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadMindMapPdf = async () => {
    if (!mindMapSvgRef.current) {
      Swal.fire("Peringatan", "Tidak ada mind map yang tersedia untuk diunduh.", "warning");
      return;
    }

    try {
      const svgElement = mindMapSvgRef.current.querySelector("svg");
      if (!svgElement) {
        Swal.fire("Error", "SVG tidak ditemukan.", "error");
        return;
      }

      // Dapatkan bounding box dari konten SVG
      const bbox = svgElement.getBBox();
      const svgWidth = bbox.width;
      const svgHeight = bbox.height;

      // Buat elemen canvas sementara
      const canvas = document.createElement("canvas");
      // Gunakan faktor skala untuk kualitas gambar yang lebih baik
      const scale = 2;
      canvas.width = svgWidth * scale;
      canvas.height = svgHeight * scale;
      const ctx = canvas.getContext("2d");

      // Menggambar SVG ke dalam canvas
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + btoa(svgData);

      img.onload = () => {
        // Gambar SVG yang telah diubah menjadi PNG ke dalam canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL("image/jpeg", 0.9); // Menggunakan JPEG untuk ukuran file lebih kecil

        // Tentukan orientasi dan ukuran halaman PDF berdasarkan dimensi mind map
        const orientation = svgWidth > svgHeight ? "l" : "p";
        const pdf = new jsPDF(orientation, "pt", [svgWidth, svgHeight]);

        // Tambahkan gambar ke PDF
        pdf.addImage(imgData, "JPEG", 0, 0, svgWidth, svgHeight);

        const materiTitle = selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "Local PDF";
        const fileName = `MindMap_${materiTitle.replace(/\s/g, "_").substring(0, 50)}.pdf`;
        pdf.save(fileName);
      };
    } catch (error) {
      console.error("Gagal mengunduh mind map:", error);
      Swal.fire("Error", "Gagal mengunduh mind map. Silakan coba lagi.", "error");
    }
  };

  const handleCopyChat = (textToCopy) => {
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      Swal.fire({ icon: "success", title: "Copied!", text: "Text copied to clipboard.", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      Swal.fire({ icon: "error", title: "Copy Failed", text: "Could not copy text.", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
    }
    document.body.removeChild(textarea);
  };

  const handleDownloadQuizPdf = () => {
    if (quizQuestions.length === 0) {
      Swal.fire("Peringatan", "Tidak ada kuis untuk diunduh.", "warning");
      return;
    }

    const doc = new jsPDF();
    let yPos = 10;
    const margin = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const maxTextWidth = pageWidth - 2 * margin;

    doc.setFontSize(18);
    doc.text("Quiz Ummah Partner AI", margin, yPos);
    yPos += 10;
    doc.setFontSize(12);
    const materiTitle = selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "Local PDF";
    doc.text(`Material: ${materiTitle}`, margin, yPos);
    yPos += 10;
    doc.text(`Quiz Type: ${quizType === "multipleChoice" ? "Multiple Choice" : "Fill in the Blank"}`, margin, yPos);
    yPos += 15;

    quizQuestions.forEach((q, index) => {
      doc.setFontSize(12);
      const questionNumberText = `${index + 1}. `;
      const questionLines = doc.splitTextToSize(q.question, maxTextWidth - doc.getTextWidth(questionNumberText));
      const estimatedHeightNeeded = questionLines.length * lineHeight + (q.type === "multipleChoice" ? q.options.length * lineHeight : lineHeight) + lineHeight * 3;

      if (yPos + estimatedHeightNeeded > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }

      doc.text(questionNumberText, margin, yPos);
      doc.text(questionLines, margin + doc.getTextWidth(questionNumberText), yPos);
      yPos += questionLines.length * lineHeight;

      if (q.type === "multipleChoice" && q.options) {
        const alphabet = ["A", "B", "C", "D"];
        q.options.forEach((option, optIndex) => {
          const optionPrefix = `   ${alphabet[optIndex]}. `;
          const optionLines = doc.splitTextToSize(option, maxTextWidth - doc.getTextWidth(optionPrefix));
          doc.text(optionPrefix, margin, yPos);
          doc.text(optionLines, margin + doc.getTextWidth(optionPrefix), yPos);
          yPos += optionLines.length * lineHeight;
        });
      } else if (q.type === "fillInTheBlank") {
        doc.text("   (Fill in the answer here)", margin, yPos);
        yPos += lineHeight;
      }

      doc.setFontSize(10);
      doc.setTextColor(0, 128, 0);
      const answerPrefix = "Jawaban: ";
      const answerLines = doc.splitTextToSize(q.answer, maxTextWidth - doc.getTextWidth(answerPrefix));
      doc.text(answerPrefix, margin, yPos);
      doc.text(answerLines, margin + doc.getTextWidth(answerPrefix), yPos);
      doc.setTextColor(0, 0, 0);
      yPos += answerLines.length * lineHeight;

      yPos += lineHeight;
    });

    const fileNameMateri = materiTitle.replace(/\s/g, "_").substring(0, 50);
    doc.save(`Quiz_${fileNameMateri}.pdf`);
  };

  const formatText = (text) => {
    if (!text) return null;
    let formattedText = text;
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");
    formattedText = formattedText.replace(/(?<!\n)\n(?!\n)/g, "<br />");
    formattedText = formattedText.replace(/^[*-]\s*(.*)$/gm, "<li>$1</li>");
    formattedText = formattedText.replace(/^\*\s*([A-Za-z\s]+:)/gm, "<p><strong>$1</strong></p>");
    formattedText = formattedText.replace(/(<li>.*?<\/li>)+/gs, "<ul>$&</ul>");
    formattedText = formattedText
      .split("\n\n")
      .map((block) => {
        if (block.startsWith("<ul>") || block.startsWith("<p>") || block.trim() === "") {
          return block;
        }
        return `<p>${block}</p>`;
      })
      .join("");
    formattedText = formattedText.replace(/<\/ul>\s*<ul>/g, "");
    formattedText = formattedText.replace(/<\/p>\s*<p>/g, "");
    formattedText = formattedText.replace(/<p><\/p>/g, "");
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  const renderMainContent = () => {
    if (currentMode === "chat" || currentMode === "askPdf" || currentMode === "summarizePdf") {
      return (
        <div className="flex-1 flex flex-col ">
          <div ref={chatContainerRef} className="overflow-y-auto space-y-4 bg-gray-50 px-6 py-4 h-[calc(100vh-144px)]">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 p-4 bg-white rounded-xl shadow-sm">
                <p className="text-lg mb-2">Halo, aku Ummah Partner AI!</p>
                <p className="text-sm">Mulai chat baru atau klik "Lihat Riwayat Percakapan" di panel kiri untuk melanjutkan sesi lama.</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div key={index} className={`flex items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-xl shadow-md relative ${msg.role === "user" ? "bg-[#316B6C] text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
                    <p className="font-semibold mb-1 flex items-center">
                      {msg.role === "user" ? (
                        <>
                          <FaUser className="mr-2 text-white" /> Anda
                        </>
                      ) : (
                        <>
                          <FaRobot className="mr-2 text-gray-600" /> Ummah Partner
                        </>
                      )}
                      <button
                        onClick={() => handleCopyChat(msg.parts[0].text)}
                        className={`ml-auto opacity-70 hover:opacity-100 transition-opacity focus:outline-none ${msg.role === "user" ? "text-white" : "text-gray-600"}`}
                        title="Copy message"
                      >
                        <FaCopy className="text-sm ml-2" />
                      </button>
                    </p>
                    {formatText(msg.parts[0].text)}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start items-start">
                <div className="max-w-[70%] p-4 rounded-xl shadow-md bg-gray-200 text-gray-800 rounded-bl-none">
                  <p className="font-semibold mb-1 flex items-center">
                    <FaRobot className="mr-2 text-gray-600" /> Ummah Partner
                  </p>
                  <p className="flex items-center animate-pulse">
                    <FaSpinner className="animate-spin mr-2" /> mengetik...
                  </p>
                </div>
              </div>
            )}
          </div>
          {(currentMode === "askPdf" || currentMode === "summarizePdf") && (
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg shadow-inner">
              <p className="text-gray-500 text-sm italic">
                Anda berada di mode <span className="font-semibold">{currentMode === "askPdf" ? "Tanya PDF" : "Ringkas PDF"}</span>. Gunakan panel kiri untuk mengirim permintaan.
              </p>
            </div>
          )}
          {currentMode === "chat" && (
            <form onSubmit={handleGeneralChatSubmit} className="p-4 border-t border-gray-200 bg-white shadow-inner sticky bottom-0 z-10">
              <div className="flex items-center">
                <textarea
                  className="flex-1 p-3 border border-gray-300 rounded-xl resize-none focus:ring-[#F79319] focus:border-[#F79319] mr-3 text-base"
                  rows="1"
                  placeholder="Ketik pesan Anda..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      handleGeneralChatSubmit(e);
                    }
                  }}
                  disabled={isTyping}
                />
                <button type="submit" className="bg-[#316B6C] text-white p-3 rounded-full hover:bg-[#2A5C5D] transition-colors duration-300 disabled:opacity-50 shadow-md" disabled={isTyping || !inputMessage.trim()}>
                  <FaPaperPlane className="text-lg" />
                </button>
              </div>
            </form>
          )}
        </div>
      );
    } else if (currentMode === "quiz") {
      return (
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-xl font-semibold mb-4">Hasil Kuis Anda:</h4>
            {isLoading ? (
              <div className="text-center text-gray-500 py-10">
                <FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-[#F79319]" />
                <p>Menciptakan kuis...</p>
              </div>
            ) : quizQuestions.length > 0 ? (
              quizQuestions.map((q, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                  <p className="font-medium text-gray-800 text-lg">
                    <span className="font-bold">{index + 1}.</span> {q.question}
                  </p>
                  {q.type === "multipleChoice" && (
                    <ul className="list-none mt-3 text-sm text-gray-700 space-y-1">
                      {q.options.map((option, optIndex) => (
                        <li key={optIndex}>
                          <span className="font-semibold">{String.fromCharCode(65 + optIndex)}.</span> {option}
                        </li>
                      ))}
                    </ul>
                  )}
                  {q.type === "fillInTheBlank" && (
                    <p className="mt-3 text-sm text-gray-500">
                      <i>Isian Singkat</i>
                    </p>
                  )}
                  <p className="mt-3 text-sm text-green-700 border-t pt-2 border-gray-100">
                    <strong className="text-gray-800">Jawaban:</strong> {q.answer}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">Tidak ada kuis yang dihasilkan.</div>
            )}
            {quizQuestions.length > 0 && (
              <button onClick={handleDownloadQuizPdf} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 mt-4 flex items-center justify-center shadow-md">
                <FaDownload className="mr-2" /> Unduh Kuis sebagai PDF
              </button>
            )}
          </div>
        </div>
      );
    } else if (currentMode === "flashcards") {
      return (
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 flex flex-col items-center">
          <h4 className="text-xl font-semibold mb-6">Flashcards Anda</h4>
          {isLoading ? (
            <div className="text-center text-gray-500 py-10">
              <FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-[#F79319]" />
              <p>Menciptakan flashcards...</p>
            </div>
          ) : flashcards.length > 0 ? (
            <div className="w-full max-w-2xl">
              <Swiper
                pagination={{
                  type: "fraction",
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
              >
                {flashcards.map((card, index) => (
                  <SwiperSlide key={index}>
                    <Flashcard question={card.question} answer={card.answer} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">Tidak ada flashcards yang dihasilkan.</div>
          )}
        </div>
      );
    } else if (currentMode === "mindmap") {
      return (
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-xl font-semibold mb-4">Mind Map Anda</h4>
            {isLoading ? (
              <div className="text-center text-gray-500 py-10">
                <FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-[#F79319]" />
                <p>Menciptakan mind map...</p>
              </div>
            ) : mindMapContent ? (
              <>
                <div ref={mindMapSvgRef} className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-gray-800 w-full flex items-center justify-center"></div>
                <button onClick={handleDownloadMindMapPdf} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 mt-4 flex items-center justify-center shadow-md">
                  <FaDownload className="mr-2" /> Unduh Mind Map sebagai PDF
                </button>
              </>
            ) : (
              <div className="text-center text-gray-500 py-10">Tidak ada mind map yang dihasilkan.</div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="p-6 flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500 p-8 bg-white rounded-xl shadow-sm">
          <p className="text-xl mb-4">Halo, aku Ummah Partner AI!</p>
          <p className="text-sm">Pilih mode dari panel kiri untuk memulai.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter text-gray-800">
      {/* Panel Kiri: Kontrol Fitur */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white p-6 shadow-lg flex flex-col overflow-y-auto rounded-lg md:rounded-r-none">
        <h2 className="text-2xl font-bold text-center text-[#F79319] mb-6">Ummah Partner</h2>

        {/* Tombol Navigasi Mode */}
        <div className="grid grid-cols-2 gap-3 mb-6 border-b pb-4 border-gray-200">
          <button
            onClick={() => {
              setCurrentMode("chat");
              setQuizQuestions([]);
              setFlashcards([]);
              setMindMapContent("");
            }}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "chat" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaRobot className="mr-2" /> Chat Umum
          </button>
          <button
            onClick={() => {
              setCurrentMode("askPdf");
              setQuizQuestions([]);
              setFlashcards([]);
              setMindMapContent("");
            }}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "askPdf" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaFilePdf className="mr-2" /> Tanya PDF
          </button>
          <button
            onClick={() => {
              setCurrentMode("summarizePdf");
              setQuizQuestions([]);
              setFlashcards([]);
              setMindMapContent("");
            }}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "summarizePdf" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaBookOpen className="mr-2" /> Ringkas PDF
          </button>
          <button
            onClick={() => {
              setCurrentMode("quiz");
              setChatHistory([]);
              setFlashcards([]);
              setMindMapContent("");
            }}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "quiz" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaQuestionCircle className="mr-2" /> Buat Kuis
          </button>
          <button
            onClick={() => {
              setCurrentMode("flashcards");
              setChatHistory([]);
              setQuizQuestions([]);
              setMindMapContent("");
            }}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "flashcards" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaLightbulb className="mr-2" /> Flashcards
          </button>
          <button
            onClick={() => {
              setCurrentMode("mindmap");
              setChatHistory([]);
              setQuizQuestions([]);
              setFlashcards([]);
            }}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "mindmap" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaProjectDiagram className="mr-2" /> Mind Map
          </button>
        </div>

        {/* Tombol Buka Riwayat Percakapan */}
        <button onClick={() => setShowHistoryModal(true)} className="w-full bg-[#F79319] text-white py-3 rounded-xl font-semibold hover:bg-[#E07B00] transition-colors duration-300 flex items-center justify-center shadow-md mb-6">
          <FaHistory className="mr-2" /> Lihat Riwayat Percakapan
        </button>

        {/* --- Pilihan Sumber PDF (Database / Upload) --- */}
        {(currentMode === "askPdf" || currentMode === "summarizePdf" || currentMode === "quiz" || currentMode === "flashcards" || currentMode === "mindmap") && (
          <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Sumber PDF:</label>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="pdfSource"
                  value="database"
                  checked={pdfSourceType === "database"}
                  onChange={() => {
                    setPdfSourceType("database");
                    setUploadedPdfFile(null);
                    setUploadedPdfFileName("");
                    setPdfTextContent("");
                  }}
                  className="form-radio h-5 w-5 text-[#F79319] focus:ring-[#F79319]"
                />
                <span className="ml-2 text-gray-700 text-sm">Dari Database</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="pdfSource"
                  value="upload"
                  checked={pdfSourceType === "upload"}
                  onChange={() => {
                    setPdfSourceType("upload");
                    setSelectedDatabaseMateriId("");
                    setSearchMateriQuery("");
                    setPdfTextContent("");
                  }}
                  className="form-radio h-5 w-5 text-[#F79319] focus:ring-[#F79319]"
                />
                <span className="ml-2 text-gray-700 text-sm">Upload Baru</span>
              </label>
            </div>

            {pdfSourceType === "database" && (
              <div className="relative mb-3" ref={searchDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cari Materi di Database:</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ketik judul materi..."
                    value={searchMateriQuery}
                    onChange={(e) => {
                      setSearchMateriQuery(e.target.value);
                      setShowSearchDropdown(true);
                      setSelectedDatabaseMateriId("");
                    }}
                    onFocus={() => setShowSearchDropdown(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#F79319] focus:border-[#F79319]"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {showSearchDropdown && searchMateriQuery.length > 0 && filteredDatabaseMateris.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto mt-1">
                    {filteredDatabaseMateris.map((materi) => (
                      <li
                        key={materi._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedDatabaseMateriId(materi._id);
                          setSearchMateriQuery(materi.judulMateri);
                          setShowSearchDropdown(false);
                        }}
                      >
                        {materi.judulMateri}
                      </li>
                    ))}
                  </ul>
                )}
                {showSearchDropdown && searchMateriQuery.length > 0 && filteredDatabaseMateris.length === 0 && <p className="text-sm text-gray-500 mt-2">Tidak ada materi yang cocok.</p>}
                {selectedDatabaseMateriId && (
                  <p className="text-sm text-[#F79319] mt-2">
                    Materi terpilih: <span className="font-semibold">{materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri}</span>
                  </p>
                )}
              </div>
            )}

            {pdfSourceType === "upload" && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Unggah File PDF Baru:</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setUploadedPdfFile(file);
                    setUploadedPdfFileName(file ? file.name : "");
                    setPdfTextContent("");
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#F79319] focus:border-[#F79319]"
                />
                {uploadedPdfFileName && <p className="text-sm text-[#F79319] mt-2">File terpilih: {uploadedPdfFileName}</p>}
              </div>
            )}

            {isPdfProcessing && (
              <p className="text-blue-500 text-sm mt-2 flex items-center">
                <FaSpinner className="animate-spin mr-2" /> Memproses PDF...
              </p>
            )}
            {!isPdfProcessing && !pdfTextContent && ((pdfSourceType === "database" && !selectedDatabaseMateriId) || (pdfSourceType === "upload" && !uploadedPdfFile)) ? (
              <p className="text-red-500 text-sm mt-2">Pilih atau unggah PDF untuk memulai.</p>
            ) : !isPdfProcessing && pdfTextContent ? (
              <p className="text-green-600 text-sm mt-2">Teks PDF berhasil dimuat.</p>
            ) : (
              !isPdfProcessing &&
              ((pdfSourceType === "database" && selectedDatabaseMateriId && !pdfTextContent) || (pdfSourceType === "upload" && uploadedPdfFile && !pdfTextContent)) && (
                <p className="text-red-500 text-sm mt-2">Gagal memuat teks PDF. Pastikan URL PDF valid atau file tidak rusak.</p>
              )
            )}
          </div>
        )}

        {currentMode === "askPdf" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Tanya tentang PDF</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#F79319] focus:border-[#F79319] resize-none"
              rows="4"
              placeholder="Ajukan pertanyaan Anda tentang materi PDF yang dipilih..."
              value={askPdfQuestion}
              onChange={(e) => setAskPdfQuestion(e.target.value)}
              disabled={isPdfProcessing || !pdfTextContent.trim()}
            ></textarea>
            <button
              onClick={handleAskPdfSubmit}
              className="w-full bg-[#316B6C] text-white py-3 rounded-xl font-semibold hover:bg-[#2A5C5D] transition-colors duration-300 disabled:opacity-50 shadow-md"
              disabled={isTyping || isPdfProcessing || !pdfTextContent.trim() || !askPdfQuestion.trim()}
            >
              Tanya AI
            </button>
          </div>
        )}

        {currentMode === "summarizePdf" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Ringkas PDF</h3>
            <p className="text-sm text-gray-600">Klik tombol di bawah untuk mendapatkan ringkasan poin-poin penting dari materi PDF yang dipilih.</p>
            <button
              onClick={handleSummarizePdf}
              className="w-full bg-[#316B6C] text-white py-3 rounded-xl font-semibold hover:bg-[#2A5C5D] transition-colors duration-300 disabled:opacity-50 shadow-md"
              disabled={isTyping || isPdfProcessing || !pdfTextContent.trim()}
            >
              Ringkas PDF
            </button>
          </div>
        )}

        {currentMode === "quiz" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Buat Kuis dari PDF</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kuis:</label>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="quizType"
                    value="multipleChoice"
                    checked={quizType === "multipleChoice"}
                    onChange={(e) => setQuizType(e.target.value)}
                    className="form-radio h-5 w-5 text-[#F79319] focus:ring-[#F79319]"
                    disabled={isPdfProcessing || !pdfTextContent.trim()}
                  />
                  <span className="ml-2 text-gray-700 text-sm">Pilihan Ganda</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="quizType"
                    value="fillInTheBlank"
                    checked={quizType === "fillInTheBlank"}
                    onChange={(e) => setQuizType(e.target.value)}
                    className="form-radio h-5 w-5 text-[#F79319] focus:ring-[#F79319]"
                    disabled={isPdfProcessing || !pdfTextContent.trim()}
                  />
                  <span className="ml-2 text-gray-700 text-sm">Isian Singkat</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pertanyaan:</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#F79319] focus:border-[#F79319]"
                disabled={isPdfProcessing || !pdfTextContent.trim()}
              >
                {[3, 5, 10, 15].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGenerateQuiz}
              className="w-full bg-[#316B6C] text-white py-3 rounded-xl font-semibold hover:bg-[#2A5C5D] transition-colors duration-300 disabled:opacity-50 shadow-md"
              disabled={isLoading || isPdfProcessing || !pdfTextContent.trim()}
            >
              Generate Kuis
            </button>
          </div>
        )}

        {currentMode === "flashcards" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Buat Flashcards</h3>
            <p className="text-sm text-gray-600">Klik tombol di bawah untuk membuat flashcards dari materi PDF yang dipilih.</p>
            <button
              onClick={handleGenerateFlashcards}
              className="w-full bg-[#316B6C] text-white py-3 rounded-xl font-semibold hover:bg-[#2A5C5D] transition-colors duration-300 disabled:opacity-50 shadow-md"
              disabled={isLoading || isPdfProcessing || !pdfTextContent.trim()}
            >
              Generate Flashcards
            </button>
          </div>
        )}

        {currentMode === "mindmap" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Buat Mind Map</h3>
            <p className="text-sm text-gray-600">Klik tombol di bawah untuk membuat mind map dari materi PDF yang dipilih.</p>
            <button
              onClick={handleGenerateMindMap}
              className="w-full bg-[#316B6C] text-white py-3 rounded-xl font-semibold hover:bg-[#2A5C5D] transition-colors duration-300 disabled:opacity-50 shadow-md"
              disabled={isLoading || isPdfProcessing || !pdfTextContent.trim()}
            >
              Generate Mind Map
            </button>
          </div>
        )}
      </div>

      {/* Header: Area Chat, Kuis, Flashcards, Mind Map */}
      <div className="flex-1 flex flex-col h-screen  bg-white shadow-lg md:ml-4 rounded-lg md:rounded-l-none">
        <div className="p-4 bg-[#316B6C] text-white text-center text-xl font-semibold shadow-md sticky top-0 z-10">
          {currentMode === "chat" ? "Obrolan dengan Ummah Partner AI" : currentMode === "quiz" ? "Hasil Kuis" : currentMode === "flashcards" ? "Hasil Flashcards" : currentMode === "mindmap" ? "Mind Map" : "Ummah Partner AI"}
        </div>

        {renderMainContent()}
      </div>

      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#316B6C] rounded-t-xl">
              <h3 className="text-xl font-semibold text-white">Riwayat Percakapan</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-white hover:text-gray-200">
                <FaTimes className="text-2xl" />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              <button onClick={startNewChat} className="w-full bg-[#F79319] text-white py-2 rounded-lg font-semibold hover:bg-[#E07B00] transition-colors duration-300 flex items-center justify-center shadow-md mb-4">
                <FaPlus className="mr-2" /> Mulai Chat Baru
              </button>
              {isHistoryLoading ? (
                <p className="text-gray-500 text-sm flex items-center justify-center py-4">
                  <FaSpinner className="animate-spin mr-2" /> Memuat riwayat...
                </p>
              ) : chatSessions.length === 0 ? (
                <p className="text-gray-500 text-center text-sm py-4">Belum ada riwayat chat.</p>
              ) : (
                <ul className="space-y-3">
                  {chatSessions.map((session) => (
                    <li
                      key={session._id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        currentChatSessionId === session._id ? "bg-[#E0F2F2] text-[#316B6C] font-semibold shadow-inner" : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      }`}
                      onClick={() => {
                        if (editingSessionId !== session._id) {
                          loadSession(session);
                        }
                      }}
                    >
                      {editingSessionId === session._id ? (
                        <div onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={newSessionTitle}
                            onChange={(e) => setNewSessionTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSaveRename(session._id);
                              }
                              if (e.key === "Escape") {
                                handleCancelRename();
                              }
                            }}
                            autoFocus
                            className="flex-1 p-1 border border-gray-300 rounded-md text-sm focus:ring-[#F79319] focus:border-[#F79319]"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveRename(session._id);
                            }}
                            className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100 transition-colors"
                            title="Simpan"
                          >
                            <FaCheck className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelRename();
                            }}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                            title="Batal"
                          >
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="truncate flex-1 text-sm">{session.title || `Sesi Chat ${new Date(session.createdAt).toLocaleDateString()}`}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startRenaming(session);
                              }}
                              className="text-gray-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                              title="Ganti nama"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChatSession(session._id);
                              }}
                              className="ml-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                              title="Hapus sesi"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
