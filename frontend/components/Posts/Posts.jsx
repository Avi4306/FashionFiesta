import Post from "./Post/Post.jsx"
import { Grid, CircularProgress } from "@mui/material";
import {useSelector} from "react-redux"
const Posts = () => {
  const posts = useSelector((state) => state.posts); // Using useSelector to access the posts from the Redux store provided by the reducer
  //posts is the name inside reducer folder, which is the name of the reducer function
  console.log("Posts from Redux state:", posts);
  if (!posts) {
    return <div>No posts available</div>; // Display a fallback if no posts
  } 
  return (
      <Grid container alignItems="stretch" spacing={3}>
        {posts.map((post) => ( //drop the curly braces and just wrap the returned JSX in parentheses (). This means: "Return the expression inside these parentheses."
          <Grid key={post._id} item xs={12} sm={6} md={6}>
            <Post post={post} />
          </Grid>
        ))}
      </Grid>
  )
}

export default Posts
