import React, { useState } from "react";
import { CiHome, CiUser, CiSearch } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setSearchActive] = useState(false);

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
          <Link to="/community" className="hover:text-[#aa5a44]">Community</Link>
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
            <CiUser />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3 text-base font-semibold font-montserrat">
          <Link to="/" className="hover:text-[#aa5a44]">Home</Link>
          <Link to="/trending" className="hover:text-[#aa5a44]">Trending Styles</Link>
          <Link to="/designers" className="hover:text-[#aa5a44]">Featured Designers</Link>
          <Link to="/community" className="hover:text-[#aa5a44]">Community</Link>
        </div>
      )}
    </nav>
  );
}
