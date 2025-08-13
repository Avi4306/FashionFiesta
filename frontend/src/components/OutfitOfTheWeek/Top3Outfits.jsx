import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function Top3Outfits({ topOutfits, user, handleLike, handleDelete }) {
  if (!topOutfits || topOutfits.length === 0) return null;
  const userId = user?.result?._id || user?.result?.sub;

  const renderLikeButton = (outfit) => (
    <button
      onClick={() => handleLike(outfit)}
      className="text-2xl focus:outline-none"
      aria-label="Like outfit"
    >
      {outfit.likes?.includes(userId) ? (
        <AiFillHeart className="text-red-500" />
      ) : (
        <AiOutlineHeart />
      )}
    </button>
  );

  return (
    <div className="mb-16">
      {/* 🥇 1st Place */}
      {topOutfits[0] && (
        <div className="flex flex-col md:flex-row gap-8 mb-12 bg-[#faf7f3] p-6 rounded-xl shadow border border-[#f0e4d3]">
          <img
            src={topOutfits[0].imageUrl}
            alt={topOutfits[0].title ?? 'Top outfit'}
            className="w-full md:w-1/2 rounded-xl object-cover shadow max-h-[500px]"
          />
          <div className="flex flex-col justify-between md:w-1/2">
            <div>
              <h3 className="text-2xl font-bold text-[#aa5a44] mb-2">
                🥇 1st Place - {topOutfits[0].title ?? 'Outfit'}
              </h3>
              <p className="text-gray-700 mb-2">{topOutfits[0].description}</p>
              <p className="text-sm text-gray-600">
                By <span className="font-semibold">{topOutfits[0].creatorName ?? 'Anonymous'}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {renderLikeButton(topOutfits[0])}
              <span className="text-sm">{topOutfits[0].likes?.length ?? 0} likes</span>
              {(user?.result?._id === topOutfits[0].submittedBy  || user?.result?._sub === topOutfits[0].submittedBy) && (
                <Button
                  onClick={() => handleDelete(topOutfits[0])}
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  sx={{ mt: 1, borderColor: '#ef4444' }}
                  className="hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🥈 2nd & 🥉 3rd Place */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topOutfits.slice(1, 3).map((outfit, i) => (
          <div
            key={outfit._id}
            className="bg-white border border-[#f0e4d3] rounded-xl p-4 shadow"
          >
            <img
              src={outfit.imageUrl}
              alt={outfit.title ?? `Top ${i + 2} outfit`}
              className="w-full h-56 object-cover rounded-lg mb-3"
            />
            <h4 className="text-xl font-semibold text-[#aa5a44] mb-1">
              {i === 0 ? '🥈 2nd Place' : '🥉 3rd Place'} - {outfit.title ?? 'Outfit'}
            </h4>
            <p className="text-gray-600 text-sm mb-2">{outfit.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              By <span className="font-semibold">{outfit.creatorName ?? 'Anonymous'}</span>
            </p>
            <div className="flex items-center gap-2">
              {renderLikeButton(outfit)}
              <span className="text-sm">{outfit.likes?.length ?? 0} likes</span>
              {(user?.result?._id === outfit.submittedBy  || user?.result?._sub === outfit.submittedBy) && (
                <Button
                  onClick={() => handleDelete(outfit)}
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  sx={{ mt: 1, borderColor: '#ef4444' }}
                  className="hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}