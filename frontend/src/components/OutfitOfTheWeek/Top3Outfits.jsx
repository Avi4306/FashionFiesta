import React from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function Top3Outfits({ topOutfits = [], user, handleLike }) {
  if (!topOutfits || topOutfits.length === 0) return null;

  const userId = user?.result?._id;

  const renderLikeButton = (outfit) => (
    <button onClick={() => handleLike(outfit._id)} className="text-2xl">
      {outfit.likes.includes(userId)
        ? <AiFillHeart className="text-red-500" />
        : <AiOutlineHeart />}
    </button>
  );

  return (
    <div className="mb-16">
      {/* 🥇 First Place */}
      {topOutfits[0] && (
        <div className="flex flex-col md:flex-row gap-8 mb-12 bg-[#faf7f3] p-6 rounded-xl shadow border border-[#f0e4d3]">
          <img
            src={topOutfits[0].imageUrl}
            alt={topOutfits[0].title}
            className="w-full md:w-1/2 rounded-xl object-cover shadow"
          />
          <div className="flex flex-col justify-between md:w-1/2">
            <div>
              <h3 className="text-2xl font-bold text-[#aa5a44] mb-2">🥇 1st Place - {topOutfits[0].title}</h3>
              <p className="text-gray-700 mb-2">{topOutfits[0].description}</p>
              <p className="text-sm text-gray-600">
                By <span className="font-semibold">{topOutfits[0].creatorName || 'Anonymous'}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {renderLikeButton(topOutfits[0])}
              <span>{topOutfits[0].likes.length} likes</span>
            </div>
          </div>
        </div>
      )}

      {/* 🥈 & 🥉 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topOutfits.slice(1, 3).map((outfit, i) => (
          <div key={outfit._id} className="bg-white border border-[#f0e4d3] rounded-xl p-4 shadow">
            <img
              src={outfit.imageUrl}
              alt={outfit.title}
              className="w-full h-56 object-cover rounded-lg mb-3"
            />
            <h4 className="text-xl font-semibold text-[#aa5a44] mb-1">
              {i === 0 ? '🥈 2nd Place' : '🥉 3rd Place'} - {outfit.title}
            </h4>
            <p className="text-gray-600 text-sm mb-2">{outfit.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              By <span className="font-semibold">{outfit.creatorName || 'Anonymous'}</span>
            </p>
            <div className="flex items-center gap-2">
              {renderLikeButton(outfit)}
              <span>{outfit.likes.length} likes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}