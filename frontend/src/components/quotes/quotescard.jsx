// src/components/QuotesSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import './quotescard.css'; // Custom CSS for styles, fonts, and animations

const inspirationalQuotes = [
  {
    text: "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street, fashion has to do with ideas, the way we live, what is happening.",
    author: "Coco Chanel",
  },
  {
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
  },
  {
    text: "To be irreplaceable, one must always be different.",
    author: "Coco Chanel",
  },
  {
    text: "Style is a way to say who you are without having to speak.",
    author: "Rachel Zoe",
  },
  {
    text: "Elegance is not standing out, but being remembered.",
    author: "Giorgio Armani",
  },
];

const QuotesSection = () => {
  const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Using Intersection Observer to trigger animations when component comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef} // Attach ref to the section for Intersection Observer
      className={`
        py-8 md:py-12 lg:py-20           
        flex justify-center items-center   
        text-center overflow-hidden relative 
        quotes-section-base               
        ${isVisible ? 'quotes-section-active' : ''}
      `}
    >
      <div
        className="
          max-w-4xl px-4 sm:px-6 lg:px-8  /* Max width for readability and responsive padding */
        "
      >
        <p
          className="
            quote-text-style                
            quote-text-animation            
          "
        >
          &ldquo;{randomQuote.text}&rdquo;
        </p>

        <p
          className="
            quote-author-style               
            quote-author-animation           
          "
        >
          - {randomQuote.author}
        </p>
      </div>
    </section>
  );
};

export default QuotesSection;