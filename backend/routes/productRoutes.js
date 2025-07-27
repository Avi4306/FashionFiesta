import express from 'express';
import {getProductById, getCategories, getProductsBySearch, getProductsByCategory, getProducts, createProduct, deleteProduct, addReview} from '../controller/product.controller.js';
import auth from '../middleware/auth.js'

const productRouter = express.Router();

// productRouter.get('/', getProducts);
productRouter.get("/categories", getProducts);
productRouter.get("/categories/list", getCategories);
productRouter.post('/', auth, createProduct);
// By placing the search route first, Express will check for that specific path and handle it correctly. 
// If the path is anything else (like /products/615a1f...), 
// it will fall through to the /:id route, and your getProductById controller will function as expected.
productRouter.get('/search', getProductsBySearch);
productRouter.get('/:id', getProductById);
productRouter.delete('/:id', auth, deleteProduct);
productRouter.patch('/:id/review', auth, addReview);

export default productRouter;