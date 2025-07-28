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
  const [searchQuery, setSearchQuery] = useState("");

  const user = useSelector((state) => state.auth.authData);
  const { cart } = useSelector((state) => state.cart);
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile?.token) {
      const decodedToken = jwtDecode(profile.token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        dispatch({ type: "LOGOUT" });
        navigate("/auth");
      } else {
        dispatch({ type: "AUTH", data: profile });
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        dispatch({ type: "LOGOUT" });
        setIsProfileOpen(false);
        navigate("/auth");
      }
    }
  }, [location, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <Link to="/products/trending" className="hover:text-[#aa5a44]">Trending Styles</Link>
          <Link to="/users/featured-designers" className="hover:text-[#aa5a44]">Featured Designers</Link>
          <Link to="/style-diaries" className="hover:text-[#aa5a44]">Style Diaries</Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-8">
          {/* Search */}
          <div
            className={`flex items-center border-b border-[#dcc5b2] h-9 px-3 py-1 rounded-md shadow-sm cursor-pointer transition-all ${
              isSearchActive ? "w-56" : "w-32"
            }`}
            onClick={() => setSearchActive(!isSearchActive)}
          >
            <CiSearch className="text-gray-700" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search...?"
              className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-xl text-gray-800">
            <CiHome className="text-3xl mx-1" />

            {/* Cart Icon with Badge */}
            <div className="relative mx-1">
              <Link to="/cart">
                <PiShoppingCartThin className="text-3xl text-gray-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className="relative pt-2" ref={profileRef}>
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
                          to="/user/profile"
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
          <Link to="/products/trending" className="hover:text-[#aa5a44]">Trending Styles</Link>
          <Link to="/users/featured-designers" className="hover:text-[#aa5a44]">Featured Designers</Link>
          <Link to="/style-diaries" className="hover:text-[#aa5a44]">Style Diaries</Link>
        </div>
      )}
    </nav>
  );
}
