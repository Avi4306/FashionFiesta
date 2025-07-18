import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./Designers.css";
import d1 from "../../assets/d1.png";
import d2 from "../../assets/d2.png";
import d3 from "../../assets/d3.png";
import d4 from "../../assets/d4.png";
import d5 from "../../assets/d5.png";
import d6 from "../../assets/d6.png";
import D7 from "../../assets/D7.png";
import D8 from "../../assets/D8.png";
const designers = [
  {
    name: "Aarav Mehta",
    tagline: "An innovative streetwear specialist blending urban flair with contemporary textures.",
    insta: "@aaravmehta.designs",
    website: "www.aaravstreetstyle.com",
    image: d2
  },
  {
    name: "Ishita Kapoor",
    tagline: "Her work revives the elegance of the past with a touch of modern simplicity.",
    insta: "@ishitak",
    website: "www.ishitakapoor.com",
    image: d1
  },
  {
    name: "Rhea Nair",
    tagline: "Known for her graceful minimalism and precise tailoring.",
    insta: "@rheanair.designs",
    website: "www.rheanairlabel.com",
    image: D8
  },
  {
    name: "Dev Sharma",
    tagline: "Fuses edgy streetwear with Indian craft for bold new expressions.",
    insta: "@dev_shrma21",
    website: "www.devcraft.com",
    image: d4
  },
  {
    name: "Kavya Malhotra",
    tagline: "Brings boho luxury to life through earthy tones and dreamy silhouettes.",
    insta: "@kavyaboho",
    website: "www.kavyalux.com",
    image: d3
  },
  {
    name: "Reyansh Chatterjee",
    tagline: "A rebel in couture, mixing sharp lines with glam detail.",
    insta: "@reycouture",
    website: "www.reyanshc.com",
    image: D7
  },
  {
    name: "Ishanvi Desai",
    tagline: "Crafts haute couture pieces with exceptional hand embroidery.",
    insta: "@ishanvihc",
    website: "www.ishanvihc.com",
    image: d6
  },
  {
    name: "Niharika Ghosh",
    tagline: "Her work bursts with color, vibrancy, and experimental layering.",
    insta: "@niharika.art",
    website: "www.ng-studio.com",
    image: d5
  }
];

export default function DesignerSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="text-center py-12 bg-[#dcc5b2] designer-container">
      {/* Designer Name at the Top */}
      <h2 key={designers[activeIndex].name} className="typewriter">
        {designers[activeIndex].name}
      </h2>

      {/* Swiper Carousel */}
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
        autoplay={{ delay: 15000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        speed={800}
        modules={[EffectCoverflow, Autoplay]}
        className="designer mySwiper"
      >
        {designers.map((designer, index) => (
          <SwiperSlide key={index} className="designer-slide">
            <img
              src={designer.image}
              alt={designer.name}
              className="designer-image"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Designer Paragraph + Socials */}
      <div className="designer-info animate-fade mt-6 text-[#3b3b3b]">
        <p className="text-lg font-medium transition-all duration-700 ease-in-out">
          {designers[activeIndex].tagline}
        </p>
        <div className="mt-4 text-sm font-medium flex justify-center gap-8">
          <span className="hover:underline transition-opacity duration-700 opacity-80">
            {designers[activeIndex].insta}
          </span>
          <a
            href={`https://${designers[activeIndex].website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-opacity duration-700 opacity-80"
          >
            {designers[activeIndex].website}
          </a>
        </div>
      </div>
    </div>
  );
}
