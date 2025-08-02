// src/components/QuotesSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import './quotescard.css'; // Custom CSS for styles, fonts, and animations

const FashionQuotes = [
  {
    text: "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street, fashion has to do with ideas, the way we live, what is happening.",
    author: "Coco Chanel",
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
  {
    text: "Don't be into trends. Don't make fashion own you, but you decide what you are, what you want to express by the way you dress and the way to live.",
    author: "Gianni Versace",
  },
  {
    text: "Fashion is the armor to survive the reality of everyday life.",
    author: "Bill Cunningham",
  },
  {
    text: "Simplicity is the keynote of all true elegance.",
    author: "Coco Chanel",
  },
  {
    text: "You can have anything you want in life if you dress for it.",
    author: "Edith Head",
  },
  {
    text: "Fashion should be a form of escapism, and not a form of imprisonment.",
    author: "Alexander McQueen",
  },
  {
    text: "Clothes mean nothing until someone lives in them.",
    author: "Marc Jacobs",
  },
  {
    text: "The difference between style and fashion is quality.",
    author: "Giorgio Armani",
  },
  {
    text: "Fashion is about dreaming and making other people dream.",
    author: "Donatella Versace",
  },
  {
    text: "Trendy is the last stage before tacky.",
    author: "Karl Lagerfeld",
  },
  {
    text: "People will stare. Make it worth their while.",
    author: "Harry Winston",
  },
  {
    text: "Luxury is the ease of a T-shirt in a very expensive dress.",
    author: "Karl Lagerfeld",
  },
  {
    text: "Fashions fade, style is eternal.",
    author: "Yves Saint Laurent",
  },
  {
    text: "What you wear is how you present yourself to the world, especially today, when human contacts are so quick. Fashion is instant language.",
    author: "Miuccia Prada",
  },
  {
    text: "Fashion is very important. It is life-enhancing and, like everything that gives pleasure, it is worth doing well.",
    author: "Vivienne Westwood",
  },
  {
    text: "Style is something each of us already has, all we need to do is find it.",
    author: "Diane von Furstenberg",
  },
  {
    text: "I don't do fashion. I am fashion.",
    author: "Coco Chanel",
  },
];

const QuotesSection = () => {
  const randomQuote = FashionQuotes[Math.floor(Math.random() * FashionQuotes.length)];
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