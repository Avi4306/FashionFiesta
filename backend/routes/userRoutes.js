import express from 'express';
import {getUser, signupUser, loginUser, updateUser, deleteUser} from '../controller/user.controller.js';

const userRouter = express.Router();
userRouter.get('/:id', getUser);
userRouter.post('/signup', signupUser);
userRouter.post('/login', loginUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;