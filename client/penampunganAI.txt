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
} from "react-icons/fa";
import * as pdfjs from "pdfjs-dist";
import { jsPDF } from "jspdf";

// Konfigurasi PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.js";

export default function UmmahPartner() {
  const { user } = useContext(UserContext);
  const chatContainerRef = useRef(null);
  const searchDropdownRef = useRef(null);

  // State untuk mode dan input chat
  const [currentMode, setCurrentMode] = useState("chat");
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State untuk riwayat sesi chat
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatSessionId, setCurrentChatSessionId] = useState(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false); // State untuk mengontrol visibilitas modal riwayat

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

  // State untuk fitur Kuis
  const [quizType, setQuizType] = useState("multipleChoice");
  const [numQuestions, setNumQuestions] = useState(3);
  const [quizQuestions, setQuizQuestions] = useState([]);

  // --- Efek Samping ---

  // Scroll ke bawah setiap kali chatHistory berubah
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Ambil daftar materi saat komponen dimuat
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

  // Filter materi database berdasarkan search query
  useEffect(() => {
    if (searchMateriQuery) {
      const filtered = materis.filter((materi) => materi.judulMateri.toLowerCase().includes(searchMateriQuery.toLowerCase()));
      setFilteredDatabaseMateris(filtered);
    } else {
      setFilteredDatabaseMateris(materis);
    }
    setShowSearchDropdown(searchMateriQuery.length > 0 && filteredDatabaseMateris.length > 0);
  }, [searchMateriQuery, materis]);

  // Ketika materi database dipilih atau file lokal diupload, proses PDF-nya
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

  // Close dropdown when clicking outside
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

  // --- Riwayat Chat ---

  // Ambil riwayat chat saat user tersedia
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

  const startNewChat = () => {
    setCurrentChatSessionId(null);
    setChatHistory([]);
    setInputMessage("");
    setAskPdfQuestion("");
    setQuizQuestions([]);
    Swal.fire({
      icon: "info",
      title: "Chat Baru Dimulai",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
    setShowHistoryModal(false); // Tutup modal setelah memulai chat baru
  };

  const loadChatSession = async (sessionId) => {
    setIsLoading(true); // Gunakan loading utama untuk chat
    try {
      const res = await axiosInstance.get(`/chat/${sessionId}`);
      const formattedMessages = res.data.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        parts: [{ text: msg.content }],
      }));
      setCurrentChatSessionId(sessionId);
      setChatHistory(formattedMessages);
      setCurrentMode("chat");
      Swal.fire({
        icon: "success",
        title: "Sesi Dimuat",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
      setShowHistoryModal(false); // Tutup modal setelah memuat sesi
    } catch (err) {
      console.error("Gagal memuat sesi chat:", err);
      Swal.fire("Error", "Gagal memuat sesi chat. Silakan coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChatSession = async (sessionId) => {
    Swal.fire({
      title: "Anda yakin?",
      text: "Sesi chat ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F79319", // Warna sesuai palet
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

  const saveMessageToBackend = async (message, currentSessionId) => {
    if (!user?._id) return null;

    try {
      if (!currentSessionId) {
        const res = await axiosInstance.post("/chat", {
          userId: user._id,
          initialMessage: { role: message.role, content: message.content },
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

  // --- Fungsi Utilitas PDF ---

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
        throw new Error("Sumber PDF tidak valid.");
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

  // Fungsi untuk memanggil Gemini API
  const callGeminiApi = async (conversationForGemini, schema = null) => {
    setIsLoading(true);

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

    const apiKey = "AIzaSyCh6EAMccK82g-VqX4dOr1kVGYmACK6wkM"; // API key akan diinject oleh Canvas
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
        throw new Error("Respon API tidak sesuai format.");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      Swal.fire("Error", `Terjadi kesalahan saat berkomunikasi dengan AI: ${error.message}. Silakan coba lagi.`, "error");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handler Chat Umum ---

  const handleGeneralChatSubmit = async (e) => {
    e.preventDefault();
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
      return;
    }

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

  // --- Handler Fitur PDF ---

  const handleAskPdfSubmit = async (e) => {
    e.preventDefault();
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
      return;
    }

    if (!pdfTextContent.trim()) {
      Swal.fire("Peringatan", "Teks PDF belum dimuat atau kosong.", "warning");
      return;
    }
    if (!askPdfQuestion.trim()) {
      Swal.fire("Peringatan", "Masukkan pertanyaan Anda.", "warning");
      return;
    }

    const prompt = `Berdasarkan teks PDF berikut:\n\n${pdfTextContent}\n\nJawab pertanyaan ini: ${askPdfQuestion}`;
    const materiTitle = pdfSourceType === "database" && selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "PDF Lokal";

    const userMessageContent = `[Tanya PDF] Materi: ${materiTitle}\nPertanyaan: ${askPdfQuestion}`;
    const userMessage = { role: "user", content: userMessageContent, parts: [{ text: userMessageContent }] };

    const conversationForGemini = [{ role: "user", parts: [{ text: prompt }] }];

    setChatHistory((prev) => [...prev, userMessage]);
    setAskPdfQuestion("");

    const activeSessionId = await saveMessageToBackend(userMessage, currentChatSessionId);
    if (!activeSessionId) return;

    const modelResponseText = await callGeminiApi(conversationForGemini);

    if (modelResponseText) {
      const modelMessage = { role: "model", content: modelResponseText, parts: [{ text: modelResponseText }] };
      setChatHistory((prev) => [...prev, modelMessage]);
      await saveMessageToBackend(modelMessage, activeSessionId);
    }
  };

  const handleSummarizePdf = async () => {
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
      return;
    }

    if (!pdfTextContent.trim()) {
      Swal.fire("Peringatan", "Teks PDF belum dimuat atau kosong.", "warning");
      return;
    }

    const prompt = `Ringkas teks PDF berikut dalam format poin-poin penting:\n\n${pdfTextContent}`;
    const materiTitle = pdfSourceType === "database" && selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "PDF Lokal";

    const userMessageContent = `[Ringkas PDF] Materi: ${materiTitle}`;
    const userMessage = { role: "user", content: userMessageContent, parts: [{ text: userMessageContent }] };

    const conversationForGemini = [{ role: "user", parts: [{ text: prompt }] }];

    setChatHistory((prev) => [...prev, userMessage]);

    const activeSessionId = await saveMessageToBackend(userMessage, currentChatSessionId);
    if (!activeSessionId) return;

    const modelResponseText = await callGeminiApi(conversationForGemini);

    if (modelResponseText) {
      const modelMessage = { role: "model", content: modelResponseText, parts: [{ text: modelResponseText }] };
      setChatHistory((prev) => [...prev, modelMessage]);
      await saveMessageToBackend(modelMessage, activeSessionId);
    }
  };

  // --- Handler Kuis ---

  const handleGenerateQuiz = async () => {
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
      return;
    }

    if (!pdfTextContent.trim()) {
      Swal.fire("Peringatan", "Teks PDF belum dimuat atau kosong.", "warning");
      return;
    }

    setQuizQuestions([]);

    let prompt = `Buatkan kuis tentang materi berikut. Format output harus JSON.
    Materi: ${pdfTextContent}\n\n`;

    const quizSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          type: { type: "STRING", enum: ["multipleChoice", "fillInTheBlank"] },
          options: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          answer: { type: "STRING" },
        },
        required: ["question", "type", "answer"],
      },
    };

    if (quizType === "multipleChoice") {
      prompt += `Buat ${numQuestions} pertanyaan pilihan ganda dengan 4 opsi dan 1 jawaban benar.`;
      quizSchema.items.properties.options.minItems = 4;
      quizSchema.items.properties.options.maxItems = 4;
    } else {
      prompt += `Buat ${numQuestions} pertanyaan isian singkat.`;
      delete quizSchema.items.properties.options;
    }

    const materiTitle = pdfSourceType === "database" && selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "PDF Lokal";

    const userMessageContent = `[Generate Kuis] Materi: ${materiTitle}, Tipe: ${quizType}, Jumlah: ${numQuestions}`;
    const userMessage = { role: "user", content: userMessageContent, parts: [{ text: userMessageContent }] };

    const conversationForGemini = [{ role: "user", parts: [{ text: prompt }] }];

    setChatHistory((prev) => [...prev, userMessage]);

    const activeSessionId = await saveMessageToBackend(userMessage, currentChatSessionId);
    if (!activeSessionId) return;

    const jsonResponse = await callGeminiApi(conversationForGemini, quizSchema);

    if (jsonResponse) {
      try {
        const parsedQuiz = JSON.parse(jsonResponse);
        setQuizQuestions(parsedQuiz);
        const modelMessageContent = "Kuis berhasil dibuat!";
        const modelMessage = { role: "model", content: modelMessageContent, parts: [{ text: modelMessageContent }] };
        setChatHistory((prev) => [...prev, modelMessage]);
        await saveMessageToBackend(modelMessage, activeSessionId);
      } catch (e) {
        console.error("Gagal memparsing respon kuis:", e);
        Swal.fire("Error", "Gagal membuat kuis. Respon AI tidak valid.", "error");
        const errorMessageContent = "Maaf, gagal membuat kuis. Silakan coba lagi.";
        const errorMessage = { role: "model", content: errorMessageContent, parts: [{ text: errorMessageContent }] };
        setChatHistory((prev) => [...prev, errorMessage]);
        await saveMessageToBackend(errorMessage, activeSessionId);
      }
    }
  };

  // --- Fungsi Salin Chat ---
  const handleCopyChat = (textToCopy) => {
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      Swal.fire({
        icon: "success",
        title: "Disalin!",
        text: "Teks berhasil disalin ke clipboard.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Gagal menyalin teks: ", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Salin",
        text: "Tidak dapat menyalin teks.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    document.body.removeChild(textarea);
  };

  // --- Fungsi Download Kuis sebagai PDF ---
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
    doc.text("Kuis Ummah Partner AI", margin, yPos);
    yPos += 10;
    doc.setFontSize(12);
    const materiTitle = pdfSourceType === "database" && selectedDatabaseMateriId ? materis.find((m) => m._id === selectedDatabaseMateriId)?.judulMateri : uploadedPdfFileName || "PDF Lokal";
    doc.text(`Materi: ${materiTitle}`, margin, yPos);
    yPos += 10;
    doc.text(`Tipe Kuis: ${quizType === "multipleChoice" ? "Pilihan Ganda" : "Isian Singkat"}`, margin, yPos);
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
        doc.text("   (Isi jawaban di sini)", margin, yPos);
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
    doc.save(`Kuis_${fileNameMateri}.pdf`);
  };

  // --- FUNGSI FORMATTEXT ---
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

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] bg-gray-100 font-inter">
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white p-6 shadow-lg flex flex-col overflow-y-auto rounded-lg md:rounded-r-none">
        <h2 className="text-2xl font-bold text-center text-[#F79319] mb-6">Ummah Partner </h2>

        <div className="grid grid-cols-2 gap-3 mb-6 border-b pb-4 border-gray-200">
          <button
            onClick={() => setCurrentMode("chat")}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "chat" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaRobot className="mr-2" /> Chat Umum
          </button>
          <button
            onClick={() => setCurrentMode("askPdf")}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "askPdf" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaFilePdf className="mr-2" /> Tanya PDF
          </button>
          <button
            onClick={() => setCurrentMode("summarizePdf")}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "summarizePdf" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaBookOpen className="mr-2" /> Ringkas PDF
          </button>
          <button
            onClick={() => setCurrentMode("quiz")}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentMode === "quiz" ? "bg-[#316B6C] text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaQuestionCircle className="mr-2" /> Buat Kuis
          </button>
        </div>

        <button onClick={() => setShowHistoryModal(true)} className="w-full bg-secondary  py-3 rounded-xl font-semibold hover:bg-secondary-dark transition-colors duration-300 flex items-center justify-center shadow-md mb-6">
          <FaHistory className="mr-2" /> Lihat Riwayat Percakapan
        </button>
        {(currentMode === "askPdf" || currentMode === "summarizePdf" || currentMode === "quiz") && (
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
              disabled={isLoading || isPdfProcessing || !pdfTextContent.trim() || !askPdfQuestion.trim()}
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
              disabled={isLoading || isPdfProcessing || !pdfTextContent.trim()}
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

            {/* Tampilan Kuis yang Digenerate */}
            {quizQuestions.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-md font-semibold mb-3">Kuis Anda:</h4>
                {quizQuestions.map((q, index) => (
                  <div key={index} className="mb-4 p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <p className="font-medium text-gray-800">
                      {index + 1}. {q.question}
                    </p>
                    {q.type === "multipleChoice" && (
                      <ul className="list-none mt-2 text-sm text-gray-700 space-y-1">
                        {q.options.map((option, optIndex) => (
                          <li key={optIndex}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2 text-sm text-green-700">
                      <strong>Jawaban:</strong> {q.answer}
                    </p>
                  </div>
                ))}
                <button onClick={handleDownloadQuizPdf} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 mt-4 flex items-center justify-center shadow-md">
                  <FaDownload className="mr-2" /> Unduh Kuis sebagai PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Area Chat / Respon AI */}
      <div className="flex-1 flex flex-col bg-white shadow-lg md:ml-4 rounded-lg md:rounded-l-none">
        <div className="p-4 bg-[#316B6C] text-white text-center text-xl font-semibold rounded-t-lg shadow-md">Obrolan dengan Ummah Partner AI</div>
        <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 p-4 bg-white rounded-xl shadow-sm">
              <p className="text-lg mb-2">Halo, aku Ummah Partner AI!</p>
              <p className="text-sm">Mulai chat baru atau klik "Lihat Riwayat Percakapan" di panel kiri untuk melanjutkan sesi lama.</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={index} className={`flex items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-4 rounded-xl shadow-md relative ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
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
                      title="Salin pesan"
                    >
                      <FaCopy className="text-sm ml-2" />
                    </button>
                  </p>
                  {formatText(msg.parts[0].text)}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start items-start">
              <div className="max-w-[70%] p-4 rounded-xl shadow-md bg-gray-200 text-gray-800 rounded-bl-none">
                <p className="font-semibold mb-1 flex items-center">
                  <FaRobot className="mr-2 text-gray-600" /> Ummah Partner
                </p>
                <p className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" /> Mengetik...
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Input Chat Umum */}
        {currentMode === "chat" && (
          <form onSubmit={handleGeneralChatSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-lg shadow-inner">
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
                disabled={isLoading}
              />
              <button type="submit" className="bg-[#316B6C] text-white p-3 rounded-full hover:bg-[#2A5C5D] transition-colors duration-300 disabled:opacity-50 shadow-md" disabled={isLoading || !inputMessage.trim()}>
                <FaPaperPlane className="text-lg" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Modal Riwayat Percakapan */}
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
              <button onClick={startNewChat} className="w-full bg-secondary py-2 rounded-lg font-semibold hover:bg-secondary-dark transition-colors duration-300 flex items-center justify-center shadow-md mb-4">
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
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        currentChatSessionId === session._id ? "bg-[#E0F2F2] text-[#316B6C] font-semibold shadow-inner" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => loadChatSession(session._id)}
                    >
                      <span className="truncate flex-1 text-sm">{session.title || `Sesi Chat ${new Date(session.createdAt).toLocaleDateString()}`}</span>
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
