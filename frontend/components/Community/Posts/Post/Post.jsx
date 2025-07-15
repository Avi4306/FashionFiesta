<<<<<<< HEAD:frontend/components/Posts/Post/Post.jsx
import {
  Card,
  CardActions,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const Post = ({ post }) => {
=======
import { Card, CardActions, CardMedia, Button, Typography } from "@mui/material"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {useDispatch} from 'react-redux';
import { deletePost } from '../../../../src/actions/posts';
import { likePost } from "../../../../src/actions/posts";

const Post = ({post}) => {
  const dispatch = useDispatch();
>>>>>>> 783a384056de53ae8475c36c77b78c6d4bf333fa:frontend/components/Community/Posts/Post/Post.jsx
  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <CardMedia
        image={post.selectedFile}
        title="Post Image"
        style={{ height: 0, paddingTop: "56.25%" }} // maintains 16:9 aspect ratio
        className="object-cover"
      />
<<<<<<< HEAD:frontend/components/Posts/Post/Post.jsx
      <div className="p-4">
        <Typography
          variant="h6"
          component="h2"
          className="font-semibold text-lg mb-1"
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          className="text-sm text-gray-600"
        >
          {post.content}
        </Typography>
      </div>
      <CardActions className="flex justify-between px-4 pb-3">
        <Button
          size="small"
          color="primary"
          startIcon={<ThumbUpIcon />}
          className="text-blue-600"
        >
          Like {post.likes}
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<DeleteIcon />}
          className="text-red-500"
        >
=======
      <div style={{ padding: '16px' }}>
        <Typography component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
      </div>
      <div>
        <Typography variant="h6" component="h2">{post.title}</Typography>
        <Typography variant="body2" color="textSecondary" component="p">{post.content}</Typography>
      </div>
      <CardActions>
        <Button size="small" color="primary" startIcon={<ThumbUpIcon />} onClick={() => dispatch(likePost(post._id))}>
          {' '} Like {' '} {post.likes}
        </Button>
        <Button size="small" color="primary" startIcon={<DeleteIcon />} onClick={() => dispatch(deletePost(post._id))}>
>>>>>>> 783a384056de53ae8475c36c77b78c6d4bf333fa:frontend/components/Community/Posts/Post/Post.jsx
          Delete
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<MoreHorizIcon />}
          className="text-gray-600"
        >
          More
        </Button>
      </CardActions>
      <p className="text-xs text-right text-gray-400 pr-4 pb-2 italic">
        {/* Replace with actual time formatting if needed */}
        Created at: {post.createdAt || "Unknown"}
      </p>
    </Card>
  );
};

export default Post;
