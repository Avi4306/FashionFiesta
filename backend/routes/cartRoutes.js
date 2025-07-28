// server/routes/cart.routes.js
import express from 'express';
import { auth } from '../middleware/auth.js'; // IMPORTANT: Adjust this path to your auth middleware
import {
    addToCart,
    getCart,
    mergeCarts,
    updateCartItem,
    removeCartItem,
    clearUserCart,
} from '../controller/cart.controller.js';

const router = express.Router();

// Apply auth middleware to all cart routes, assuming user must be logged in for most cart operations
router.use(auth); // This middleware should set req.userId

// Get user's cart
router.get('/', getCart);

// Add product to cart
router.post('/add', addToCart); // Expects { productId, quantity } in body

// Merge local cart (used on login)
router.post('/merge', mergeCarts); // Expects { items: [...] } in body

// Update item quantity in cart
// Use PATCH for partial updates, PUT for full replacement
router.patch('/update/:productId', updateCartItem); // Expects { quantity } in body, productId in params

// Remove item from cart
router.delete('/remove/:productId', removeCartItem); // productId in params

// Clear user's entire cart
router.post('/clear', clearUserCart); // Using POST as it performs an action (clearing)

export default router;