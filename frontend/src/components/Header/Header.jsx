import React from "react";
<<<<<<< HEAD
import "./Header.css";

export default function Header() {
  return (
    <header className="relative w-full bg-[#faf7f3] py-4 px-6 flex items-center justify-center">
      {/* Logo - fixed to left */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2">
        <img
          src="/src/assets/Logo.png"
          alt="Logo"
          className="w-[70px] sm:w-[100px] md:w-[120px] lg:w-[140px] h-auto object-contain"
        />
      </div>

      {/* Heading - perfectly centered */}
      <div className="text-center">
        <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-cinzel tracking-widest leading-snug">
          Fashion Fiesta
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-montserrat mt-[-0.5rem]">
          Make Fashion your Fiesta
        </p>
      </div>
    </header>
  );
}
=======
import '/src/index.css';
import '/src/App.css';

export default function Header(){
    return (
        <div className="montserrat-header header ">
        <img src="/src/assets/Logo.png" alt="Logo" />
       <h1>Fashion Fiesta
        <p>Make Fashion your Fiesta</p>
       </h1>
       
        </div>
    );
}
>>>>>>> cb15ae1e83c438a6d394d361e1bc50158cc23ebe
