import React from "react";
import { motion } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import "./Header.css";

// Animation variants for the letter-by-letter effect (no changes here)
const sentenceVariant = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      staggerChildren: 0.06,
    },
  },
};

const letterVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
    },
  },
};

export default function Header() {
  const title = "Fashion Fiesta";

  // Hook for the typewriter effect
  const [subtitleText] = useTypewriter({
    words: ['Make Fashion your Fiesta'],
    loop: true, // Type just once
    typeSpeed: 60,
    deleteSpeed: 50,
    delaySpeed: 2000, // Pause at the end
  });

  return (
    <header className="relative w-full bg-[#faf7f3] py-4 px-6 flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute left-6 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <img
          src="/src/assets/Logo.png"
          alt="Logo"
          className="w-[70px] sm:w-[100px] md:w-[120px] lg:w-[140px] h-auto object-contain"
        />
      </motion.div>

      {/* Heading */}
      <div className="text-center">
        <motion.h1
          className="relative text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-cinzel tracking-widest leading-snug cursor-pointer transition-colors duration-300  overflow-hidden"
          variants={sentenceVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Letter-by-letter animation */}
          {title.split("").map((char, index) => (
            <motion.span key={char + "-" + index} variants={letterVariant}>
              {char}
            </motion.span>
          ))}
          
          {/* Endless Shimmer Effect */}
          <motion.span
            className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-12"
            animate={{ x: "250%" }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 4,
              delay: 3,
              ease: "easeInOut"
            }}
          />
        </motion.h1>
        <p className="text-sm tracking-[0.25rem] sm:text-base md:text-lg font-montserrat mt-[-0.5rem] h-8 flex items-center justify-center">
          <span>{subtitleText}</span>
          <Cursor cursorStyle='_' />
        </p>
      </div>
    </header>
  );
}