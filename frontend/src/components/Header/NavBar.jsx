import React, { useState, useEffect, useRef } from "react";
import { CiHome, CiSearch } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setSearchActive] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = useSelector((state) => state.auth.authData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile) {
      dispatch({ type: "AUTH", data: profile });
    }
  }, [dispatch]);
  // Close profile dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check token expiration on route change
  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
  }, [location, user]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    setIsProfileOpen(false);
  };

  // Placeholder for avatar
  const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${
    user?.result?.name?.charAt(0) || "A"
  }`;

  return (
    <nav className="w-full bg-[#faf7f3] px-4 md:px-12 py-3 shadow-sm z-50">
      <div className="flex items-center justify-between">
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl text-gray-800 md:hidden"
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 text-base font-semibold font-montserrat">
          <Link to="/" className="hover:text-[#aa5a44]">Home</Link>
          <Link to="/trending" className="hover:text-[#aa5a44]">Trending Styles</Link>
          <Link to="/designers" className="hover:text-[#aa5a44]">Featured Designers</Link>
          <Link to="/style-diaries" className="hover:text-[#aa5a44]">Style Diaries</Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div
            className={`flex items-center border-b border-[#dcc5b2] px-3 py-1 rounded-md shadow-sm cursor-pointer transition-all ${
              isSearchActive ? "w-56" : "w-32"
            }`}
            onClick={() => setSearchActive(!isSearchActive)}
          >
            <CiSearch className="text-gray-700" />
            <input
              type="text"
              placeholder="Search...?"
              className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-xl text-gray-800">
            <CiHome />
            <PiShoppingCartThin />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              {user?.result ? (
                <div>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <img
                      className="h-9 w-9 rounded-full object-cover cursor-pointer"
                      src={user.result.imageUrl || avatarPlaceholder}
                      alt={user.result.name}
                    />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#faf7f3] rounded-lg shadow-xl z-20 border border-[#F0E4D3]">
                      <div className="p-4 border-b border-[#F0E4D3]">
                        <p className="font-semibold text-sm text-[#44403c] truncate">
                          {user.result.name}
                        </p>
                        <p className="text-xs text-[#78716c] truncate">
                          {user.result.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <p className="w-full text-left block px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md">
                          Your Orders
                        </p>
                        <p className="w-full text-left block px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md">
                          Return or Replace
                        </p>
                        <p className="w-full text-left block px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md">
                          Feedback
                        </p>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md"
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="text-base font-semibold hover:text-[#aa5a44]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3 text-base font-semibold font-montserrat">
          <Link to="/" className="hover:text-[#aa5a44]">Home</Link>
          <Link to="/trending" className="hover:text-[#aa5a44]">Trending Styles</Link>
          <Link to="/designers" className="hover:text-[#aa5a44]">Featured Designers</Link>
          <Link to="/style-diaries" className="hover:text-[#aa5a44]">Style Diaries</Link>
        </div>
      )}
    </nav>
  );
}
