import React from "react";
import "./TrendingSection.css";
import { HiChevronDoubleLeft } from "react-icons/hi2";

export default function TrendingSection() {
  return (
    <div className="trending-section-container">
      <div className="trending-section-content grid grid-cols-2 grid-rows-1 gap-4 h-full bg-inherit">
        <div className="p-4 h-full overflow-hidden flex items-center">
          <div className="grid grid-cols-4 grid-rows-8 gap-3 w-full h-full">
            <div className="col-span-2 row-span-3 bg-white rounded-xl shadow card-hover">
              <img src="../src/assets/TC3.jpeg" alt="" />
              <div className="card-text">
                <p>Kid's<br/> Section</p>
              </div>
            </div>
            <div className="col-span-2 row-span-5 col-start-3 bg-white rounded-xl shadow card-hover">
              <img src="../src/assets/TC1.jpeg" alt="" />
              <div className="card-text">
                <p>Women's<br/> Clothing</p>
              </div>
            </div>
            <div className="col-span-2 row-span-3 col-start-3 row-start-6 bg-white rounded-xl shadow card-hover">
              <img src="../src/assets/TC4.jpg" alt="" />
              <div className="card-text">
                <p>Accessories</p>
              </div>
            </div>
            <div className="col-span-2 row-span-5 col-start-1 row-start-4 bg-white rounded-xl shadow card-hover">
              <img src="../src/assets/TC2.jpeg" alt="" />
              <div className="card-text">
                <p>Men's <br/> Apparel</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4  flex-col h-full text-right  bg-inherit ">
          <h2 className="text-6xl font-medium leading-[6rem] p-8">
            Trending Categories
          </h2>
          <p className="text-xl tracking-[0.5rem] leading-[2rem] pr-8">
            Explore the latest <br />
            Trends across every <br /> style categories
          </p>
          <div className="icons text-8xl ">
            <HiChevronDoubleLeft className="align-right" />
          </div>
        </div>
      </div>
    </div>
  );
}
