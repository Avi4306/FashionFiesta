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
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../../actions/posts";

const Post = ({ post }) => {
  const dispatch = useDispatch();

  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <CardMedia
        image={post.selectedFile}
        title="Post Image"
        style={{ height: 0, paddingTop: "56.25%" }} // 16:9 aspect ratio
        className="object-cover"
      />

      <div className="px-4 pt-4">
        <Typography variant="subtitle2" color="textSecondary">
          {post.tags?.map((tag) => `#${tag} `)}
        </Typography>
        <Typography variant="h6" component="h2" className="font-bold mt-1">
          {post.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mt-1">
          {post.content}
        </Typography>
      </div>

      <CardActions className="flex justify-between px-2 pt-2">
        <Button
          size="small"
          color="primary"
          startIcon={<ThumbUpIcon />}
          onClick={() => dispatch(likePost(post._id))}
        >
          Like {post.likes}
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={() => dispatch(deletePost(post._id))}
        >
          Delete
        </Button>
        <Button
          size="small"
          className="text-gray-600"
          startIcon={<MoreHorizIcon />}
        >
          More
        </Button>
      </CardActions>

      <p className="text-xs text-right text-gray-400 pr-4 pb-2 italic">
        Created at: {post.createdAt || "Unknown"}
      </p>
    </Card>
  );
};

export default Post;
