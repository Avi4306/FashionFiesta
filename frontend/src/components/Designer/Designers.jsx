import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";

import designers from "./DesignerData.jsx";
import "./Designers.css"
export default function DesignerSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);

  
  const getDisplayWebsite = (url) => {
    try {
      
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      return new URL(fullUrl).hostname.replace('www.', '');
    } catch (e) {
      return url; // fallback for invalid URLs
    }
  };

  return (
    <div className="text-center py-12 bg-[#dcc5b2] designer-container">
      <h2 key={designers[activeIndex].name} className="typewriter text-4xl font-bold text-[#3b3b3b]  h-18 p-12">
        {designers[activeIndex].name}
      </h2>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        coverflowEffect={{
          rotate: 10,
          stretch: -50,
          depth: 120,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{ delay:4000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        speed={800}
        modules={[EffectCoverflow, Autoplay]}
        className="designer mySwiper"
      >
        {designers.map((designer, index) => (
          <SwiperSlide key={index} className="designer-slide">
            <img
              src={designer.profileImage.url}
              alt={designer.profileImage.alt}
              className="designer-image"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x500/ff0000/ffffff?text=Error'; }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      
      <div className="designer-info animate-fade mt-6 text-[#3b3b3b] max-w-xl mx-auto px-4">
        <p className="text-lg font-medium transition-all duration-700 ease-in-out h-16">
          {designers[activeIndex].tagline}
        </p>
        <div className="mt-4 text-sm font-medium flex justify-center gap-8">
          <span className="hover:underline transition-opacity duration-700 opacity-80">
            {designers[activeIndex].brandName}
          </span>
          <a
            href={designers[activeIndex].portfolioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-opacity duration-700 opacity-80"
          >
            {getDisplayWebsite(designers[activeIndex].portfolioLink)}
          </a>
        </div>
      </div>
    </div>
  );
}
