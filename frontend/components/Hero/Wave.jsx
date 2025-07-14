// WavyBackground.jsx
import React from "react";
import { motion } from "framer-motion";

const WavyBackground = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      className="absolute inset-0 w-full h-full"
      initial={{ y: 0 }}
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      preserveAspectRatio="none"
    >
      {[...Array(10)].map((_, i) => (
        <path
          key={i}
          d={`
            M0 ${160 + i * 4}
            C 480 ${80 + i * 4}, 960 ${240 - i * 4}, 1440 ${160 + i * 4}
            L 1440 320
            L 0 320
            Z
          `}
          fill="none"
          stroke="#b79578"
          strokeWidth="0.5"
          opacity={0.2 + i * 0.05}
        />
      ))}
    </motion.svg>
  );
};

export default WavyBackground;
