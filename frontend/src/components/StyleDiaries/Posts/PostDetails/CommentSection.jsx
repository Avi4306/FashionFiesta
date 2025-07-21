import React from 'react'
import { useState, useRef } from 'react'
import { Button, TextField, Typography, Avatar } from '@mui/material'
import { useDispatch } from 'react-redux'
import { commentPost } from '../../../../actions/posts'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const CommentSection = ({post}) => {
    const commentsRef = useRef();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [comments, setComments] = useState(post?.comments || [])
    const [comment, setComment] = useState('')
    const handleCommentSubmit = async () => {
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
      <div>
        <div>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            <div>
                {comments.map((comment, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                    <Avatar src={post.profilePhoto}>
                        {post.name?.charAt(0)}
                    </Avatar>
                    <div>
                    <Typography variant="body2" gutterBottom>
                        <strong>{comment.name}</strong>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {comment.comment}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {dayjs(comment.createdAt).fromNow()}
                    </Typography>
                    </div>
                </div>
                ))}
                    <div ref={commentsRef} />
            </div>
                {user?.result?.name ?
                    <>
                    <TextField
                    fullWidth
                    variant="outlined"
                    label="Add a Comment..."
                    margin="normal"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && comment.trim()) {
                        handleCommentSubmit();
                        }
                    }}
                    />
                    </> 
                    :
                    <Typography variant="body1" gutterBottom>
                        Please <a href="/auth">sign in</a> to comment.
                        </Typography>
                }
                {comment.trim() && (
                    <>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: '10px' }}
                    disabled={!comment}
                    onClick={Clear}
                >
                    Clear
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '10px' }}
                    disabled={!comment}
                    onClick={handleCommentSubmit}
                >
                    Comment
                </Button>
                </>
                )}
        </div>
      </div>
    </div>
  )
}

export default CommentSection
