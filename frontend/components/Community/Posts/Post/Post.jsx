import { Card, CardActions, CardMedia, Button, Typography } from "@mui/material"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {useDispatch} from 'react-redux';
import { deletePost } from '../../../../src/actions/posts';
import { likePost } from "../../../../src/actions/posts";

const Post = ({post}) => {
  const dispatch = useDispatch();
  return (
    <Card>
      <CardMedia
        image={post.selectedFile}
        title="Post Image"
        style={{ height: 0, paddingTop: '56.25%' }}
        // 16:9 aspect ratio
      />
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
          Delete
        </Button>
        <Button size="small" color="primary" startIcon={<MoreHorizIcon />}>
          More
        </Button>
       {/* Please add createdAt */}
      </CardActions>
    </Card>
  )
}

export default Post
