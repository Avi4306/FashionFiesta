import express from 'express';
import { getPosts, getPost, getPostsBySearch, createPost, deletePost, likePost } from '../controller/posts.controller.js';
import auth from '../middleware/auth.js';

const styleDiariesRouter = express.Router();
styleDiariesRouter.get("/", getPosts);
styleDiariesRouter.get("/search", getPostsBySearch);
styleDiariesRouter.get("/:id", getPost);
styleDiariesRouter.post("/", auth, createPost);
styleDiariesRouter.delete("/:id", auth, deletePost);
//WE can also add route for updating a post if needed

styleDiariesRouter.patch("/:id/likePost", auth, likePost);


export default styleDiariesRouter;