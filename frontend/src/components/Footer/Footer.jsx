import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Twitter,
  Facebook,
  MessageCircle,
  Phone,
  Shirt,
  ShoppingBag,
  Droplets,
  BookOpen,
  Palette,
  Globe,
  Newspaper,
  Briefcase,
  Package,
  Undo2,
} from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-[#FAF7F3] bg-[url('../../src/assets/sssquiggly.svg')] bg-no-repeat bg-top bg-cover pt-20 pb-6 px-4">
      <footer className="max-w-7xl mx-auto text-[#333] font-[Montserrat] bg-[#dcc5b2] pt-4 m-[4rem] mr-[4rem] ml-[4rem] p-[3rem] rounded-2xl shadow-2xl">

        {/* WRAPPER TO CENTER EVERYTHING */}
        <div className="w-full max-w-5xl mx-auto ">

          {/* Columns */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-20 md:gap-23 lg:gap-50">

            {/* EXPLORE */}
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4 uppercase tracking-widest text-[#5b3c2a]">Explore</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <Globe className="w-5 h-5" /> <Link to="/aboutus">About Us</Link>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <Newspaper className="w-5 h-5" /> <span>News & Events</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <Briefcase className="w-5 h-5" /> <span>Work With Us</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <Package className="w-5 h-5" /> <span>Bulk Order</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <Undo2 className="w-5 h-5" /> <span>Return Order</span>
                </li>
              </ul>
            </div>

            {/* CONNECT */}
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4 uppercase tracking-widest text-[#5b3c2a]">Connect</h3>
              <ul className="flex flex-wrap justify-center md:flex-col md:justify-start gap-4 md:gap-3">
                <li className="flex items-center gap-2 hover:text-[#895e3b] transition">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <span className="hidden sm:inline">Instagram</span>
                </li>
                <li className="flex items-center gap-2 hover:text-[#895e3b] transition">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <span className="hidden sm:inline">Twitter</span>
                </li>
                <li className="flex items-center gap-2 hover:text-[#895e3b] transition">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <span className="hidden sm:inline">Facebook</span>
                </li>
                <li className="flex items-center gap-2 hover:text-[#895e3b] transition">
                  <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <span className="hidden sm:inline">WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span className="hidden sm:inline">+91 12345 67890</span>
                </li>
              </ul>
            </div>

            {/* CATEGORIES */}
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4 uppercase tracking-widest text-[#5b3c2a]">Categories</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <Shirt className="w-5 h-5" /> <span>Apparels</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <ShoppingBag className="w-5 h-5" /> <span>Accessories</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <Droplets className="w-5 h-5" /> <span>Skincare</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <BookOpen className="w-5 h-5" /> <span>Blogs</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 hover:text-[#895e3b] transition">
                  <Palette className="w-5 h-5" /> <span>Designers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center mt-10 text-sm font-semibold text-[#555]">
            © 2025 THE WEB CRAWLERS | FASHION-FIESTA.COM
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
