import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

import fashion1 from "../../../src/assets/design1.jpeg";
import fashion2 from "../../../src/assets/design2.jpeg";
import fashion3 from "../../../src/assets/design3.jpeg";

import "../../../src/App.css";

export default function OOTWCarousel() {
  return (
    <Swiper
        effect={"cards"}
  grabCursor={true}
  loop={true}
  modules={[EffectCards, Autoplay]}
  autoplay={{
    delay:1500, // ✅ Array of delays for each slide
    disableOnInteraction: false,
    pauseOnMouseEnter: true,}}
     speed={800}
     rotate="true"
     slideshadows="true"
      className="mySwiper carousel-ootw"
    >
      <SwiperSlide className="ootw-caro" style={{ backgroundImage: `url(${fashion1})` }}><div className="slide-content"><p>Winner</p></div></SwiperSlide>
      <SwiperSlide className="ootw-caro" style={{ backgroundImage: `url(${fashion2})` }}><div className="slide-content"><p>1st Runner up</p></div></SwiperSlide>
      <SwiperSlide className="ootw-caro" style={{ backgroundImage: `url(${fashion3})` }}><div className="slide-content"><p>2nd Runner UP</p></div></SwiperSlide>
      <SwiperSlide className="ootw-caro" style={{ backgroundImage: `url(${fashion1})` }}><div className="slide-content"><p>Winner</p></div></SwiperSlide>
      <SwiperSlide className="ootw-caro" style={{ backgroundImage: `url(${fashion2})` }}><div className="slide-content"><p>1st Runner up</p></div></SwiperSlide>
      <SwiperSlide className="ootw-caro" style={{ backgroundImage: `url(${fashion3})` }}><div className="slide-content"><p>2nd Runner UP</p></div></SwiperSlide>
      <SwiperSlide className="ootw-caro" style={{ backgroundImage: `url(${fashion1})` }}><div className="slide-content"><p>Winner</p></div></SwiperSlide>
      <SwiperSlide className="ootw-caro" style={{ backgroundImage: `url(${fashion2})` }}><div className="slide-content"><p>1st Runner up</p></div></SwiperSlide>
      <SwiperSlide className="ootw-caro" style={{ backgroundImage: `url(${fashion3})` }}><div className="slide-content"><p>2nd Runner UP</p></div></SwiperSlide>
      
      
    </Swiper>
  );
}
