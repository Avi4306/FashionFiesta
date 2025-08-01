<<<<<<< HEAD
import React, { useState, forwardRef } from "react";
=======
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../../actions/posts";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
<<<<<<< HEAD
import {
    Snackbar,
    Button,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { FaHeart, FaShareAlt, FaTrash } from 'react-icons/fa';

dayjs.extend(relativeTime);

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Post = forwardRef(({ post }, ref) => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    const userId = profile?.result?._id || profile?.result?.sub;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [likes, setLikes] = useState(post?.likes);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // NEW: State for the share success snackbar
    const [showShareSuccess, setShowShareSuccess] = useState(false);

    const hasLikedPost = likes?.includes(userId);

    const handleLike = (e) => {
        e.stopPropagation();
        if (!userId) {
            setOpenSnackbar(true);
        } else {
            dispatch(likePost(post._id));
            if (hasLikedPost) {
                setLikes(likes.filter((id) => id !== userId));
            } else {
                setLikes([...likes, userId]);
            }
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = (e) => {
        e.stopPropagation();
        dispatch(deletePost(post._id));
        setIsDeleteDialogOpen(false);
    };

    const handleCloseDialog = (e) => {
        e.stopPropagation();
        setIsDeleteDialogOpen(false);
    };

    // NEW: Function to close the share snackbar
    const handleShareSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setShowShareSuccess(false);
    };

    // UPDATED: Handle share logic with Web Share API fallback
    const handleShare = async (e) => {
        e.stopPropagation();
        const link = `${window.location.origin}/style-diaries/${post._id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: `Check out this post by ${post.name}!`,
                    url: link,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(link);
                setShowShareSuccess(true);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    const openPost = () => navigate(`/style-diaries/${post._id}`);

    const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${post?.name?.charAt(0) || 'A'}`;
    const formattedDate = dayjs(post?.createdAt).fromNow();

    return (
        <div
            onClick={openPost}
            ref={ref}
            className="bg-card-bg rounded-xl shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        >
            {/* Header with User Info */}
            <div className="flex items-center p-4">
                <img
                    className="h-10 w-10 rounded-full object-cover mr-3"
                    src={post?.creatorPfp || avatarPlaceholder}
                    alt={post?.name || 'Author'}
                />
                <div className="flex-grow">
                    <p className="font-semibold text-sm text-text-primary">{post?.name}</p>
                    <p className="text-xs text-text-secondary">{formattedDate}</p>
                </div>
                {/* Delete button (only for the creator) */}
                {userId === post?.creator && (
                    <Tooltip title="Delete Post">
                        <IconButton
                            onClick={handleDelete}
                            size="small"
                            className="hover:text-red-500"
                        >
                            <FaTrash />
                        </IconButton>
                    </Tooltip>
                )}
            </div>

            {/* Post Content */}
            <div className="p-4 pt-0 flex flex-col flex-grow">
                {/* Post Title */}
                <h3 className="font-bold text-lg text-text-primary mb-2">{post?.title}</h3>

                {/* Post Image */}
                {post?.selectedFiles?.length > 0 && (
                    <div className="w-full h-52 overflow-hidden rounded-md mb-4">
                        <img
                            className="h-full w-full object-cover"
                            src={post.selectedFiles[0]}
                            alt={post?.title || 'Post image'}
                        />
                    </div>
                )}

                {/* Post Message/Excerpt */}
                <p className="text-text-secondary text-sm flex-grow">
                    {post?.content?.substring(0, 100)}{post?.content?.length > 100 && '...'}
                </p>

                {/* Tags */}
                <p className="text-xs text-accent-medium font-semibold mt-4">
                    {post?.tags?.map(tag => `#${tag} `)}
                </p>
            </div>

            {/* Footer with Actions */}
            <div className="border-t border-gray-100 px-5 py-3 flex justify-between items-center mt-auto">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-sm font-semibold cursor-pointer transition-colors ${
                        hasLikedPost ? 'text-red-500' : 'text-text-secondary hover:text-red-500'
                    }`}
                >
                    <FaHeart className="h-5 w-5" />
                    {likes?.length > 0
                        ? `${likes.length} Like${likes.length > 1 ? 's' : ''}`
                        : 'Like'}
                </button>

                <div>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-blue-500 transition-colors cursor-pointer"
                    >
                        <FaShareAlt className="h-5 w-5" />
                        Share
                    </button>
                </div>
            </div>

            {/* Snackbar for 'Please sign in to like' */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={(e) => {
                        e.stopPropagation();
                        setOpenSnackbar(false);
                    }}
                    severity="info"
                    sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                >
                    <div className="flex-grow">Please sign in to like a post.</div>
                    <Button
                        color="inherit"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenSnackbar(false);
                            navigate('/auth');
                        }}
                    >
                        SIGN IN
                    </Button>
                </Alert>
            </Snackbar>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* NEW: Snackbar for "Link copied" message */}
            <Snackbar
                open={showShareSuccess}
                autoHideDuration={3000}
                onClose={handleShareSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleShareSnackbarClose} severity="success">
                    Post link copied to clipboard!
                </Alert>
            </Snackbar>
        </div>
    );
});
=======
import { useState } from "react";

dayjs.extend(relativeTime);

const Post = ({ post, setCurrentId }) => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  const userId = profile?.result?._id || profile?.result?.sub;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post?.likes);
  const hasLikedPost = likes?.includes(userId);

  const handleLike = (e) => {
    e.stopPropagation()
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

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(post._id));
    }
  };

  const openPost = () => navigate(`/style-diaries/${post._id}`);

  // Using the first letter of the name for the avatar placeholder
  const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${post?.name?.charAt(0) || 'A'}`;


  return (
    <div onClick={openPost} className="bg-card-bg rounded-xl shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      {/* Clickable Area */}
      <div className="cursor-pointer">
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
          {likes?.length > 0
          ? `${likes.length} Like${likes.length > 1 ? 's' : ''}`
          : 'Like'}
        </button>
        {userId === post?.creator && (
          <div className="flex gap-2">
            <button onClick={handleDelete} className="text-text-secondary hover:text-red-500 text-xs font-medium">DELETE</button>
          </div>
        )}
      </div>
    </div>
  );
};
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf

export default Post;