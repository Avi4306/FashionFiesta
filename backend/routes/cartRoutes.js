import express from 'express';
import { addToCart, getCart, mergeCarts } from '../controller/cart.controller.js';
import auth from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/add', auth, addToCart);
cartRouter.get('/', auth, getCart);
cartRouter.post('/merge', auth, mergeCarts);

export default cartRouter;