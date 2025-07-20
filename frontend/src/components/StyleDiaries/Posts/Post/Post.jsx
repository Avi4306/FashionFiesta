import {
  Card,
  CardActions,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../../actions/posts";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Post = ({ post }) => {
  const userId = JSON.parse(localStorage.getItem("profile"))?.result?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
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

  const handleLike = () => {
    if (!userId) {
      navigate('/auth');
    }
    else if (userId === post.creator) {
      alert("You cannot like your own post.");
    } 
    else {
      dispatch(likePost(post._id));
    }
  }
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(post._id));
    }
  }
  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <CardMedia
        image={post.selectedFile}
        title="Post Image"
        style={{ height: 0, paddingTop: "56.25%" }} // 16:9 aspect ratio
        className="object-cover"
      />
      <div className="px-4 pt-4">

        <Typography variant="h7" component="h2" className="font-bold mt-1">
          {post.name}
        </Typography>
        <Typography variant="h6" component="h2" className="font-bold mt-1">
          {post.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mt-1">
          {post.content}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {post.tags?.map((tag) => `#${tag} `)}
        </Typography>
      </div>

      <CardActions className="flex justify-between px-2 pt-2">
        <Button
          size="small"
          color="primary"
          onClick={handleLike}
        >
          <Likes />
        </Button>
        {userId === post.creator && (
        <Button
          size="small"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={() => dispatch(deletePost(post._id))}
        >
          Delete
        </Button>
          )}
        <Button
          size="small"
          className="text-gray-600"
          startIcon={<MoreHorizIcon />}
        >
          More
        </Button>
      </CardActions>

      <Typography
        variant="caption"
        color="textSecondary"
        className="text-right w-full pr-4 pb-2 italic"
      >
        {dayjs(post.createdAt).fromNow()}
      </Typography>
    </Card>
  );
};

export default Post;
