import Post from "./Post/Post.jsx"
import { Grid, CircularProgress } from "@mui/material";
import {useSelector} from "react-redux"
import Paginate from "../../Pagination/Pagination.jsx";
import { useState } from "react";

const Posts = () => {
  const {isLoading, posts} = useSelector((state) => state.posts); // Using useSelector to access the posts from the Redux store provided by the reducer
  //posts is the name inside reducer folder, which is the name of the reducer function

  const [currentId, setCurrentId] = useState(0);

  if (!posts.length && !isLoading) {
    return <div>No posts available</div>; // Display a fallback if no posts
  }
  if(isLoading) {
    <CircularProgress style={{margin: 'auto'}} size="7em" />
  }
  return (
      <Grid
  container
  alignItems="stretch"
  spacing={3}
  className="mt-5 px-3"
>
  {posts.map((post) => (
    <Grid
      key={post._id}
      item
      xs={12}
      sm={6}
      md={6}
      className="transition-transform duration-300 hover:scale-[1.02]"
    >
      <Post post={post} setCurrentId={setCurrentId}/>
    </Grid>
  ))}
</Grid>


  )
}

export default Posts
