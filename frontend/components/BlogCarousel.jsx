import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Icons
import { Heart, MessageCircle, Bookmark } from "lucide-react";

// Images
import hero1 from "../src/assets/hero1.jpeg";
import hero2 from "../src/assets/hero2.jpeg";
import hero3 from "../src/assets/hero3.jpeg";
import hero4 from "../src/assets/hero4.jpeg";
import hero5 from "../src/assets/hero5.jpeg";
import fashion1 from "../src/assets/fashion1.png";
import fashion2 from "../src/assets/fashion2.png";

const Card = ({ imgSrc, username, title, content, likes = 54, comments = 12 }) => {
  return (
    <div className="grid grid-cols-[140px_1fr] bg-[#f4eade] rounded-2xl  w-full max-w-xl min-h-[180px] max-h-[300px] p-4 gap-4 items-start">
      {/* Image */}
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-full object-cover rounded-xl max-h-full border-4 border-[#dfd0b8]"
      />

      {/* Text content */}
      <div className="flex flex-col h-full justify-around text-left ">
        <div>
          <p className="text-sm text-gray-700 mb-1 leading-[2rem]">by @{username}</p>
          <h3 className="text-lg font-bold text-gray-900 mb-3 leading-[2rem] ">{title}</h3>
          <p className="text-sm text-gray-800 tracking-[0.1rem] leading-[1.3rem]">{content}</p>
        </div>

        {/* Footer icons */}
        <div className="flex items-center gap-6 text-m text-gray-700 mt-3">
          <div className="flex items-center gap-1">
            <Heart className="w-6 h-6" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-6 h-6" />
            <span>{comments}</span>
          </div>
          <Bookmark className="w-6 h-6 ml-auto cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default function BlogCarousel() {
  const cards = [
    {
      imgSrc: hero1,
      username: "manthan_laddha",
      title: "Street Style Vibes",
      content: "Discover the latest trends straight from the city sidewalks.",
    },
    {
      imgSrc: hero2,
      username: "sara_rai",
      title: "Vintage Revival",
      content: "Retro is back! See how to rock old-school looks with confidence.",
    },
    {
      imgSrc: hero3,
      username: "rahul_kumar",
      title: "Minimalist Fashion",
      content: "Simplicity never goes out of style — learn to master minimalism.",
    },
    {
      imgSrc: hero4,
      username: "nisha_verma",
      title: "Bold & Bright",
      content: "Turn heads with these vibrant colors and bold prints.",
    },
    {
      imgSrc: hero5,
      username: "nisha_verma",
      title: "Bold & Bright",
      content: "Turn heads with these vibrant colors and bold prints.",
    },
    {
      imgSrc: fashion1,
      username: "nisha_verma",
      title: "Bold & Bright",
      content: "Turn heads with these vibrant colors and bold prints.",
    },
    {
      imgSrc: fashion2,
      username: "nisha_verma",
      title: "Bold & Bright",
      content: "Turn heads with these vibrant colors and bold prints.",
    },
  ];

  return (
    <div className="flex justify-center items-center h-screen bg-white overflow-visible ">
      <Swiper
        effect={"coverflow"}
        direction="vertical"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={5}
        loop={true}
        coverflowEffect={{
          rotate: -10,
          stretch: -80,
          depth: 500,
          modifier: 1,
          slideShadows: false,
        }}
        speed={800}
        modules={[EffectCoverflow, Autoplay]}
        className="w-full max-w-sm h-[449px] overflow-visible"
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center h-full shadow-2xl shadow-black overflow-x-visible">
            <Card
              imgSrc={card.imgSrc}
              username={card.username}
              title={card.title}
              content={card.content}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
