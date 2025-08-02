// src/components/DesignerDetailPage.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import StaticDesigners from './Designer/DesignerData.jsx'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';

import { LuInstagram,LuTwitter,LuFacebook,LuLink } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
const DesignerDetailPage = () => {
  // Get the 'id' from the URL, which we'll set up in the next steps
  const { id } = useParams();
  const navigate = useNavigate();
  // Find the designer whose name matches the ID from the URL
  // We convert both to a URL-friendly format for a reliable match.
  const designer = StaticDesigners.find(
    (d) => d.name.toLowerCase().replace(/\s+/g, '-') === id
  );
  const socialIcons = {
  instagram: <LuInstagram size={24} />,
  twitter: <FaXTwitter size={24} />,
  facebook: <LuFacebook size={24} />,
  default: <LuLink size={24} />
};
  // Handle cases where the designer isn't found
  if (!designer) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#FAF7F3]">
        <h1 className="text-2xl font-semibold text-gray-700">Designer Not Found</h1>
        <Link to="/" className="mt-4 text-[#4d423e] hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  // If the designer is found, render their details
  return (
    <div className="bg-[#FAF7F3] min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-100 w-full object-contain m-2 p-2 md:h-full md:w-64"
              src={designer.profileImage.url}
              alt={designer.profileImage.alt}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-[#4d423e] font-semibold">
              {designer.brandName}
            </div>
            <h1 className="mt-2 text-4xl font-bold text-[#503f31]">{designer.name}</h1>
            <p className="mt-2 text-lg font-medium text-[#7d5b3e]">{designer.tagline}</p>
            <p className="mt-6 text-[#7d5b3e]">{designer.brandStory}</p>

            <div className="mt-6">
                <h3 className="font-bold text-[#503f31] mt-4">Socials:</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {Object.entries(designer.socials).map(([platform, link]) => (
                  <a
        key={platform}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${designer.name}'s ${platform}`}
        className="text-[#7D5B3E] hover:text-[#503f31] transition-colors duration-300"
      >
        
        {socialIcons[platform] || socialIcons.default}
      </a>
                ))}
              </div>
              <h3 className="font-bold text-[#503f31] mt-4">Specialties:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {designer.specialties.map((spec) => (
                  <span key={spec} className="bg-[#dcc5b2] text-[#0d0907] text-xs font-medium px-3 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
              <h3 className="font-bold text-[#503f31] mt-4">Awards:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {designer.awards.map((award) => (
                  <span key={award} className="bg-[#dcc5b2] text-[#0d0907] text-xs font-medium px-3 py-1 rounded-full">
                    {award}
                  </span>
                ))}
              </div>
              <h3 className="font-bold text-[#503f31] mt-4">Presses and Magazines:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {designer.presses.map((press) => (
                  <span key={press} className="bg-[#dcc5b2] text-[#0d0907] text-xs font-medium px-3 py-1 rounded-full">
                    {press}
                  </span>
                ))}
              </div>
            </div>
             <div className="mt-6">
                 <a href={designer.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-[#755134] hover:underline">
                    Visit Portfolio &rarr;
                </a>
            </div>
          </div>
        </div>
      </div>
       <div className="text-center mt-8">
    <button
        onClick={() => navigate(-1)}
        className="text-[#755134] hover:underline bg-transparent border-none cursor-pointer p-0 font-sans"
    >
        &larr; Back to All Designers
    </button>
</div>
    </div>
  );
};

export default DesignerDetailPage;