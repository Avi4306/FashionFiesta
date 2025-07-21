import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../../actions/posts";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from "react";

dayjs.extend(relativeTime);

const Post = ({ post, setCurrentId }) => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  const userId = profile?.result?._id || profile?.result?.sub;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post?.likes);
  const hasLikedPost = likes?.includes(userId);

  const handleLike = () => {
    if (!userId) {
      alert("You must be logged in to like a post.");
      return navigate('/auth');
    }
    dispatch(likePost(post._id));
    if (hasLikedPost) {
      setLikes(likes.filter((id) => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(post._id));
    }
  };

  const openPost = () => navigate(`/style-diaries/${post._id}`);

  // Using the first letter of the name for the avatar placeholder
  const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${post?.name?.charAt(0) || 'A'}`;


  return (
    <div className="bg-card-bg rounded-xl shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Clickable Area */}
      <div onClick={openPost} className="cursor-pointer">
        <img
          className="h-52 w-full object-cover"
          // MODIFIED LINE 1: Using a descriptive placeholder for the main image.
          src={post?.selectedFile || 'https://placehold.co/600x400/F0E4D3/44403c?text=Image+Not\\nAvailable'}
          alt={post?.title || 'Post image'}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center mb-4">
          <img
            className="h-10 w-10 rounded-full object-cover mr-3"
            // MODIFIED LINE 2: Using a themed placeholder for the user avatar.
            src={post?.profilePicture || avatarPlaceholder}
            alt={post?.name || 'Author'}
          />
          <div>
            <p className="font-semibold text-sm text-text-primary">{post?.name}</p>
            <p className="text-xs text-text-secondary">{dayjs(post?.createdAt).fromNow()}</p>
          </div>
        </div>

        <h3 className="font-bold text-lg text-text-primary mb-2">{post?.title}</h3>
        <p className="text-text-secondary text-sm flex-grow">
          {post?.content?.substring(0, 100)}{post?.content?.length > 100 && '...'}
        </p>
        <p className="text-xs text-accent-medium font-semibold mt-4">
          {post?.tags?.map(tag => `#${tag} `)}
        </p>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 px-5 py-3 flex justify-between items-center mt-auto">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-semibold transition-colors ${hasLikedPost ? 'text-like-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          {/* Using an SVG for a cleaner icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.562 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {likes?.length || 0} Likes
        </button>
        {userId === post?.creator && (
          <div className="flex gap-2">
            <button onClick={() => setCurrentId(post._id)} className="text-text-secondary hover:text-blue-500 text-xs font-medium">EDIT</button>
            <button onClick={handleDelete} className="text-text-secondary hover:text-red-500 text-xs font-medium">DELETE</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;