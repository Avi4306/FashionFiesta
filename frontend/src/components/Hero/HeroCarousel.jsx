import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import hero1 from "../../assets/hero1.jpeg";
import hero2 from "../../assets/hero2.jpeg";
import hero3 from "../../assets/hero3.jpeg";
import hero4 from "../../assets/hero4.jpeg";
import hero5 from "../../assets/hero5.jpeg";
import hero6 from "../../assets/hero6.jpeg";
import hero7 from "../../assets/hero7.jpeg";
import hero8 from "../../assets/hero8.jpeg";
import herovid1 from "../../assets/hero1.mp4";
import herovid2 from "../../assets/hero2.mp4";
import herovid3 from "../../assets/hero3.mp4";
import herovid4 from "../../assets/hero4.mp4";
import herovid5 from "../../assets/hero5.mp4";
import herovid6 from "../../assets/hero6.mp4";
import herovid7 from "../../assets/hero7.mp4";
// Import Swiper styles import
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./HeroCarousel.css"; // Ensure this path is correct based on your project structure
// import required modules
import { EffectCoverflow, Autoplay } from "swiper/modules";
export default function HeroCarousel() {
  return (
    <>
      
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={2}
        loop={true}
        coverflowEffect={{
          rotate: 10,
          stretch: -100,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        breakpoints={{
            648: {
      slidesPerView: 3.5,
    },
    768: {
      slidesPerView: 4,
    },
    1024: {
      slidesPerView: 5,
    },}}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={800}
        modules={[EffectCoverflow, Autoplay]}
        className="hero mySwiper "
      >
        
        <SwiperSlide>
          
          <video
            src={herovid1}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="slide-video"
          />
        </SwiperSlide>
        <SwiperSlide>
          
          <img src={hero1} loading="eager" className="slide-image" />
        </SwiperSlide>
        <SwiperSlide>
          
          <video
            src={herovid2}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="slide-video"
          />
        </SwiperSlide>
        <SwiperSlide>
          
          <img src={hero2} loading="eager" className="slide-image" />
        </SwiperSlide>
        <SwiperSlide>
          
          <video
            src={herovid3}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="slide-video"
          />
        </SwiperSlide>
        <SwiperSlide>
          
          <img src={hero4} loading="eager" className="slide-image" />
        </SwiperSlide>
        <SwiperSlide>
          
          <video
            src={herovid4}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="slide-video"
          /> 
        </SwiperSlide>
        <SwiperSlide>
          
          <img src={hero5} loading="eager" className="slide-image" />
        </SwiperSlide>
        <SwiperSlide>
          <video
            src={herovid5}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="slide-video"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img src={hero7} loading="eager" className="slide-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={hero8} loading="eager" className="slide-image" />
        </SwiperSlide>
        <SwiperSlide>
          <video
            src={herovid6}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="slide-video"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img src={hero6} loading="eager" className="slide-image" />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
