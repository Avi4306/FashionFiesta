import express from 'express';
import {getProductById, getCategories, getProductsByCategory, getProducts, createProduct} from '../controller/product.controller.js';
import auth from '../middleware/auth.js'

const productRouter = express.Router();

// productRouter.get('/', getProducts);
productRouter.get("/categories", getProducts);
productRouter.get("/categories/list", getCategories);
productRouter.post('/', auth, createProduct);
productRouter.get('/:id', getProductById);

export default productRouter;