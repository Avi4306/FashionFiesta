import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./Designers.css"; // optional for custom styles

const designers = [
  { name: "Aarav Mehta", image: "../src/assets/designer1.png" },
  { name: "Ishita Kapoor", image: "../src/assets/d1.png" },
  { name: "Rhea Nair", image: "../src/assets/d2.png" },
  { name: "Dev Sharma", image: "../src/assets/d3.png" },
  { name: "Kavya Malhotra", image: "../src/assets/d4.png" },
  { name: "Reyansh Chatterjee", image: "../src/assets/d5.png" },
  { name: "Ishanvi Desai", image: "../src/assets/d6.png" },
  { name: "Niharika Ghosh", image: "../src/assets/fashion4.png" }
];

const DesignerSwiper = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="text-center py-12 bg-[#f3e8df] designer-container">
      {/* Animated Designer Name */}
      <h2
        key={designers[activeIndex].name}
        className="text-3xl font-bold mb-8 animate-fade transition-all duration-500 ease-in-out"
      >
        ~   {designers[activeIndex].name}   ~
      </h2>

      {/* Swiper Carousel */}
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={5}
        loop={true}
        
        coverflowEffect={{
          rotate: 10,
          stretch: -100,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{ delay: 15000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        speed={800}
        modules={[EffectCoverflow, Autoplay]}
        className="designer mySwiper "
      >
        {designers.map((designer,index)=>(
            <SwiperSlide key={index} className="designer-slide">
                <img src={designer.image} className="designer-image" />
            </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default DesignerSwiper;


