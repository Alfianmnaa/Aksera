import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Navbar/logo.png"; // Pastikan path ini benar
import LenteraUmatLogo2 from "../../assets/Navbar/lenteraumat.svg"; // Pastikan path ini benar
import donateIcon from "../../assets/Navbar/donate.png";
import bookIcon from "../../assets/Navbar/book.svg";
import personEditIcon from "../../assets/Navbar/personEdit.png";
import articleIcon from "../../assets/Navbar/article.png";
import docsIcon from "../../assets/Navbar/docs.png";
import personProfile from "../../assets/Navbar/personProfile.png";
import logoutIcon from "../../assets/Navbar/logout.png";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config";

// Komponen utama Navbar
function Navbar({ navVariant = 1 }) {
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk mengelola perilaku scroll
  const [scrolling, setScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  // State untuk mengelola menu mobile (hamburger)
  const [menuOpen, setMenuOpen] = useState(false);

  // State untuk mengelola dropdown navigasi (Edukasi, Donasi)
  const [activeDropdown, setActiveDropdown] = useState(null); // 'edukasi', 'donasi', or null

  // Mengambil data pengguna dari UserContext
  const { user, setUser } = useContext(UserContext);

  // Fungsi untuk menutup menu mobile dan semua dropdown
  const closeMenu = () => {
    setMenuOpen(false);
    setActiveDropdown(null); // Tutup juga dropdown saat menu mobile ditutup
  };

  // Fungsi untuk menangani logout
  const handleLogout = async () => {
    try {
      await axiosInstance.get("/auth/logout", { withCredentials: true });
      setUser(null);
      closeMenu();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      navigate("/masuk");
    }
  };

  // Efek samping untuk menangani scroll halaman (menyembunyikan/menampilkan navbar)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      // Sembunyikan navbar jika scroll ke bawah lebih dari 250px
      if (currentScrollY > 250) {
        if (scrollDirection === "down" && !isHidden) {
          closeMenu(); // Tutup menu saat menyembunyikan navbar
          setIsHidden(true);
        } else if (scrollDirection === "up" && isHidden) {
          setIsHidden(false);
        }
      } else {
        setIsHidden(false);
      }

      setScrolling(currentScrollY > 1);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDirection, isHidden]);

  // Fungsi untuk menentukan apakah link aktif
  const isLinkActive = (path) => (path === "/" ? location.pathname === path : location.pathname.startsWith(path));

  // Data navigasi baru dengan dropdown
  const navItems = [
    {
      name: "Beranda",
      path: "/",
      isDropdown: false,
    },
    {
      name: "Edukasi",
      isDropdown: true,
      dropdownItems: [
        { name: "Materi", path: "/edukasi/materi" },
        { name: "Sera AI", path: "/edukasi/sera-ai" },
        { name: "Forum Diskusi", path: "/edukasi/forum-diskusi" },
      ],
    },
    {
      name: "Donasi",
      isDropdown: true,
      dropdownItems: [
        { name: "Upload Donasi", path: "/upload-donasi", role: ["donatur", "admin"] }, // Hanya donatur dan admin yang bisa upload
        { name: "Lihat Donasi", path: "/lihat-donasi" },
        { name: "Leaderboard", path: "/donasi/leaderboard" },
      ],
    },
    {
      name: "Artikel",
      path: "/artikel",
      isDropdown: false,
    },
  ];

  return (
    <>
      <header
        className={`w-full sticky z-50 top-0 bg-white transition-transform duration-300 ease-in-out ${scrolling ? "shadow-lg" : ""}`}
        style={{
          transform: isHidden ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <nav className="px-6 940:px-16 py-4 flex justify-between items-center font-medium relative">
          {/* Logo */}
          <div className="w-fit">
            <Link to="/" onClick={closeMenu}>
              {navVariant === 1 && <img src={Logo} className="w-32 940:w-36" alt="Lentera Umat Logo" />}
              {navVariant === 2 && <img src={LenteraUmatLogo2} className="w-32 940:w-36" alt="Lentera Umat Logo" />}
            </Link>
          </div>

          {/* Navigation Links (Desktop & Mobile) */}
          <div
            className={`
              flex-1 w-full 940:w-auto justify-center items-center
              absolute 940:static left-0 right-0
              bg-white 940:bg-transparent
              shadow-md 940:shadow-none z-10
              transition-all duration-[400ms] /* Animasi */
              ${menuOpen ? "top-0 opacity-100 max-h-screen pointer-events-auto" : "top-full opacity-0 max-h-0 pointer-events-none"} /* Kontrol animasi */
              overflow-hidden /* Pastikan konten tersembunyi saat max-h-0 */
              940:flex 940:top-auto 940:h-auto 940:overflow-visible 940:opacity-100 940:max-h-full 940:pointer-events-auto /* Selalu tampil di desktop */
            `}
          >
            <div className="w-full flex-col flex 940:flex-row py-16 940:py-0 text-center justify-center gap-6 md:gap-10">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.isDropdown ? (
                    <>
                      <button className="flex items-center justify-center gap-1 text-gray-800 hover:text-[#045394] focus:outline-none mx-auto 940:mx-0" onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}>
                        {item.name}
                        <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      {/* Dropdown Menu */}
                      <div
                        className={`
                          940:absolute 940:top-full 940:left-1/2 940:-translate-x-1/2
                          mt-2 940:mt-3 w-48 bg-white rounded-md shadow-lg
                          transition-all duration-200 transform origin-top
                          ${activeDropdown === item.name ? "opacity-100 scale-100 block" : "opacity-0 scale-95 hidden"}
                          940:group-hover:opacity-100 940:group-hover:scale-100 940:group-hover:block
                          ${menuOpen ? "static translate-x-0 w-full shadow-none bg-transparent block" : ""} /* Pastikan block di mobile saat menuOpen */
                        `}
                      >
                        <div className={`py-1 ${menuOpen ? "flex flex-col items-center" : ""}`}>
                          {item.dropdownItems.map((subItem) => {
                            // Filter dropdown items based on user role if 'role' property exists
                            if (subItem.role && !subItem.role.includes(user?.role)) {
                              return null; // Don't render if user role doesn't match
                            }
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className={`
                                  block px-4 py-2 text-gray-800 hover:bg-gray-100
                                  ${isLinkActive(subItem.path) ? "text-[#045394] font-bold" : ""}
                                  ${menuOpen ? "text-gray-800 hover:bg-gray-100 rounded-md w-full max-w-[200px] text-center mx-auto" : ""} /* Pastikan centering di mobile */
                                `}
                                onClick={closeMenu}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`
                        text-gray-800 hover:text-[#045394]
                        ${isLinkActive(item.path) ? "font-bold text-[#045394]" : ""}
                        ${menuOpen ? "text-gray-800 hover:bg-gray-100 rounded-md px-4 py-2 mx-auto" : ""} /* Pastikan centering di mobile */
                      `}
                      onClick={closeMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Tombol Otentikasi untuk Mobile (Tersembunyi di Desktop) */}
              {!user && (
                <div className="flex items-center justify-center gap-2 940:hidden mt-4">
                  <Link to="/masuk" onClick={closeMenu}>
                    <button className="border border-[#045394] rounded text-[#045394] px-4 py-2 hover:bg-[#045394] hover:text-white transition-colors">Masuk</button>
                  </Link>
                  <Link to="/daftar" onClick={closeMenu}>
                    <button className="rounded bg-[#045394] text-white px-4 py-2 hover:bg-opacity-90 transition-colors">Daftar</button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {/* Tombol Otentikasi (Desktop) / Tombol Profil */}
            {user ? (
              <ProfileButton user={user} handleLogout={handleLogout} closeMenu={closeMenu} />
            ) : (
              <div className="940:flex items-center gap-2 hidden">
                <Link to="/masuk">
                  <button className="border border-[#045394] rounded text-[#045394] px-4 py-2 hover:bg-[#045394] hover:text-white transition-colors">Masuk</button>
                </Link>
                <Link to="/daftar">
                  <button className="rounded bg-[#045394] text-white px-4 py-2 hover:bg-opacity-90 transition-colors">Daftar</button>
                </Link>
              </div>
            )}

            {/* Tombol Hamburger */}
            <button
              className="940:hidden z-20 bg-transparent pl-4"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setActiveDropdown(null);
              }}
            >
              <svg className={`w-7 h-7 ${menuOpen ? "text-gray-800" : "text-gray-800"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

// Komponen ProfileButton (tetap terpisah untuk kejelasan)
const ProfileButton = ({ user, handleLogout, closeMenu }) => {
  const { detilUserLogin } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref untuk mendeteksi klik di luar dropdown

  // Tutup menu saat scroll atau klik di luar dropdown
  useEffect(() => {
    const onScroll = () => setMenuOpen(false);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", handleClickOutside); // Menambahkan event listener untuk klik di luar
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // check validitas foto profil user
  const hasValidProfilePhoto = detilUserLogin?.fotoProfil && typeof detilUserLogin.fotoProfil === "string" && detilUserLogin.fotoProfil.trim() !== "";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Tombol Profil */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-0 mr-4 bg-transparent overflow-hidden focus:outline-none">
        {hasValidProfilePhoto ? (
          <img src={detilUserLogin.fotoProfil} alt="profile" className="border border-[#045394] w-14 h-14 bg-transparent rounded-full object-cover" />
        ) : (
          <img src={personProfile} alt="profile" className="p-2 bg-[#045394] bg-opacity-75 w-12 h-12 rounded-full object-cover" />
        )}
      </button>
      {/* Menu Dropdown */}
      <div
        className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg space-y-4 font-medium transform transition-all duration-200 origin-top
          ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        {/* Info Profil */}
        <div className="border-b py-4 px-6">
          <p className="text-gray-900 font-semibold">{user?.username}</p>
          <p className="text-gray-500 text-xs">{user?.email}</p>
        </div>

        {/* Item Menu */}
        {user?.role === "donatur" && (
          <div className="space-y-3 p-6 pt-0">
            <Link
              to="/donasi-saya"
              className="flex items-center gap-2 text-gray-800 hover:text-[#045394] transition-colors"
              onClick={() => {
                setMenuOpen(false);
                closeMenu();
              }}
            >
              <img src={donateIcon} alt="Donasi Icon" className="w-4 h-4" />
              Donasi Saya
            </Link>
            <Link
              to="/buku-saya"
              className="flex items-center gap-2 text-gray-800 hover:text-[#045394] transition-colors"
              onClick={() => {
                setMenuOpen(false);
                closeMenu();
              }}
            >
              <img src={bookIcon} alt="Buku Icon" className="w-4 h-4" />
              Buku Saya
            </Link>
            <Link
              to="/edit-profil"
              className="flex items-center gap-2 text-gray-800 hover:text-[#045394] transition-colors"
              onClick={() => {
                setMenuOpen(false);
                closeMenu();
              }}
            >
              <img src={personEditIcon} alt="Edit Icon" className="w-4 h-4" />
              Edit Profil
            </Link>
            <button className="flex items-center gap-2 text-red-600 hover:text-red-800 p-0 focus:outline-none" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout Icon" className="w-4 h-4" />
              Keluar
            </button>
          </div>
        )}
        {user?.role === "komunitas" && (
          <div className="space-y-3 p-6 pt-0">
            <Link
              to="/permohonan-saya"
              className="flex items-center gap-2 text-gray-800 hover:text-[#045394] transition-colors"
              onClick={() => {
                setMenuOpen(false);
                closeMenu();
              }}
            >
              <img src={docsIcon} alt="Permohonan Icon" className="w-4 h-4" />
              Permohonan Saya
            </Link>
            <Link
              to="/artikel-saya"
              className="flex items-center gap-2 text-gray-800 hover:text-[#045394] transition-colors"
              onClick={() => {
                setMenuOpen(false);
                closeMenu();
              }}
            >
              <img src={articleIcon} alt="Artikel Icon" className="w-4 h-4" />
              Artikel Saya
            </Link>
            <Link
              to="/edit-profil"
              className="flex items-center gap-2 text-gray-800 hover:text-[#045394] transition-colors"
              onClick={() => {
                setMenuOpen(false);
                closeMenu();
              }}
            >
              <img src={personEditIcon} alt="Edit Icon" className="w-4 h-4" />
              Edit Profil
            </Link>
            <button className="flex items-center gap-2 text-red-600 hover:text-red-800 p-0 focus:outline-none" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout Icon" className="w-4 h-4" />
              Keluar
            </button>
          </div>
        )}
        {user?.role === "admin" && (
          <div className="space-y-3 p-6 pt-0">
            <Link
              to="/admin-dashboard"
              className="flex items-center gap-2 text-gray-800 hover:text-[#045394] transition-colors"
              onClick={() => {
                setMenuOpen(false);
                closeMenu();
              }}
            >
              <img src={docsIcon} alt="Dashboard Icon" className="w-4 h-4" />
              Dashboard
            </Link>
            <button className="flex items-center gap-2 text-red-600 hover:text-red-800 p-0 focus:outline-none" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout Icon" className="w-4 h-4" />
              Keluar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
