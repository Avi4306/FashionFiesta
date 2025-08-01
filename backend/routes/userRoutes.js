import express from 'express';
<<<<<<< HEAD
import {getUser, loginUser, googleAuth, updateUser, deleteUser, getUserPosts, getUserProducts} from '../controller/user.controller.js';
import auth from '../middleware/auth.js'
const userRouter = express.Router();
userRouter.get('/:id', getUser);
userRouter.post('/login', loginUser);
userRouter.post('/google', googleAuth);
userRouter.delete('/:id', auth, deleteUser);
userRouter.put('/profile/:id', updateUser);
userRouter.get('/:id/posts', getUserPosts);
userRouter.get('/:id/products', getUserProducts);
=======
import {getUser, signupUser, loginUser, googleAuth, updateUser, deleteUser} from '../controller/user.controller.js';

const userRouter = express.Router();
userRouter.get('/:id', getUser);
userRouter.post('/signup', signupUser);
userRouter.post('/login', loginUser);
userRouter.post('/google', googleAuth);
userRouter.delete('/:id', deleteUser);
userRouter.put('/profile/:id', updateUser);
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf


export default userRouter;