import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserPosts } from '../../actions/user';
import { Link, useParams } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/solid';

// --- Helper Components ---

const CardSkeleton = () => (
    <div className="bg-[#faf7f3] rounded-lg p-4 border border-[#f0e4d3] animate-pulse">
        {/* Skeleton matches the 'small' card height */}
        <div className="bg-stone-300 rounded-md h-40 w-full"></div>
        <div className="mt-4">
            <div className="h-5 w-3/4 bg-stone-300 rounded"></div>
            <div className="h-4 w-full bg-stone-200 rounded mt-2"></div>
            <div className="h-4 w-5/6 bg-stone-200 rounded mt-1"></div>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="col-span-full text-center bg-[#faf7f3] border-2 border-dashed border-[#f0e4d3] rounded-lg p-12 mt-8">
        <PhotoIcon className="mx-auto h-12 w-12 text-[#d6d3d1]" />
        <h3 className="mt-4 text-lg font-medium text-[#44403c]">No Posts Found</h3>
        <p className="mt-2 text-sm text-[#78716c]">This user hasn't created any posts yet.</p>
    </div>
);

// --- Main Component ---

export default function UserPostsPage() {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get user ID from URL
  const { posts, isLoading } = useSelector(state => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserPosts(id));
    }
  }, [dispatch, id]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (posts?.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <Link 
              to={`/style-diaries/${post._id}`}
              key={post._id}
              className="group flex flex-col bg-[#faf7f3] rounded-lg border border-[#f0e4d3] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Fixed height container for the image */}
              <div className="h-40 w-full overflow-hidden">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-[#d6d3d1]" />
                  </div>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <div>
                  <h4 className="font-semibold text-[#44403c] truncate group-hover:text-[#aa5a44] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-sm text-[#78716c] line-clamp-2 mt-1">
                    {post.content || "No content"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }

    return <EmptyState />;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* --- Enhanced Header --- */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#44403c]">All Posts</h1>
          <Link to={`/user/${id}`} className="inline-flex items-center gap-2 px-4 py-2 border border-[#aa5a44] text-sm font-medium rounded-md text-[#aa5a44] bg-transparent hover:bg-[#faf7f3] transition-colors">
            {/* Embedded SVG Arrow Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back to Profile
          </Link>
        </div>

        {/* --- Content Grid --- */}
        {renderContent()}
      </div>
    </div>
  );
}