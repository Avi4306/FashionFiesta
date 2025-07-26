import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, getPostsBySearch } from '../../../../actions/posts';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentSection from './CommentSection';

dayjs.extend(relativeTime);

const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // State to manage the main image being displayed
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getPost(id));
    }
  }, [id, dispatch]);

  // Set the initial image once the post data is loaded
  useEffect(() => {
    if (post?.selectedFiles?.length > 0) {
      setCurrentImage(post.selectedFiles[0]);
    }
  }, [post]);

  // Fetch related posts once the main post is loaded
  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ searchQuery: 'none', tags: post.tags.join(',') }));
    }
  }, [post, dispatch]);
  
  // Filter out the current post from the recommended list
  const recommendedPosts = posts?.length
    ? posts.filter(({ _id }) => _id !== post?._id)
    : [];

  // --- Loading State ---
  if (isLoading || !post) {
    return (
      <div className="flex justify-center items-center h-screen bg-page-bg">
        <div className="text-xl text-text-secondary">Loading Post...</div>
      </div>
    );
  }

  const avatarPlaceholder = `https://placehold.co/48x48/F0E4D3/44403c?text=${post.name?.charAt(0) || 'A'}`;

  return (
    <main className="bg-page-bg text-text-primary px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* --- Main Post Section --- */}
        <div className="bg-card-bg p-6 sm:p-8 lg:p-12 rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">

            {/* --- Left Column: Post Content --- */}
            <div className="md:col-span-3">
              <div className="mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-block bg-accent-light text-text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mr-2">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary my-4 leading-tight">{post.title}</h1>
              
              <div className="flex items-center my-6">
                <img
                  className="h-12 w-12 rounded-full object-cover mr-4"
                  src={post.creatorPfp || avatarPlaceholder} // Using the correct field name
                  alt={post.name}
                />
                <div>
                  <p className="font-semibold text-text-primary">{post.name}</p>
                  <p className="text-sm text-text-secondary">{dayjs(post.createdAt).fromNow()}</p>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />
              
              <div className="text-text-secondary text-base md:text-lg leading-relaxed space-y-4">
                <p>{post.content}</p> 
              </div>
            </div>

            {/* --- Right Column: Post Images --- */}
            {(post.selectedFiles?.length > 0) && (
              <div className="md:col-span-2 md:sticky md:top-24 h-fit">
                <img
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                  src={currentImage || "https://placehold.co/600x400/F0E4D3/44403c?text=Image+Not\\nAvailable"}
                  alt={post.title}
                />
                 {post.selectedFiles.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-auto">
                    {post.selectedFiles.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`thumbnail-${idx}`}
                        className={`w-20 h-20 object-cover rounded-md border cursor-pointer ${
                          img === currentImage ? "border-2 border-accent-medium" : "border-gray-200"
                        }`}
                        onClick={() => setCurrentImage(img)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <hr className="my-8 md:my-12 border-gray-200" />
          <CommentSection post={post} />
        </div>

        {/* --- Recommended Posts Section --- */}
        {recommendedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedPosts.slice(0, 4).map(({ title, name, likes, _id, selectedFiles }) => (
                <div key={_id} onClick={() => navigate(`/style-diaries/${_id}`)} className="bg-card-bg rounded-lg shadow-md overflow-hidden cursor-pointer group">
                  <img 
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    src={selectedFiles?.[0] || 'https://placehold.co/400x300/F0E4D3/44403c?text=Image'} 
                    alt={title}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary truncate">{title}</h3>
                    <p className="text-sm text-text-secondary mt-1">By {name}</p>
                    <p className="text-xs text-text-secondary mt-2">{likes.length} Likes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PostDetails;