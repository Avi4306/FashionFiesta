import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "./OOTWCarousel.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopOutfits } from "../../actions/outfit";

export default function OOTWCarousel() {
  const dispatch = useDispatch()
  useEffect(() => {
      dispatch(fetchTopOutfits());
    }, [dispatch]);
  const { topOutfits } = useSelector((state) => state.outfit);

  const slideLabels = ["Winner", "1st Runner Up", "2nd Runner Up"];

  // Filter out undefined or empty outfits
  const validTopOutfits = topOutfits?.slice(0, 3).filter(Boolean) || [];

  if (validTopOutfits.length === 0) return null;

  const slides = validTopOutfits.map((outfit, index) => ({
    img: outfit.imageUrl,
    label: slideLabels[index] || "Top Outfit",
  }));

  return (
    <Swiper
      effect="cards"
      grabCursor
      loop
      modules={[EffectCards, Autoplay]}
      autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
      speed={800}
      className="ootw-swiper"
    >
      {slides.map((slide, i) => (
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