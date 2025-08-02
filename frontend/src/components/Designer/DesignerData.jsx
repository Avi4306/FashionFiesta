import React from 'react';
// --- Image Imports ---
// These would be located in your assets folder, e.g., './src/assets/d1.png'
import d1 from '../../assets/d1.png';
import d2 from '../../assets/d2.png';
import d3 from '../../assets/d3.png';
import d4 from '../../assets/d4.png';
import d5 from '../../assets/d5.png';
import d6 from '../../assets/d6.png';
import d7 from '../../assets/D7.png';
import d8 from '../../assets/D8.png';

// --- Designer Data ---
// This file contains the detailed information for each designer and exports it as the default.
const designers = [
  {
    name: "Aarav Mehta",
    brandName: "Urban Canvas",
    tagline: "An innovative streetwear specialist blending urban flair with contemporary textures.",
    brandStory: "Born from the vibrant chaos of Mumbai's streets, Urban Canvas translates the city's raw energy into wearable art. Aarav, a self-taught prodigy, merges hip-hop culture with traditional Indian textile techniques to create pieces that are both rebellious and rooted.",
    socials: {
      instagram: "https://instagram.com/aaravmehta.designs",
      twitter: "https://twitter.com/UrbanCanvasIND",
      facebook: "https://facebook.com/in/aaravmehtadesigns"
    },
    portfolioLink: "https://www.aaravstreetstyle.com",
    profileImage: {
      url: d2, // Corrected from d1 based on original user data
      alt: "Portrait of Aarav Mehta"
    },
    specialties: ["Denim Manipulation", "Graphic Tees", "Oversized Silhouettes", "Fusion Wear"],
    awards: ["Emerging Streetwear Designer of the Year, 2023"],
    presses: ["Vogue India", "GQ India", "Highsnobiety"]
  },
  {
    name: "Ishita Kapoor",
    brandName: "Kāla",
    tagline: "Her work revives the elegance of the past with a touch of modern simplicity.",
    brandStory: "Kāla, meaning 'time' in Sanskrit, is Ishita's ode to timeless Indian elegance. A history graduate turned designer, she scours archives for forgotten patterns and weaves, reimagining them for the modern woman who values grace and heritage.",
    socials: {
      instagram: "https://instagram.com/ishitak",
      twitter: "https://twitter.com/KalaByIshita",
      facebook: "https://facebook.com/in/ishitakapoor"
    },
    portfolioLink: "https://www.ishitakapoor.com",
    profileImage: {
      url: d1, // Corrected from d2
      alt: "Portrait of Ishita Kapoor"
    },
    specialties: ["Handloom Sarees", "Tailored Blouses", "Fusion Gowns", "Minimalist Jewelry"],
    awards: ["Heritage Revival Award, 2022"],
    presses: ["Harper's Bazaar Bride", "Elle India", "The Voice of Fashion"]
  },
  {
    name: "Rhea Nair",
    brandName: "Rhea Nair Label",
    tagline: "Known for her graceful minimalism and precise tailoring.",
    brandStory: "Trained in Milan and inspired by Scandinavian architecture, the Rhea Nair Label is the epitome of 'less is more.' Her philosophy centers on sustainable fabrics, ethical production, and creating investment pieces that last a lifetime.",
    socials: {
      instagram: "https://instagram.com/rheanair.designs",
      twitter: "https://twitter.com/RheaNairLabel",
      facebook: "https://facebook.com/in/rheanair"
    },
    portfolioLink: "https://www.rheanairlabel.com",
    profileImage: {
      url: d8, // Corrected from d3
      alt: "Portrait of Rhea Nair"
    },
    specialties: ["Power Suits", "Minimalist Dresses", "Cashmere Knits", "Sustainable Fashion"],
    awards: ["Green Wardrobe Champion, 2024"],
    presses: ["Forbes 30 Under 30", "Financial Times - How to Spend It", "WWD"]
  },
  {
    name: "Dev Sharma",
    brandName: "Devanagari",
    tagline: "Fuses edgy streetwear with Indian craft for bold new expressions.",
    brandStory: "Devanagari is a cultural disruptor. Dev takes inspiration from ancient scripts, temple architecture, and folklore, clashing them with modern streetwear aesthetics to create something entirely new, provocative, and deeply Indian.",
    socials: {
      instagram: "https://instagram.com/dev_shrma21",
      twitter: "https://twitter.com/DevanagariWrld",
      facebook: "https://facebook.com/in/devsharmadesign"
    },
    portfolioLink: "https://www.devcraft.com",
    profileImage: {
      url: d4,
      alt: "Portrait of Dev Sharma"
    },
    specialties: ["Embroidered Bombers", "Deconstructed Kurtas", "Concept Sneakers", "Gender-Fluid Apparel"],
    awards: ["IDFA International Design Fusion Award, 2023"],
    presses: ["Hypebeast", "Complex", "Platform Magazine"]
  },
  {
    name: "Kavya Malhotra",
    brandName: "Ziya",
    tagline: "Brings boho luxury to life through earthy tones and dreamy silhouettes.",
    brandStory: "Ziya, meaning 'light' or 'splendor,' is for the global wanderer. Inspired by her travels through Rajasthan and Morocco, Kavya's brand is a tapestry of earthy tones, fluid fabrics, and artisanal details that speak of freedom and adventure.",
    socials: {
      instagram: "https://instagram.com/kavyaboho",
      twitter: "https://twitter.com/ZiyaByKavya",
      facebook: "https://facebook.com/in/kavyamalhotra"
    },
    portfolioLink: "https://www.kavyalux.com",
    profileImage: {
      url: d3, 
      alt: "Portrait of Kavya Malhotra"
    },
    specialties: ["Resort Wear", "Block-Printed Maxis", "Kaftans", "Handmade Accessories"],
    awards: ["Best Resort Wear Designer, Condé Nast Traveller, 2022"],
    presses: ["Travel + Leisure", "Cosmopolitan", "Grazia India"]
  },
  {
    name: "Reyansh Chatterjee",
    brandName: "RCX",
    tagline: "A rebel in couture, mixing sharp lines with glam detail.",
    brandStory: "A former architect, Reyansh applies principles of structure and deconstruction to fashion. RCX (Reyansh Chatterjee Xperimental) is his laboratory for creating dramatic, sculptural couture that challenges the limits of fabric and form.",
    socials: {
      instagram: "https://instagram.com/reycouture",
      twitter: "https://twitter.com/RCX_Studio",
      facebook: "https://facebook.com/in/reyanshchatterjee"
    },
    portfolioLink: "https://www.reyanshc.com",
    profileImage: {
      url: d7, // Corrected from d6
      alt: "Portrait of Reyansh Chatterjee"
    },
    specialties: ["Structured Gowns", "Metallic Detailing", "Leatherwork", "Avant-Garde Couture"],
    awards: ["Avant-Garde Designer of the Year, 2024"],
    presses: ["Vogue Runway", "W Magazine", "Business of Fashion"]
  },
  {
    name: "Ishanvi Desai",
    brandName: "Ishanvi Desai",
    tagline: "Crafts haute couture pieces with exceptional hand embroidery.",
    brandStory: "From the heart of Surat, the world's textile capital, Ishanvi Desai's atelier produces breathtaking bridal and formal wear. Each piece is a masterpiece of 'zardozi' and 'aari' work, continuing a family legacy of royal artisans.",
    socials: {
      instagram: "https://instagram.com/ishanvihc",
      twitter: "https://twitter.com/IshanviCouture",
      facebook: "https://facebook.com/in/ishanvidesai"
    },
    portfolioLink: "https://www.ishanvihc.com",
    profileImage: {
      url: d6,
      alt: "Portrait of Ishanvi Desai"
    },
    specialties: ["Bridal Lehengas", "Hand Embroidery", "Bespoke Gowns", "Zardozi Craft"],
    awards: ["Master Craftsman of the Year, India Bridal Week, 2023"],
    presses: ["Brides Today", "Femina Wedding Times", "The Hindu - Metroplus"]
  },
  {
    name: "Niharika Ghosh",
    brandName: "Varna",
    tagline: "Her work bursts with color, vibrancy, and experimental layering.",
    brandStory: "Varna, meaning 'color,' is an explosion of joy from Kolkata's most eclectic designer. A fine arts graduate, Niharika treats fabric like a canvas, using bold prints, unconventional drapes, and a riot of hues to challenge fashion norms.",
    socials: {
      instagram: "https://instagram.com/niharika.art",
      twitter: "https://twitter.com/VarnaByNiharika",
      facebook: "https://facebook.com/in/niharikaghosh"
    },
    portfolioLink: "https://www.ng-studio.com",
    profileImage: {
      url: d5,
      alt: "Portrait of Niharika Ghosh"
    },
    specialties: ["Digital Prints", "Art-to-Wear", "Draped Silhouettes", "Accessory Design"],
    awards: ["GenNext Designer, Lakmé Fashion Week, 2022"],
    presses: ["Elle India", "Verve Magazine", "India Today - Spice"]
  }
];

export default designers;
