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

  const user = useSelector((state) => state.auth.authData); // This 'user' object contains user.result and user.token
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
        // Dispatch only if user data is not already in Redux or if it's outdated
        if (!user || user.token !== profile.token) {
           dispatch({ type: "AUTH", data: profile });
        }
      }
    }
  }, [dispatch, user, navigate]); // Added user and navigate to dependency array

  // Check token expiration on route change (more robust check with user from Redux)
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
        // Handle invalid token format or other jwtDecode errors
        console.error("Error decoding token:", error);
        dispatch({ type: "LOGOUT" });
        setIsProfileOpen(false);
        navigate("/auth");
      }
    }
  }, [location, user, dispatch, navigate]); // Added dispatch and navigate to dependency array

  // Close profile dropdown on outside click
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

  // Function to handle the search logic
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products/search?searchQuery=${searchQuery}`);
      setSearchActive(false); // Close search bar after searching
      setSearchQuery(""); // Clear the search bar
    }
  };

  const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${
    user?.result?.name?.charAt(0) || "A"
  }`;

  // Check if the user has an 'admin' role
  const isAdmin = user?.result?.role === 'admin';

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
          <Link to="users/featured-designers" className="hover:text-[#aa5a44]">Featured Designers</Link>
          <Link to="/style-diaries" className="hover:text-[#aa5a44]">Style Diaries</Link>
          {/* NEW: Admin Panel link in desktop nav for quick access for admins (optional) */}
          {isAdmin && (
            <Link to="/admin" className="hover:text-[#aa5a44] text-red-600 font-bold">Admin Panel</Link>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-8">
          {/* Search Input */}
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
            <Link to="/"> {/* Changed from CiHome to Link */}
                <CiHome className="text-3xl mx-1 hover:text-[#aa5a44]" />
            </Link>
            <Link to='/cart'>
              <PiShoppingCartThin className="text-3xl mx-1 hover:text-[#aa5a44]" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative pt-2" ref={profileRef}>
              {user?.result ? (
                <div>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <img
                      className="h-9 w-9 rounded-full object-cover cursor-pointer"
                      // CORRECTED: Use profilePhoto if available, otherwise imageUrl (for older Google logins)
                      src={user.result.profilePhoto || user.result.imageUrl || avatarPlaceholder}
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
                        {/* NEW: Admin Panel Link - visible only if user is admin */}
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-[#F0E4D3] rounded-md"
                          >
                            Admin Panel
                          </Link>
                        )}
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
          <Link to="/" className="hover:text-[#aa5a44]" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products/trending" className="hover:text-[#aa5a44]" onClick={() => setIsMenuOpen(false)}>Trending Styles</Link>
          <Link to="/users/featured-designers" className="hover:text-[#aa5a44]" onClick={() => setIsMenuOpen(false)}>Featured Designers</Link>
          <Link to="/style-diaries" className="hover:text-[#aa5a44]" onClick={() => setIsMenuOpen(false)}>Style Diaries</Link>
          {/* NEW: Admin Panel link in mobile nav */}
          {isAdmin && (
            <Link to="/admin" className="hover:text-[#aa5a44] text-red-600 font-bold" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
          )}
          {/* Add other mobile-specific links here if needed */}
          {user?.result && ( // Show logout in mobile if logged in
            <button
                onClick={() => {handleLogout(); setIsMenuOpen(false);}}
                className="w-full text-left px-4 py-2 text-sm text-[#44403c] hover:bg-[#F0E4D3] rounded-md"
            >
                Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}