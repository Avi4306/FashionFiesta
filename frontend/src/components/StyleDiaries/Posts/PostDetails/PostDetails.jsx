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
  const {post, posts, isLoading} = useSelector((state) => state.posts);
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
  }, [id]);
  useEffect(() => {
    if(post){
      dispatch(getPostsBySearch({ searchQuery: 'none', tags: post.tags.join(',') }));
    }
  }, [post]);
  const recommendedPosts = post && posts?.length
  ? posts.filter(({ _id }) => _id !== post._id)
  : [];
  if (isLoading || !post) {
    return (
      <Paper elevation={6} className="p-4">
        <CircularProgress size="7em" />
      </Paper>
    );
  }
  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
    <div>
        <div>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Avatar src={post.creatorPfp}>
            {post.name?.charAt(0)}
          </Avatar>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{dayjs(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
        </div>
        {(post.selectedFile) && (
          <div >
          <img src={post.selectedFile} alt={post.title} />
        </div>
        )}
        <Button size="small" color="primary" onClick={(e) => {
          e.stopPropagation(); // Prevent parent click
          handleLike();
        }}>
        <Likes />
        </Button>
        {userId === post.creator && (
          <Button
            size="small"
            color="primary"
            startIcon={<DeleteIcon />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent click
              handleDelete();
            }}
          >
            Delete
          </Button>
        )}
        <CommentSection post={post}/>
    </div>
    {recommendedPosts.length > 0 && (
      <div>
        <Divider />
        <Typography variant="h5" gutterBottom>You Might Also Like:</Typography>
        <div className="mt-4">
          {recommendedPosts.map(({ title, content, name, creatorPfp, tags, likes, _id}) => (
            <Paper key={_id} className="p-4 mb-4" onClick={() => navigate(`/style-diaries/${_id}`)}>
              <Typography variant="h6">{title}</Typography>
              <Typography variant="body2">{content}</Typography>
              <Avatar src={creatorPfp}>{name?.charAt(0)}</Avatar>
              <Typography variant="body2">{name}</Typography>
              <Typography variant="subtitle2" color="textSecondary">{tags.map((tag) => `#${tag} `)}</Typography>
              <Typography variant="body2">Likes: {likes.length}</Typography>
              <Typography variant="body2">{dayjs(post.createdAt).fromNow()}</Typography>
            </Paper>
          ))}
        </div>
      </div>
    )}
    </Paper>
  )
}

export default PostDetails
