import React, {use, useEffect} from 'react'
import {Paper, Typography, CircularProgress, Divider} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getPost } from '../../../../actions/posts'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getPostsBySearch } from '../../../../actions/posts'
import Avatar from '@mui/material/Avatar';
import CommentSection from './CommentSection'

dayjs.extend(relativeTime);

const PostDetails = () => {
  const {post, posts, isLoading} = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
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
          <Avatar src={post.profilePicture}>
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
