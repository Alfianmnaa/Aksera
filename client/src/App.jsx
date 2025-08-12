import { React, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";
import Daftar from "./pages/Daftar";
import Masuk from "./pages/Masuk";
import LihatDonasi from "./pages/LihatDonasi";
import UploadDonasi from "./pages/UploadDonasi";
import Artikel from "./pages/Artikel";
import DetailArtikel from "./components/Artikel/DetailArtikel";
import ListDonasiLengkap from "./components/LihatDonasi/ListDonasiLengkap";
import DetailBarang from "./components/LihatDonasi/DetailBarang";
import DonasiSaya from "./pages/DonasiSaya";
import DetailDonasiSaya from "./components/DonasiSaya/DetailDonasiSaya";
import PermohonanSaya from "./pages/PermohonanSaya";
import ArtikelSaya from "./pages/ArtikelSaya";
import EdiProfil from "./pages/EditProfil";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import ViewProfil from "./pages/ViewProfil";
import NotFound from "./pages/NotFound";
import BukuSaya from "./pages/BukuSaya";
import BookDetail from "./pages/BookDetail";
import AdminDashboard from "./pages/AdminDashboard";
import { Beranda } from "./pages/Beranda";
import Materi from "./pages/Materi";
import SeraAi from "./pages/SeraAi";
import { Leaderboard } from "./pages/Leaderboard";
import Forum from "./pages/Forum";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const { pathname } = useLocation();

  const hideNavbarPaths = ["/admin-dashboard"];

  const shouldShowNavbar = !hideNavbarPaths.includes(pathname);
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/edukasi/materi" element={<Materi />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/edukasi/sera-ai" element={<SeraAi />} />
        <Route path="/edukasi/forum-diskusi" element={<Forum />} />
        <Route path="/daftar" element={<Daftar />} />
        <Route path="/masuk" element={<Masuk />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/upload-donasi" element={<UploadDonasi />} />
        <Route path="/donasi/leaderboard" element={<Leaderboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
          path="/permohonan-saya"
          element={
            <ProtectedRoute allowedRoles={["komunitas"]}>
              <PermohonanSaya />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artikel-saya"
          element={
            <ProtectedRoute allowedRoles={["komunitas"]}>
              <ArtikelSaya />
            </ProtectedRoute>
          }
        />
        <Route path="/donasi-saya" element={<DonasiSaya />} />
        <Route
          path="/donasi-saya"
          element={
            <ProtectedRoute allowedRoles={["donatur"]}>
              <DonasiSaya />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donasi-saya/detail-donasi/:id"
          element={
            <ProtectedRoute allowedRoles={["donatur"]}>
              <DetailDonasiSaya />
            </ProtectedRoute>
          }
        />
        <Route path="/lihat-donasi" element={<LihatDonasi />} />
        <Route path="/lihat-semua-donasi" element={<ListDonasiLengkap />} />
        <Route path="/lihat-donasi/donasi-kategori/detail-barang/:id" element={<DetailBarang />} />
        <Route path="/lihat-donasi/donasi-semua/detail-barang/:id" element={<DetailBarang />} />
        <Route path="/lihat-donasi/donasi-tersedia/detail-barang/:id" element={<DetailBarang />} />
        <Route path="/lihat-donasi/donasi-disalurkan/detail-barang/:id" element={<DetailBarang />} />
        <Route path="/buku-saya" element={<BukuSaya />} />
        <Route path="/artikel/detail-artikel/:id" element={<DetailArtikel />} />
        <Route path="/view-profil/:id" element={<ViewProfil />} />
        <Route path="/edit-profil" element={<EdiProfil />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function AppWrapper() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default AppWrapper;
