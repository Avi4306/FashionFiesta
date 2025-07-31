import express from 'express';
import {getUser, loginUser, googleAuth, updateUser, deleteUser, getUserPosts, getUserProducts} from '../controller/user.controller.js';
import {auth} from '../middleware/auth.js'
import { applyDesignerApplication } from '../controller/user.controller.js';

const userRouter = express.Router();
userRouter.get('/:id', getUser);
userRouter.post('/login', loginUser);
userRouter.post('/google', googleAuth);
userRouter.delete('/:id', auth, deleteUser);
userRouter.put('/profile/:id', updateUser);
userRouter.get('/:id/posts', getUserPosts);
userRouter.get('/:id/products', getUserProducts);
userRouter.post('/apply-designer/:id', auth, applyDesignerApplication);


export default userRouter;