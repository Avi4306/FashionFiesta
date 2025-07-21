import React from 'react'
import { useState, useRef } from 'react'
import { Button, TextField, Typography, Avatar } from '@mui/material'
import { useDispatch } from 'react-redux'
import { commentPost } from '../../../../actions/posts'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const CommentSection = ({ post }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    
    const [comments, setComments] = useState(post?.comments || []);
    const [comment, setComment] = useState('');

    const handleCommentSubmit = async () => {
        if (!comment.trim()) return;
        const commentData = {
            name : user?.result?.name,
            comment,
            profilePhoto: user?.result?.profilePhoto
    };
        setComments([...comments, commentData]);
        setComment('');
        dispatch(commentPost(commentData, post._id));
    }
    const Clear = () => {
        setComment('');
    }
  return (
        <div>
            {/* Themed Section Header */}
            <h3 className="text-2xl font-bold text-[#44403c] dark:text-[#dcc5b2] mb-6">Comments ({comments.length})</h3>

            {/* List of Comments */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 mb-8">
                {comments.map((c, index) => {
                    // Splitting "Name: The comment text" to style them differently
                    const parts = c.split(': ');
                    const name = parts[0];
                    const commentText = parts.slice(1).join(': ');

                    // Themed placeholder avatar using your hex codes
                    const avatarPlaceholder = `https://placehold.co/40x40/F0E4D3/44403c?text=${name?.charAt(0) || '?'}`;
                    
                    return (
                        <div key={index} className="flex items-start gap-4">
                            <img 
                                src={avatarPlaceholder}
                                alt={name} 
                                className="h-10 w-10 rounded-full"
                            />
                            {/* Themed comment bubble using your light accent color */}
                            <div className="flex-1 bg-[#F0E4D3] dark:bg-[#292524] p-4 rounded-lg">
                                <p className="font-semibold text-sm text-[#44403c] dark:text-[#e7e5e4]">{name}</p>
                                <p className="text-[#78716c] dark:text-[#a8a29e] mt-1">{commentText}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Themed "Add a Comment" Form */}
            <div className="mt-6">
                {user?.result?.name ? (
                    <div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={`Commenting as ${user.result.name}...`}
                            className="w-full p-3 border rounded-lg bg-transparent border-[#DCC5B2] dark:border-[#44403c] text-[#dcc5b2] dark:text-[#c19580] focus:ring-2 focus:ring-[#d97706] focus:border-transparent transition-shadow"
                            rows="3"
                        />
                        <div className="flex justify-end gap-4 mt-2">
                            {comment.trim() && (
                                <button
                                    onClick={() => setComment('')}
                                    className="py-2 px-4 rounded-lg text-sm font-semibold text-[#78716c] dark:text-[#a8a29e] hover:bg-[#F0E4D3] dark:hover:bg-[#292524] transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                disabled={!comment.trim()}
                                onClick={handleCommentSubmit}
                                className="bg-[#d97706] text-white py-2 px-6 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-[#78716c] dark:text-[#a8a29e] p-4 text-center bg-[#F0E4D3] dark:bg-[#292524] rounded-lg">
                        Please <a href="/auth" className="font-semibold text-[#d97706] hover:underline">sign in</a> to join the conversation.
                    </p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;