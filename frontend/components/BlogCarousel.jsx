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
import blog1 from "../src/assets/street_wear.jpeg";
import blog2 from "../src/assets/vintage.jpeg";
import blog3 from "../src/assets/minimalist.jpeg";
import blog4 from "../src/assets/vibrant.jpeg";
import blog5 from "../src/assets/urban.jpeg";
import blog6 from "../src/assets/boho.jpeg";
import blog7 from "../src/assets/glam.jpeg";

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
    imgSrc: blog1,
    username: "manthan_laddha",
    title: "Street Style Vibes",
    content: "Discover the latest trends straight from the city sidewalks.",
  },
  {
    imgSrc: blog2,
    username: "sara_rai",
    title: "Vintage Revival",
    content: "Retro is back! See how to rock old-school looks with confidence.",
  },
  {
    imgSrc: blog3,
    username: "rahul_kumar",
    title: "Minimalist Fashion",
    content: "Simplicity never goes out of style — learn to master minimalism.",
  },
  {
    imgSrc: blog4,
    username: "nisha_verma",
    title: "Bold & Bright",
    content: "Turn heads with vibrant colors, loud patterns, and fearless energy.",
  },
  {
    imgSrc:blog5,
    username: "aarav_mehta",
    title: "Urban Edge",
    content: "Mix raw attitude with tailored pieces for the ultimate city-ready look.",
  },
  {
    imgSrc: blog6,
    username: "kiara_bansal",
    title: "Boho Dream",
    content: "Floaty fabrics, earthy tones, and free-spirited layering define this style.",
  },
  {
    imgSrc: blog7,
    username: "zoya_sheikh",
    title: "Glam Night Out",
    content: "Sparkle and shimmer take the spotlight — perfect looks for late hours.",
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
