import express from 'express';
import { getPosts, createPost, deletePost, likePost } from '../controller/posts.controller.js';
const styleDiariesRouter = express.Router();

styleDiariesRouter.get("/", getPosts());
styleDiariesRouter.post("/", createPost());
styleDiariesRouter.delete("/:id", deletePost);
//WE can also add route for updating a post if needed

styleDiariesRouter.patch("/:id/likePost", likePost);


export default styleDiariesRouter;