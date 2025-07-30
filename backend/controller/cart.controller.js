// server/controllers/cart.controller.js
import Cart from '../models/cart.model.js';
import Product from '../models/products.models.js';
import mongoose from 'mongoose';

// Helper function to populate product details for consistent responses
const populateCartProducts = async (cart) => {
    if (!cart) return null;
    return await cart.populate('items.product');
};

// --- Add Product to Cart ---
export const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.userId; // Assuming auth middleware adds userId to req
    console.log('addToCart: userId =', userId); // 🆕 Debugging log

    // ... (rest of your addToCart function) ...
    // Input validation
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID provided.' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be a positive number.' });
    }

    try {
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
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
    console.log('getCart: userId =', userId); // 🆕 Debugging log

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [] } });
        }

        const populatedCart = await populateCartProducts(cart);
        res.status(200).json({ success: true, cart: populatedCart });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving cart.' });
    }
};

// --- Merge Local Cart with Permanent Cart (on login) ---
export const mergeCarts = async (req, res) => {
    const { items: localCartItems } = req.body;
    const userId = req.userId;
    console.log('mergeCarts: userId =', userId); // 🆕 Debugging log

    // ... (rest of your mergeCarts function) ...
    if (!Array.isArray(localCartItems)) {
        return res.status(400).json({ message: 'Invalid local cart items format.' });
    }

    try {
        let permanentCart = await Cart.findOne({ user: userId });

        if (!permanentCart) {
            permanentCart = new Cart({ user: userId, items: [] });
        }

        for (const localItem of localCartItems) {
            if (!localItem.product || !localItem.product._id || typeof localItem.quantity !== 'number' || localItem.quantity < 1) {
                console.warn('Skipping invalid local cart item during merge:', localItem);
                continue;
            }

            const productExists = await Product.findById(localItem.product._id);
            if (!productExists) {
                console.warn(`Product with ID ${localItem.product._id} not found, skipping during merge.`);
                continue;
            }

            const existingItem = permanentCart.items.find(
                item => item.product.toString() === localItem.product._id
            );

            if (existingItem) {
                existingItem.quantity += localItem.quantity;
            } else {
                permanentCart.items.push({
                    product: localItem.product._id,
                    quantity: localItem.quantity,
                });
            }
        }

        await permanentCart.save();
        const updatedCart = await populateCartProducts(permanentCart);
        res.status(200).json({ success: true, message: 'Cart merged successfully', cart: updatedCart });
    } catch (error) {
        console.error('Error merging carts:', error);
        res.status(500).json({ success: false, message: 'Server error merging carts.' });
    }
};

// --- Update Cart Item Quantity ---
export const updateCartItem = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;
    console.log('updateCartItem: userId =', userId); // 🆕 Debugging log

    // ... (rest of your updateCartItem function) ...
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
  const { productId } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: user not logged in.' });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid Product ID provided.' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.status(200).json({
        success: true,
        message: 'Item removed. Cart is now empty and deleted.',
        cart: null,
      });
    }

    await cart.save();
    const populatedCart = await populateCartProducts(cart);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: populatedCart,
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error removing item from cart.',
    });
  }
};

// --- Clear User Cart ---
export const clearUserCart = async (req, res) => {
    const userId = req.userId;
    console.log('clearUserCart: userId =', userId); // 🆕 Debugging log

    // ... (rest of your clearUserCart function) ...
    try {
        const result = await Cart.findOneAndDelete({ user: userId });

        if (!result) {
            return res.status(200).json({ success: true, message: 'Cart was already empty or not found.', cart: { items: [] } });
        }

        res.status(200).json({ success: true, message: 'Cart cleared successfully.', cart: { items: [] } });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, message: 'Server error clearing cart.' });
    }
};