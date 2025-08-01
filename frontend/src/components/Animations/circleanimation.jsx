import { useState, useEffect } from "react";
import {
  Shirt,
  Glasses,
  ShoppingBag,
  ShoppingCart,
  Watch,
  Brush
} from "lucide-react";

const icons = [Shirt, Glasses, ShoppingBag, ShoppingCart, Watch, Brush];

const CircleAnimations = () => {
  const [index, setIndex] = useState(0);
  const CurrentIcon = icons[index];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 500); // Change icon every 0.5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{ backgroundColor: '#f1e4d8' }}
    >

      {/* Outer Circle */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        
        {/* Static Center Icon */}
        <CurrentIcon size={40} className="text-gray-800 z-10" />

        {/* Rotating Tail using SVG */}
        <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 100 100" >

          <defs>
            <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dcc5b2" stopOpacity="0" />
              <stop offset="100%" stopColor="#ccbda2" stopOpacity="1" />
            </linearGradient>
          </defs>

          <path
            d="M 50 10
              A 40 40 0 0 1 78.28 21.72"
            fill="none"
            stroke="url(#tailGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* Custom Slow Spin */}
        <style>
          {`
            @keyframes spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 2.5s linear infinite;
              transform-origin: center;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default CircleAnimations;
