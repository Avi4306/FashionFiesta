import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../../actions/posts";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Snackbar, Button } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

dayjs.extend(relativeTime);

// Helper component for a more styled snackbar alert
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Post = ({ post }) => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    const userId = profile?.result?._id || profile?.result?.sub;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [likes, setLikes] = useState(post?.likes);
    const [copied, setCopied] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isHovering, setIsHovering] = useState(false); // New state for hover tracking

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
    const mainPostImage = post?.selectedFiles?.[0] || 'https://placehold.co/600x400/F0E4D3/44403c?text=Image+Not\\nAvailable';

    return (
        <div
            onClick={openPost}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                if (openSnackbar) {
                    setOpenSnackbar(false);
                }
            }}
            className="bg-card-bg rounded-xl shadow-md overflow-visible flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        >
            <div className="cursor-pointer">
                <img
                    className="h-52 w-full object-cover"
                    src={mainPostImage}
                    alt={post?.title || 'Post image'}
                />
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center mb-4">
                    <img
                        className="h-10 w-10 rounded-full object-cover mr-3"
                        src={post?.creatorPfp || avatarPlaceholder}
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

            <div className="border-t border-gray-100 px-5 py-3 flex justify-between items-center mt-auto">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-sm font-semibold cursor-pointer transition-colors ${
                        hasLikedPost ? 'text-like-accent' : 'text-text-secondary hover:text-blue-500'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.562 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
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
                        className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-yellow-500 transition-colors cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M8 16.93a10 10 0 008 0M8 7.07a10 10 0 018 0"
                            />
                        </svg>
                        Share
                    </button>
                    {copied && (
                        <div className="absolute top-full mt-1 text-xs text-green-600 bg-white px-2 py-1 rounded shadow border border-green-200">
                            Link copied!
                        </div>
                    )}
                </div>

                {userId === post?.creator && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleDelete}
                            className="text-text-secondary hover:text-red-500 text-xs font-medium cursor-pointer"
                        >
                            DELETE
                        </button>
                    </div>
                )}
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
};

export default Post;