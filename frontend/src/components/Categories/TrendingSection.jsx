import React from "react";
import { HiChevronDoubleLeft } from "react-icons/hi2";
import "./TrendingSection.css";
import TC3 from "../../assets/TC3.jpeg";
import TC1 from "../../assets/TC1.jpeg";
import TC2 from "../../assets/TC2.jpeg";
import TC4 from "../../assets/TC4.jpg";
import { useNavigate } from "react-router-dom";
export default function TrendingSection() {
  const navigate = useNavigate()
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8"
      style={{ backgroundImage: 'url("./src/assets/TSbg.png")' }}
    >
      <div className="w-full max-w-7xl bg-[#dcc5b2] rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Cards Grid */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
          <div className="grid grid-cols-4 grid-rows-8 gap-3 w-full h-[550px]">
            <Card
              img={TC3}
              text="Kid's Section"
              col="col-span-2"
              row="row-span-3"
              onClick={() => navigate("products/category/Kids")}
            />
            <Card
              img={TC1}
              text="Women's Clothing"
              col="col-span-2 col-start-3"
              row="row-span-5"
              onClick={() => navigate("products/category/Women")}
            />
            <Card
              img={TC4}
              text="Accessories"
              col="col-span-2 col-start-3 row-start-6"
              row="row-span-3"
              onClick={() => navigate("products/category/Accessories")}
            />
            <Card
              img={TC2}
              text="Men's Apparel"
              col="col-span-2 row-start-4"
              row="row-span-5"
              onClick={() => navigate("products/category/Men")}
            />
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="w-full md:w-1/2 p-[5rem] text-center md:text-right flex flex-col justify-center items-center md:items-end gap-4 ">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-cinzel leading-tight mb-8">
            Trending Categories
          </h2>
          <p className="text-base sm:text-lg md:text-xl tracking-widest max-w-md font-montserrat mb-4">
            Explore the latest <br />
            Trends across every <br /> style category
          </p>
          <div className="text-6xl md:text-7xl animate-bounce-right md:rotate-0 rotate-90">
            <HiChevronDoubleLeft />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ img, text, col, row, onClick }) {
  return (
    <div
      className={`${col} ${row} bg-white rounded-xl shadow-lg overflow-hidden relative group cursor-pointer`}
      onClick={onClick}
    >
      <img
        src={img}
        alt=""
        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
      />
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <p className="text-white text-lg md:text-xl font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition duration-500 text-center whitespace-pre-line text-shadow p-4">
          {text}
        </p>
      </div>
    </div>
  );
}
