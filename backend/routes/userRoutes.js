import express from 'express';
import {getUser, signupUser, loginUser, googleAuth, updateUser, deleteUser} from '../controller/user.controller.js';

const userRouter = express.Router();
userRouter.get('/:id', getUser);
userRouter.post('/signup', signupUser);
userRouter.post('/login', loginUser);
userRouter.post('/google', googleAuth);
userRouter.delete('/:id', deleteUser);
userRouter.put('/profile/:id', updateUser);


export default userRouter;