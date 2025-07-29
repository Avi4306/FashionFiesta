import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { commentPost } from '../../../../actions/posts'; // Make sure this path is correct

dayjs.extend(relativeTime);

const CommentSection = ({ post }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    
    const initialComments = (post?.comments || []).map(c => ({
        ...c,
        timestamp: c.timestamp || post.createdAt 
    }));
    const [comments, setComments] = useState(initialComments);
    const [comment, setComment] = useState('');

    const handleCommentSubmit = async () => {
        if (!comment.trim()) return;

        const newComment = {
            name: user?.result?.name,
            comment,
            profilePhoto: user?.result?.profilePhoto,
            userId: user?.result?._id || user.result.sub,
            timestamp: new Date().toISOString()
        };

        setComments([...comments, newComment]);
        setComment('');
        dispatch(commentPost(newComment, post._id));
    };

    return (
        <div className="font-sans">
            {/* Main Heading (Always Dark) */}
            <h3 className="text-2xl font-bold text-[#44382f] mb-6">
                Comments ({comments.length})
            </h3>

            {/* List of Comments */}
            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                {comments.map((c, index) => {
                    const name = c.name;
                    const commentText = c.comment;
                    const time = dayjs(c.timestamp).fromNow();
                    const avatarPlaceholder = c.profilePhoto || `https://ui-avatars.com/api/?name=${name?.charAt(0)}&background=F5F1ED&color=44382f&bold=true`;
                    const profileLink = ((user?.result?._id || user?.result?.sub) === c.userId) ? "/user/profile" : `/user/${c.userId}`;
                    
                    return (
                        <div key={index} className="flex items-start gap-4">
                            <Link to={profileLink}>
                                <img 
                                    src={avatarPlaceholder}
                                    alt={name} 
                                    className="h-10 w-10 rounded-full"
                                />
                            </Link>
                            <div className="flex-1">
                                {/* Comment Bubble (Always Light) */}
                                <div className="bg-white px-4 py-3 rounded-xl border border-[#e0d5c6] shadow-sm">
                                    <div className="flex items-baseline gap-2">
                                        <Link to={profileLink} className="group">
                                            {/* Name (Always Dark) */}
                                            <span className="font-semibold text-sm text-[#44382f] group-hover:underline">
                                                {name}
                                            </span>
                                        </Link>
                                        {/* Timestamp (Always Dark-ish) */}
                                        <span className="text-xs text-[#9d8f81]">{time}</span>
                                    </div>
                                    {/* Comment Text (Always Dark) */}
                                    <p className="text-[#5c5046] mt-1.5">{commentText}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* "Add a Comment" Form */}
            <div className="mt-8 pt-6 border-t border-[#e0d5c6]">
                {user?.result ? (
                    <div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add your thoughts..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && comment.trim()) {
                                    e.preventDefault();
                                    handleCommentSubmit();
                                }
                            }}
                            className="w-full p-3 border-2 rounded-lg bg-[#F5F1ED] border-[#e0d5c6] text-[#44382f] placeholder:text-[#9d8f81] focus:ring-2 focus:ring-[#a19386] focus:border-[#a19386] transition-all"
                            rows="3"
                        />
                        <div className="flex justify-end items-center gap-3 mt-3">
                            <button
                                onClick={() => setComment('')}
                                className="py-2 px-4 rounded-lg text-sm font-semibold text-[#887a6d] hover:bg-[#F5F1ED] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!comment.trim()}
                                onClick={handleCommentSubmit}
                                className="bg-[#44382f] text-white py-2 px-6 rounded-lg text-sm font-semibold hover:bg-[#362d27] transition-all disabled:bg-[#a19386] disabled:cursor-not-allowed"
                            >
                                Post Comment
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-[#887a6d] p-4 rounded-lg bg-[#F5F1ED] border border-[#e0d5c6]">
                        <Link to="/auth" className="font-semibold text-[#5c5046] hover:underline">Sign in</Link> to join the discussion.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;