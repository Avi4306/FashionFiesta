import express from 'express';
import { getPosts, createPost, deletePost, likePost } from '../controller/posts.controller.js';
import auth from '../middleware/auth.js';

const styleDiariesRouter = express.Router();
styleDiariesRouter.get("/", getPosts());
styleDiariesRouter.post("/", auth, createPost());
styleDiariesRouter.delete("/:id", auth, deletePost);
//WE can also add route for updating a post if needed

styleDiariesRouter.patch("/:id/likePost", auth, likePost);


export default styleDiariesRouter;