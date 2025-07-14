import express from 'express';
import { getPosts, createPost } from '../controller/posts.controller.js';
const CommunityRouter = express.Router();

CommunityRouter.get("/", getPosts());
CommunityRouter.post("/", createPost());

export default CommunityRouter;