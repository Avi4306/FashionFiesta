import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserPosts } from '../../actions/user';
import { Link, useParams } from 'react-router-dom';

export default function UserPostsPage() {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get user ID from URL
  const { posts, isLoading } = useSelector(state => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserPosts(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading all posts...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-[#44403c] mb-6">All Posts</h2>
      <Link to={`/user/${id}`} className="text-sm text-[#aa5a44] hover:underline mb-6 block">
        &larr; Back to Profile
      </Link>
      {posts?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map(post => (
            <Link 
              to={`/style-diaries/${post._id}`}
              key={post._id}
              className="bg-white border border-[#f0e4d3] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
            >
              {post.image && (
                <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <h4 className="font-semibold text-[#44403c]">{post.title}</h4>
                <p className="text-sm text-[#78716c] line-clamp-2">{post.content || "No content"}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#78716c]">This user has no posts to display.</p>
      )}
    </div>
  );
}