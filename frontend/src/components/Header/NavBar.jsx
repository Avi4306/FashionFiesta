import React, { useState , useEffect} from "react";
import '/src/index.css';
import '/src/App.css';
import { CiHome, CiUser, CiSearch } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import {Menu, MenuItem, Typography, Divider} from '@mui/material';
import {jwtDecode} from 'jwt-decode';

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchActive, setSearchActive] = useState(false);
    const[isactive, setActive] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    function HandleClick() {
        setActive(!isactive);
    }
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    useEffect(() => {
        const checkTokenExpiration = () => {
          const token = user?.token;
          if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
              handleLogout();
            }
          }
        };
        const profile = JSON.parse(localStorage.getItem('profile'));
        setUser(profile);

        checkTokenExpiration();
    }, [location]);
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('profile');
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };
    return (
        <nav className="w-full bg-[#faf7f3] px-4 md:px-12 py-3 shadow-sm z-50">
      <div className="flex items-center justify-between">
        {/* Hamburger Menu (Mobile only) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl text-gray-800 md:hidden"
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Nav Links (hidden on small screens) */}
        <div className="hidden md:flex gap-6 text-base font-semibold font-montserrat">
          <Link to="/" className="hover:text-[#aa5a44]">Home</Link>
          <Link to="/trending" className="hover:text-[#aa5a44]">Trending Styles</Link>
          <Link to="/designers" className="hover:text-[#aa5a44]">Featured Designers</Link>
          <Link to="/style-diaries" className="hover:text-[#aa5a44]">Style Diaries</Link>
        </div>
        {/* Right Side: Search and Icons */}
        <div className="flex items-center gap-4">
          {/* Search Box */}
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

          {/* Icons (always visible) */}
          <div className="flex gap-4 text-xl text-gray-800">
            <CiHome />
            <PiShoppingCartThin />
                {user?.result ? ( // user !== null && user !== undefined ? user.result : undefined
                        <Avatar
                            alt={user.result.name}
                            src={user.result.profilePhoto}
                            onClick={handleLogout}
                            sx={{ cursor: 'pointer', width: 40, height: 40 }}
                        >
                            {!user.result.profilePhoto && user.result.name.charAt(0)}
                        </Avatar>
                    ) : (
                    <Link to="/auth">Login</Link>
                    )}
                </div>
           </div>
           </div>
           {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3 text-base font-semibold font-montserrat">
          <Link to="/" className="hover:text-[#aa5a44]">Home</Link>
          <Link to="/trending" className="hover:text-[#aa5a44]">Trending Styles</Link>
          <Link to="/designers" className="hover:text-[#aa5a44]">Featured Designers</Link>
          <Link to="/style-diaries" className="hover:text-[#aa5a44]">Style Diaries</Link>
        </div>
      )}
        </nav>
    )
};