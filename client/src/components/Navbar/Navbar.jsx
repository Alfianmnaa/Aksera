import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LenteraUmatLogo from "../../assets/Navbar/lenteraumatwarna.svg";
import LenteraUmatLogo2 from "../../assets/Navbar/lenteraumat.svg";
import donateIcon from "../../assets/Navbar/donate.png";
import bookIcon from "../../assets/Navbar/book.svg";
import personEditIcon from "../../assets/Navbar/personEdit.png";
import articleIcon from "../../assets/Navbar/article.png";
import docsIcon from "../../assets/Navbar/docs.png";
import personProfile from "../../assets/Navbar/personProfile.png";
import logoutIcon from "../../assets/Navbar/logout.png";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config";

function Navbar({
  navbarClasses = `w-full sticky z-20 top-0 bg-white`,
  navLinkClass = (isActive) => `ml-4 ${isActive ? "text-primary font-bold" : ""} hover:text-primary`,
  logoClass = "font-bold text-heading-sm text-primary",
  buttonClass = {
    login: "border-primary border-2 rounded text-primary px-4 py-2",
    register: "rounded bg-primary text-white px-4 py-2",
  },
  navVariant = 1,
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/auth/logout", { withCredentials: true });
      setUser(null);
      closeMenu();
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/masuk");
    }
  };

  const [scrolling, setScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [isHidden, setIsHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const { user } = useContext(UserContext);
  const { setUser } = useContext(UserContext);

  const closeMenu = () => {
    setMenuOpen(false);
  };
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const toggleLoginDropdown = () => setLoginDropdownOpen(!loginDropdownOpen);

  const paths = {
    home: "/",
    book: "/ummah-book",
    partner: "/ummah-partner",
    upload: "/upload-donasi",
    donations: "/lihat-donasi",
    artikel: "/artikel",
    login: "/masuk",
    register: "/daftar",
  };

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      if (currentScrollY > 250) {
        if (scrollDirection === "down" && !isHidden) {
          setMenuOpen(false);
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

  const isLinkActive = (path) => (path === paths.home ? location.pathname === path : location.pathname.startsWith(path));

  return (
    <header
      className={`${navbarClasses} ${scrolling ? "shadow-md" : ""} transition-transform duration-300 ease-in-out`}
      style={{
        transform: isHidden ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <nav className="px-6 940:px-16 py-6 flex justify-between items-center font-medium relative">
        {/* Logo */}
        <div className="w-fit">
          <Link to="/">
            {navVariant === 1 && <img src={LenteraUmatLogo} className="w-32 940:w-36" alt="Logo" />}
            {navVariant === 2 && <img src={LenteraUmatLogo2} className="w-32 940:w-36 " alt="Logo" />}
          </Link>
        </div>

        {/* Navigation Links */}
        <div
          className={`940:flex gap-6 flex-1 w-full 940:w-auto justify-center items-center absolute 940:static left-0 right-0 bg-white 940:bg-transparent shadow-md 940:shadow-none z-10 transition-all duration-[400ms] ${
            menuOpen ? "top-0" : "-top-[450px]"
          }`}
        >
          <div className="w-full flex-col flex 940:flex-row py-16 940:py-0 text-center justify-center gap-4 md:gap-10">
            <Link to={paths.home} className={menuOpen ? "text-black" : "text-white" + navLinkClass(isLinkActive(paths.home))}>
              Beranda
            </Link>
            <Link to={paths.book} className={menuOpen ? "text-black" : "text-white" + navLinkClass(isLinkActive(paths.book))}>
              Ummah Book
            </Link>
            <Link to={paths.partner} className={menuOpen ? "text-black" : "text-white" + navLinkClass(isLinkActive(paths.partner))}>
              Ummah Partner
            </Link>
            {user?.role === "komunitas" ? (
              ""
            ) : (
              <Link to={paths.upload} className={menuOpen ? "text-black" : "text-white" + navLinkClass(isLinkActive(paths.upload))}>
                Upload Donasi
              </Link>
            )}
            <Link to={paths.donations} className={menuOpen ? "text-black" : "text-white" + navLinkClass(isLinkActive(paths.donations))}>
              Lihat Donasi
            </Link>
            <Link to={paths.artikel} className={menuOpen ? "text-black" : "text-white" + navLinkClass(isLinkActive(paths.artikel))}>
              Artikel
            </Link>
            {!user && (
              <div className="flex items-center justify-center gap-2 940:mt-0 940:hidden">
                <Link to={paths.login}>
                  <button className="border-primary border-2 rounded text-primary px-4 py-2">Masuk</button>
                </Link>
                <Link to={paths.register}>
                  <button className="rounded bg-primary text-white px-4 py-2">Daftar</button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          {/* Auth Buttons*/}
          {user ? (
            <div className="flex items-center gap-4 940:mt-0">
              <ProfileButton user={user} setUser={setUser} handleLogout={handleLogout} />
            </div>
          ) : (
            <div className="940:flex items-center gap-2 940:mt-0 hidden">
              <Link to={paths.login}>
                <button className={buttonClass.login}>Masuk</button>
              </Link>
              <Link to={paths.register}>
                <button className={buttonClass.register}>Daftar</button>
              </Link>
            </div>
          )}
          {/* Hamburger Button */}
          <button className="940:hidden z-20 bg-transparent pr-2" onClick={toggleMenu}>
            <svg className={`w-6 h-6 ${navVariant === 1 || menuOpen ? "text-primary" : "text-white"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

const ProfileButton = ({ user, handleLogout }) => {
  const { detilUserLogin } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Tutup menu saat scroll
  useEffect(() => {
    const onScroll = () => setMenuOpen(false);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // check validitas foto profil user
  const hasValidProfilePhoto = detilUserLogin?.fotoProfil && typeof detilUserLogin.fotoProfil === "string" && detilUserLogin.fotoProfil.trim() !== "";

  return (
    <div className="relative inline-block text-left">
      {/* Profile Button */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-0 mr-4 bg-transparent overflow-hidden">
        {hasValidProfilePhoto ? (
          <img src={detilUserLogin.fotoProfil} alt="profile" className="border border-gray-500 w-14 h-14 bg-transparent rounded-full object-cover" />
        ) : (
          <img src={personProfile} alt="profile" className="p-2 bg-gray-500 bg-opacity-75 w-12 h-12 rounded-full object-cover" />
        )}
      </button>
      {/* Dropdown Menu */}
      <div className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-md space-y-4 font-medium transform transition-all duration-200 origin-top ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
        {/* Profile Info */}
        <div className="border-b py-4 px-6">
          <p className="text-gray-900">{user?.username}</p>
          <p className="text-gray-400 text-xs">{user?.email}</p>
        </div>

        {/* Menu Items */}
        {user?.role === "donatur" && (
          <div className="space-y-3 p-6 pt-0">
            <Link to="/donasi-saya" className="flex items-center gap-2 text-gray-800 hover:text-black" onClick={closeMenu}>
              <img src={donateIcon} alt="Donasi Icon" className="w-4 h-4" />
              Donasi Saya
            </Link>
            <Link to="/buku-saya" className="flex items-center gap-2 text-gray-800 hover:text-black" onClick={closeMenu}>
              <img src={bookIcon} alt="Donasi Icon" className="w-4 h-4" />
              Buku Saya
            </Link>
            <Link to="/edit-profil" className="flex items-center gap-2 text-gray-800 hover:text-black" onClick={closeMenu}>
              <img src={personEditIcon} alt="Edit Icon" className="w-4 h-4" />
              Edit Profil
            </Link>
            <button className="flex items-center gap-2 text-red-600 hover:text-red-800 p-0" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout Icon" className="w-4 h-4" />
              Keluar
            </button>
          </div>
        )}
        {user?.role === "komunitas" && (
          <div className="space-y-3 p-6 pt-0">
            <Link to="/permohonan-saya" className="flex items-center gap-2 text-gray-800 hover:text-black" onClick={closeMenu}>
              <img src={docsIcon} alt="Donasi Icon" className="w-4 h-4" />
              Permohonan Saya
            </Link>
            <Link to="/artikel-saya" className="flex items-center gap-2 text-gray-800 hover:text-black" onClick={closeMenu}>
              <img src={articleIcon} alt="Donasi Icon" className="w-4 h-4" />
              Artikel Saya
            </Link>
            <Link to="/edit-profil" className="flex items-center gap-2 text-gray-800 hover:text-black" onClick={closeMenu}>
              <img src={personEditIcon} alt="Edit Icon" className="w-4 h-4" />
              Edit Profil
            </Link>
            <button className="flex items-center gap-2 text-red-600 hover:text-red-800 p-0" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout Icon" className="w-4 h-4" />
              Keluar
            </button>
          </div>
        )}
        {user?.role === "admin" && (
          <div className="space-y-3 p-6 pt-0">
            <Link to="/admin-dashboard" className="flex items-center gap-2 text-gray-800 hover:text-black" onClick={closeMenu}>
              <img src={docsIcon} alt="Dashboard Icon" className="w-4 h-4" />
              Dashboard
            </Link>
            <button className="flex items-center gap-2 text-red-600 hover:text-red-800 p-0" onClick={handleLogout}>
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
