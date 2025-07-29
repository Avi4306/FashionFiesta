// server/controllers/cart.controller.js
import Cart from '../models/cart.model.js';
import Product from '../models/products.models.js'; // Assuming your product model is here
import mongoose from 'mongoose';

// Helper function to populate product details for consistent responses
const populateCartProducts = async (cart) => {
    if (!cart) return null;
    // Ensure 'product' path is correct and it refers to your Product model
    // The .execPopulate() is for older Mongoose versions, modern Mongoose v6+ populate is awaitable directly
    return await cart.populate('items.product');
};

// --- Add Product to Cart ---
export const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.userId; // Assuming auth middleware adds userId to req

    // Input validation
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID provided.' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be a positive number.' });
    }

    try {
        // Optional: Verify if the product actually exists and is available
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        // You might also check product stock here if applicable

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if the user doesn't have one
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            // Check if the item is already in the cart
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                // If the item exists, update the quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // If the item is new, add it to the cart
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        // Populate the cart before sending the response
        const populatedCart = await populateCartProducts(cart);
        res.status(200).json({ success: true, message: 'Item added to cart', cart: populatedCart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server error adding item to cart.' });
    }
};

// --- Get User Cart ---
export const getCart = async (req, res) => {
    const userId = req.userId;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Return an empty cart structure if not found, instead of 404
            // This is good for frontend consistency
            return res.status(200).json({ success: true, cart: { items: [] } });
        }

        // Populate the cart before sending the response
        const populatedCart = await populateCartProducts(cart);
        res.status(200).json({ success: true, cart: populatedCart });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving cart.' });
    }
};

// --- Merge Local Cart with Permanent Cart (on login) ---
export const mergeCarts = async (req, res) => {
    const { items: localCartItems } = req.body; // Expects { items: [{ product: { _id: '...', ... }, quantity: N }] }
    const userId = req.userId;

    // Input validation for localCartItems
    if (!Array.isArray(localCartItems)) {
        return res.status(400).json({ message: 'Invalid local cart items format.' });
    }

    try {
        let permanentCart = await Cart.findOne({ user: userId });

        if (!permanentCart) {
            permanentCart = new Cart({ user: userId, items: [] });
        }

        for (const localItem of localCartItems) {
            // Validate localItem structure
            if (!localItem.product || !localItem.product._id || typeof localItem.quantity !== 'number' || localItem.quantity < 1) {
                console.warn('Skipping invalid local cart item during merge:', localItem);
                continue; // Skip invalid items
            }

            // Optional: Verify if the product actually exists before merging
            const productExists = await Product.findById(localItem.product._id);
            if (!productExists) {
                console.warn(`Product with ID ${localItem.product._id} not found, skipping during merge.`);
                continue;
            }

            const existingItem = permanentCart.items.find(
                item => item.product.toString() === localItem.product._id
            );

            if (existingItem) {
                // If item exists, add quantities
                existingItem.quantity += localItem.quantity;
            } else {
                // If new item, push to cart
                permanentCart.items.push({
                    product: localItem.product._id, // Use just the product ID
                    quantity: localItem.quantity,
                });
            }
        }

        await permanentCart.save();
        // Populate the cart before sending the response
        const updatedCart = await populateCartProducts(permanentCart);
        res.status(200).json({ success: true, message: 'Cart merged successfully', cart: updatedCart });
    } catch (error) {
        console.error('Error merging carts:', error);
        res.status(500).json({ success: false, message: 'Server error merging carts.' });
    }
};

// --- Update Cart Item Quantity ---
export const updateCartItem = async (req, res) => {
    const { productId } = req.params; // Product ID from URL params (e.g., /api/cart/update/:productId)
    const { quantity } = req.body; // New quantity from request body
    const userId = req.userId; // User ID from auth middleware

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID provided.' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be a positive number.' });
    }

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user.' });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            const populatedCart = await populateCartProducts(cart);
            res.status(200).json({ success: true, message: 'Cart item quantity updated.', cart: populatedCart });
        } else {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({ success: false, message: 'Server error updating cart item.' });
    }
};

// --- Remove Cart Item ---
export const removeCartItem = async (req, res) => {
    const { productId } = req.params; // Product ID from URL params (e.g., /api/cart/remove/:productId)
    const userId = req.userId; // User ID from auth middleware

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID provided.' });
    }

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user.' });
        }

        const initialItemCount = cart.items.length;
        // Filter out the item to be removed immutably
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        if (cart.items.length === initialItemCount) {
            // If no item was filtered out, it means the item wasn't in the cart
            return res.status(404).json({ message: 'Item not found in cart.' });
        }

        await cart.save();
        const populatedCart = await populateCartProducts(cart);
        res.status(200).json({ success: true, message: 'Item removed from cart', cart: populatedCart });
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ success: false, message: 'Server error removing item from cart.' });
    }
};

// --- Clear User Cart ---
export const clearUserCart = async (req, res) => {
    const userId = req.userId; // User ID from auth middleware

    try {
        // Find and delete the user's cart
        const result = await Cart.findOneAndDelete({ user: userId });

        if (!result) {
            // If no cart was found to delete, it means it was already empty or didn't exist
            return res.status(200).json({ success: true, message: 'Cart was already empty or not found.', cart: { items: [] } });
        }

        res.status(200).json({ success: true, message: 'Cart cleared successfully.', cart: { items: [] } });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, message: 'Server error clearing cart.' });
    }
};