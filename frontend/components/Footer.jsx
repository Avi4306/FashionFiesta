import React from "react";
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
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      
      <div className="footer-content">
        <div className="footer-columns">
          {/* EXPLORE */}
          <div className="footer-column">
            <h3>EXPLORE</h3>
            <ul>
              <li><Globe className="icon" /> About Us</li>
              <li><Newspaper className="icon" /> News & Events</li>
              <li><Briefcase className="icon" /> Work With Us</li>
              <li><Package className="icon" /> Bulk Order</li>
              <li><Undo2 className="icon" /> Return Order</li>
            </ul>
          </div>

          {/* CONNECT */}
          <div className="footer-column">
            <h3>CONNECT</h3>
            <ul>
              <li><Instagram className="icon" /> Instagram</li>
              <li><Twitter className="icon" /> Twitter</li>
              <li><Facebook className="icon" /> Facebook</li>
              <li><MessageCircle className="icon" /> WhatsApp</li>
              <li><Phone className="icon" /> +91 12345 67890</li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="footer-column">
            <h3>CATEGORIES</h3>
            <ul>
              <li><Shirt className="icon" /> Apparels</li>
              <li><ShoppingBag className="icon" /> Accessories</li>
              <li><Droplets className="icon" /> Skincare</li>
              <li><BookOpen className="icon" /> Blogs</li>
              <li><Palette className="icon" /> Designers</li>
            </ul>
          </div>
        </div>
        <p className="footer-copy">©COPYRIGHT 2025. THE WEB CRAWLERS | FASHION-FIESTA.COM</p>
      </div>
    </footer>
  );
};

export default Footer;