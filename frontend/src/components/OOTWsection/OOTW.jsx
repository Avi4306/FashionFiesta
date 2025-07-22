import React from "react";
import "./OOTW.css"; 
import OOTWCarousel from './OOTWCarousel'


export default function OOTW() {
  return (
    <section className="ootw-section">
      <div className="ootw-text">
        <h1 className="ootw-title">
          Outfit of the Week
        </h1>
        <p className="ootw-subtitle">
          Where student creativity meets Fashion trends
        </p>
        <div className="ootw-icon">
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
        <p className="ootw-call">
          Get Featured! <br />
          Join the Fiesta & <a href="#submit">Submit</a> Your Designs
        </p>
      </div>

      <div className="ootw-carousel">
        <OOTWCarousel />
      </div>
    </section>
  );
}
