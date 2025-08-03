import React from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function OutfitGallery({
  outfits,
  user,
  handleLike,
  currentPage,
  setCurrentPage,
  pageSize
}) {
  const paginatedItems = outfits.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(outfits.length / pageSize);

  if (outfits.length === 0) return null;

  return (
    <>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Other Submissions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedItems.map((outfit) => (
          <div key={outfit._id} className="bg-white rounded-xl shadow p-4">
            <img
              src={outfit.imageUrl}
              alt={outfit.title}
              className="w-full h-52 object-cover rounded-md mb-2"
            />
            <h4 className="text-lg font-semibold text-[#aa5a44]">{outfit.title}</h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{outfit.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => handleLike(outfit._id)} className="text-xl">
                {outfit.likes.includes(user?.result?._id)
                  ? <AiFillHeart className="text-red-500" />
                  : <AiOutlineHeart />}
              </button>
              <span>{outfit.likes.length} likes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}