import express from 'express';
import {getProductById,getAllProducts, createProduct} from '../controller/product.controller.js';
import auth from '../middleware/auth.js'

const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.post('/', auth, createProduct);
productRouter.get('/:id', getProductById);

export default productRouter;