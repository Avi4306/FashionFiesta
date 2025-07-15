import express from 'express';
import { getPosts, createPost, deletePost, likePost } from '../controller/posts.controller.js';
const CommunityRouter = express.Router();

CommunityRouter.get("/", getPosts());
CommunityRouter.post("/", createPost());
CommunityRouter.delete("/:id", deletePost);
//WE can also add route for updating a post if needed

CommunityRouter.patch("/:id/likePost", likePost);


export default CommunityRouter;