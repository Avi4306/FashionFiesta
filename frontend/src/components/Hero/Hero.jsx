import React from "react";
import WavyBackground from "./Wave";
import HeroCarousel from "./HeroCarousel"

export default function Hero() {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden bg-[#faf7f3]">
      <WavyBackground />
      <HeroCarousel/>
    </div>
  );
}
