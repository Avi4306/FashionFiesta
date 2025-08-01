<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, getPostsBySearch, likePost, deletePost } from '../../../../actions/posts';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentSection from './CommentSection'; // Assuming this component exists
import {
    Button,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { FaHeart, FaShareAlt, FaTrash } from 'react-icons/fa';

dayjs.extend(relativeTime);

// Helper component for a more styled snackbar alert
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PostDetails = () => {
    const { post, posts, isLoading } = useSelector((state) => state.posts);
    const { authData } = useSelector((state) => state.auth);
    const user = authData?.result;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [currentImage, setCurrentImage] = useState(null);
    const [likes, setLikes] = useState(post?.likes || []);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // NEW: Centralized state for all Snackbar messages
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    useEffect(() => {
        if (id) {
            dispatch(getPost(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (post) {
            setCurrentImage(post.selectedFiles?.[0] || null);
            setLikes(post.likes);
            dispatch(getPostsBySearch({ searchQuery: 'none', tags: post.tags.join(',') }));
        }
    }, [post, dispatch]);

    const recommendedPosts = posts.data?.length
        ? posts.data.filter(({ _id }) => _id !== post?._id)
        : [];

    const hasLikedPost = likes?.includes(user?._id);

    const handleLike = () => {
        if (!user) {
            setSnackbar({
                open: true,
                message: "Please sign in to like a post.",
                severity: "info",
            });
            return;
        }

        dispatch(likePost(post._id));
        // Optimistic UI update
        if (hasLikedPost) {
            setLikes(likes.filter((id) => id !== user?._id));
        } else {
            setLikes([...likes, user?._id]);
        }
    };

    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deletePost(post._id));
        navigate('/');
        setIsDeleteDialogOpen(false);
    };

    const handleCloseDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: `Check out this post by ${post.name}!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setSnackbar({
                    open: true,
                    message: "Post link copied to clipboard!",
                    severity: "success",
                });
            } catch (error) {
                console.error("Failed to copy:", error);
            }
        }
    };

    // Unified Snackbar close handler
    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

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
                            <div className="flex items-center justify-between my-6">
                                <div className="flex items-center">
                                    <Link to = {`/user/${post.creator}`}>
                                        <img
                                            className="h-12 w-12 rounded-full object-cover mr-4"
                                            src={post.creatorPfp || avatarPlaceholder}
                                            alt={post.name}
                                        />
                                    </Link>
                                    <div>
                                        <p className="font-semibold text-text-primary">{post.name}</p>
                                        <p className="text-sm text-text-secondary">{dayjs(post.createdAt).fromNow()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        onClick={handleLike}
                                        variant="outlined"
                                        size="small"
                                        className={`!flex !items-center !gap-1 !capitalize !rounded-full !px-3 !py-1 ${hasLikedPost ? '!text-red-500' : '!text-gray-500'} !border-gray-300 hover:!bg-red-50`}
                                    >
                                        <FaHeart size={16} />
                                        <span>{likes.length}</span>
                                    </Button>
                                    <Button
                                        onClick={handleShare}
                                        variant="outlined"
                                        size="small"
                                        className="!flex !items-center !gap-1 !capitalize !rounded-full !px-3 !py-1 !text-gray-500 !border-gray-300 hover:!bg-gray-100"
                                    >
                                        <FaShareAlt size={16} />
                                    </Button>
                                    {user?._id === post?.creator && (
                                        <Tooltip title="Delete Post">
                                            <IconButton onClick={handleDelete} className="!text-red-500 hover:!bg-red-50">
                                                <FaTrash />
                                            </IconButton>
                                        </Tooltip>
                                    )}
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

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
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

            {/* NEW: Unified Snackbar for all messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                >
                    <div className="flex-grow">{snackbar.message}</div>
                    {snackbar.severity === 'info' && (
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => {
                                handleSnackbarClose();
                                navigate('/auth');
                            }}
                        >
                            SIGN IN
                        </Button>
                    )}
                </Alert>
            </Snackbar>
        </main>
    );
=======
import React, { useEffect} from 'react'
import {Paper, Typography, CircularProgress, Divider, Button} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getPost } from '../../../../actions/posts'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getPostsBySearch } from '../../../../actions/posts'
import Avatar from '@mui/material/Avatar';
import CommentSection from './CommentSection'
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'

dayjs.extend(relativeTime);

const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const profile = JSON.parse(localStorage.getItem("profile"));
  const userId = profile?.result?._id || profile?.result.sub
  const handleLike = () => {
      if (!userId) {
        navigate('/auth');
      }
      else if (userId === post.creator) {
        alert("You cannot like your own post.");
      } 
      else {
        setLikes(post.likes.includes(userId) ? post.likes.filter(id => id !== userId) : [...post.likes, userId]);
        dispatch(likePost(post._id));
      }
  }
  const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete this post?")) {
        dispatch(deletePost(post._id));
      }
  }
  const Likes = () => {
    if (post.likes.length > 0) {
      return post.likes.includes(userId) ? (
        <><ThumbUpIcon fontSize="small" />&nbsp;{post.likes.length > 2 ? `You and ${post.likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}`}</>
      ) : (
        <><ThumbUpOffAltIcon fontSize="small" />&nbsp;{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>
      );
    }
    return <><ThumbUpOffAltIcon fontSize="small" />&nbsp;Like</>;
  }
  useEffect(() => {
    if (id) {
      dispatch(getPost(id));
    }
  }, [id, dispatch]);

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
        {/* You can replace this with a more styled spinner if you like */}
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
                  src={post.profilePicture || avatarPlaceholder}
                  alt={post.name}
                />
                <div>
                  <p className="font-semibold text-text-primary">{post.name}</p>
                  <p className="text-sm text-text-secondary">{dayjs(post.createdAt).fromNow()}</p>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />
              
              {/* Using a 'prose' like styling for the post content for readability */}
              <div className="text-text-secondary text-base md:text-lg leading-relaxed space-y-4">
                <p>{post.message || post.content}</p> 
              </div>

            </div>

            {/* --- Right Column: Post Image --- */}
            {(post.selectedFile) && (
              <div className="md:col-span-2 md:sticky md:top-24 h-fit">
                <img
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                  src={post.selectedFile}
                  alt={post.title}
                />
              </div>
            )}
          </div>
          
          {/* --- Comment Section --- */}
          <hr className="my-8 md:my-12 border-gray-200" />
          <CommentSection post={post} />
        </div>

        {/* --- Recommended Posts Section --- */}
        {recommendedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedPosts.slice(0, 4).map(({ title, name, likes, _id, selectedFile }) => (
                <div key={_id} onClick={() => navigate(`/style-diaries/${_id}`)} className="bg-card-bg rounded-lg shadow-md overflow-hidden cursor-pointer group">
                  <img 
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    src={selectedFile || 'https://placehold.co/400x300/F0E4D3/44403c?text=Image'} 
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
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
};

export default PostDetails;