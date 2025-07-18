import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "./OOTWCarousel.css";

import fashion1 from "../../assets/design1.jpeg";
import fashion2 from "../../assets/design2.jpeg";
import fashion3 from "../../assets/design3.jpeg";

export default function OOTWCarousel() {
  const slides = [
    { img: fashion1, label: "Winner" },
    { img: fashion2, label: "1st Runner up" },
    { img: fashion3, label: "2nd Runner up" },
    { img: fashion1, label: "Winner" },
    { img: fashion2, label: "1st Runner up" },
    { img: fashion3, label: "2nd Runner up" },
    { img: fashion1, label: "Winner" },
    { img: fashion2, label: "1st Runner up" },
    { img: fashion3, label: "2nd Runner up" }
  ];

  return (
    <Swiper
      effect="cards"
      grabCursor={true}
      loop={true}
      modules={[EffectCards, Autoplay]}
      autoplay={{ delay: 1500, disableOnInteraction: false, pauseOnMouseEnter: true }}
      speed={800}
      className="ootw-swiper"
    >
      {slides.concat(slides).map((slide, i) => (
        <SwiperSlide
          key={i}
          className="ootw-slide"
          style={{ backgroundImage: `url(${slide.img})` }}
        >
          <div className="ootw-caption">{slide.label}</div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
