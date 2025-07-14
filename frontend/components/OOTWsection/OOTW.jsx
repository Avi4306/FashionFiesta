import React from "react"
import { HiChevronDoubleRight } from "react-icons/hi2";
import "../../src/App.css"; // Adjust the path as necessary
import OOTWCarousel from "./OOTWCarousel"


export default function OOTW() {
  return (
    <div className="ootw-container flex flex-row  ">
      <div className="ootw-text basis-1/3 justify-center">
        <h1>Outfit of the week</h1>
      <p>Where student creativity, <br/> meets Fashion trends</p>
      <div className="icons"><HiChevronDoubleRight/></div>
      <p>
        Get Featured!
        <br />
        Join the Fiesta & <a href="#index">Submit</a> Your Designs
      </p>
      </div>
        <div  className="carousel basis-1/3">
            <OOTWCarousel/>
        </div>
      
    </div>
  );
}
