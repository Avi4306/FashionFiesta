import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiHome, CiSearch } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

// 🤸 New 3D variant for the dropdown menu
const dropdownVariants = {
  hidden: { opacity: 0, rotateX: -45, y: -20, transition: { duration: 0.2 } },
  visible: { opacity: 1, rotateX: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, rotateX: -45, y: -20, transition: { duration: 0.2 } },
};

// Data for the magic link indicator
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Trending Styles", path: "/products/trending" },
  { name: "Featured Designers", path: "/users/featured-designers" },
  { name: "Style Diaries", path: "/style-diaries" },
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setSearchActive] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredLink, setHoveredLink] = useState(null); // For the magic link indicator

  const user = useSelector((state) => state.auth.authData);
  const { cart } = useSelector((state) => state.cart);
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync localStorage with Redux on load and handle token expiration
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile?.token) {
      const decodedToken = jwtDecode(profile.token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        dispatch({ type: "LOGOUT" });
        navigate("/auth");
      } else {
        if (!user || user.token !== profile.token) {
          dispatch({ type: "AUTH", data: profile });
        }
      }
    }
  }, [dispatch, user, navigate]);

  // Check token expiration on route change
  useEffect(() => {
    const token = user?.token;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < new Date().getTime()) {
          dispatch({ type: "LOGOUT" });
          setIsProfileOpen(false);
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch({ type: "LOGOUT" });
        setIsProfileOpen(false);
        navigate("/auth");
      }
    }
  }, [location, user, dispatch, navigate]);

  // Handle closing dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus the search bar when it becomes active
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    setIsProfileOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products/search?searchQuery=${searchQuery}`);
      setSearchActive(false);
      setSearchQuery("");
    }
  };

  const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${user?.result?.name?.charAt(0) || "A"}`;
  const isAdmin = user?.result?.role === 'admin';

  return (
    <motion.nav
      className="w-full bg-[#faf7f3] px-4 md:px-12 py-3 shadow-sm z-50 sticky top-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        {/* Hamburger Menu */}
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl text-gray-800 md:hidden z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </motion.button>

        {/* ✨ Desktop Nav Links with Magic Indicator */}
        <div 
          className="hidden md:flex gap-2 text-base font-semibold font-montserrat"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="relative px-3 py-2 transition-colors duration-200 hover:text-black"
              onMouseEnter={() => setHoveredLink(link.name)}
            >
              {hoveredLink === link.name && (
                <motion.span
                  className="absolute inset-0 rounded-md bg-[#e0d5c6]"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          ))}
          {isAdmin && (
            <Link 
              to="/admin"
              className="relative px-3 py-2 transition-colors duration-200 text-red-600 font-bold"
              onMouseEnter={() => setHoveredLink("admin")}
            >
              {hoveredLink === "admin" && (
                <motion.span
                  className="absolute inset-0 rounded-md bg-red-100"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                />
              )}
              <span className="relative z-10">Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Right Icons with playful hover */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Search Input */}
          <div>
            <div
              className={`flex items-center border-b-2 border-[#dcc5b2] h-9 px-3 py-1 rounded-md shadow-sm cursor-text transition-all duration-300 ${isSearchActive ? "w-56 bg-white" : "w-32"}`}
              onClick={() => setSearchActive(true)}
            >
              <CiSearch className="text-gray-700" />
              <input ref={searchInputRef} type="text" placeholder="Search..." className="bg-transparent w-full outline-none text-sm placeholder-gray-500 ml-2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} onBlur={() => setSearchActive(false)} />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 lg:gap-4 text-xl text-gray-800">
            <motion.div whileHover={{ scale: 1.1, rotate: '-5deg' }}><Link to="/"><CiHome className="text-3xl" /></Link></motion.div>
            <motion.div className="relative" whileHover={{ scale: 1.1, rotate: '5deg' }}>
              <Link to="/cart">
                <PiShoppingCartThin className="text-3xl" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          </div>

          {/* 🤸 3D Flip Profile Dropdown */}
          <div className="relative" ref={profileRef} style={{ perspective: "1000px" }}>
            {user?.result ? (
              <div>
                <motion.button onClick={() => setIsProfileOpen(!isProfileOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <img className="h-9 w-9 rounded-full object-cover cursor-pointer" src={user.result.profilePhoto || user.result.imageUrl || avatarPlaceholder} alt={user.result.name} />
                </motion.button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      className="absolute right-0 mt-3 w-56 bg-[#faf7f3] rounded-lg shadow-xl z-20 border border-[#F0E4D3]"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ transformOrigin: "top right" }}
                    >
                      <div className="p-4 border-b border-[#F0E4D3]">
                        <p className="font-semibold text-sm text-[#44403c] truncate">{user.result.name}</p>
                        <p className="text-xs text-[#78716c] truncate">{user.result.email}</p>
                      </div>
                      <div className="p-2">
                        {isAdmin && <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-[#F0E4D3] rounded-md">Admin Panel</Link>}
                        <p className="w-full text-left block px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md cursor-pointer">Your Orders</p>
                        <p className="w-full text-left block px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md cursor-pointer">Return or Replace</p>
                        <p className="w-full text-left block px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md cursor-pointer">Feedback</p>
                        <Link to="/user/profile" onClick={() => setIsProfileOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md">My Profile</Link>
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md">Logout</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                <Link to="/auth" className="text-base font-semibold hover:text-[#aa5a44]">Login</Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-3 flex flex-col gap-3 text-base font-semibold font-montserrat"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Link to="/" className="hover:text-[#aa5a44]" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products/trending" className="hover:text-[#aa5a44]" onClick={() => setIsMenuOpen(false)}>Trending Styles</Link>
            <Link to="/users/featured-designers" className="hover:text-[#aa5a44]" onClick={() => setIsMenuOpen(false)}>Featured Designers</Link>
            <Link to="/style-diaries" className="hover:text-[#aa5a44]" onClick={() => setIsMenuOpen(false)}>Style Diaries</Link>
            {isAdmin && <Link to="/admin" className="hover:text-[#aa5a44] text-red-600 font-bold" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>}
            {user?.result && <button onClick={() => {handleLogout(); setIsMenuOpen(false);}} className="text-left font-semibold text-[#aa5a44]">Logout</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}