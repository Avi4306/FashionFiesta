import React, { useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, likePost } from "../../../../actions/posts";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Snackbar, Button, Tooltip, IconButton } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { FaHeart, FaShareAlt, FaTrash } from 'react-icons/fa'; // Using Font Awesome icons

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
    const [copied, setCopied] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

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
        if (window.confirm("Are you sure you want to delete this post?")) {
            dispatch(deletePost(post._id));
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

                <div className="relative">
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            const link = `${window.location.origin}/style-diaries/${post._id}`;
                            try {
                                await navigator.clipboard.writeText(link);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            } catch (err) {
                                console.error("Failed to copy:", err);
                            }
                        }}
                        className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-blue-500 transition-colors cursor-pointer"
                    >
                        <FaShareAlt className="h-5 w-5" />
                        Share
                    </button>
                    {copied && (
                        <div className="absolute top-full right-0 mt-1 text-xs text-green-600 bg-white px-2 py-1 rounded shadow border border-green-200 z-10">
                            Link copied!
                        </div>
                    )}
                </div>
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={(e) => {
                        e.stopPropagation()
                        setOpenSnackbar(false)
                    }}
                    severity="info"
                    sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                >
                    <div className="flex-grow">Please sign in to like a post.</div>
                    <Button
                        color="inherit"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpenSnackbar(false);
                            navigate('/auth');
                        }}
                    >
                        SIGN IN
                    </Button>
                </Alert>
            </Snackbar>
        </div>
    );
});

export default Post;