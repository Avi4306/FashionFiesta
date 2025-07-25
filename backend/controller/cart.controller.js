import Cart from '../models/cart.model.js';
import mongoose from 'mongoose';

// Helper function to populate product details for consistent responses
//The populateCartProducts helper function uses Mongoose's populate() method to automatically replace the productId with the full product document, resulting in a much more useful response:
const populateCartProducts = async (cart) => {
  if (!cart) return null;
  return cart.populate('items.product');
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.userId; // Assuming auth middleware adds userId to req

  try {
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
        let item = cart.items[itemIndex];
        item.quantity += quantity;
      } else {
        // If the item is new, add it to the cart
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    const populatedCart = await populateCartProducts(cart); // Populate for response
    res.status(200).json({ success: true, message: 'Item added to cart', cart: populatedCart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCart = async (req, res) => {
  const userId = req.userId;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Return an empty cart structure if not found, instead of 404
      return res.status(200).json({ success: true, cart: { items: [] } });
    }
    
    const populatedCart = await populateCartProducts(cart); // Populate for response
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const mergeCarts = async (req, res) => {
  const { items: localCartItems } = req.body;
  const userId = req.userId;

  try {
    let permanentCart = await Cart.findOne({ user: userId });

    if (!permanentCart) {
      permanentCart = new Cart({ user: userId, items: [] });
    }

    for (const localItem of localCartItems) {
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
    const updatedCart = await populateCartProducts(permanentCart); // Populate for response
    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error('Error merging carts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// NEW: Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
  const { id: productId } = req.params; // Product ID from URL params
  const { quantity } = req.body; // New quantity from request body
  const userId = req.userId; // User ID from auth middleware

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid Product ID' });
  }
  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await populateCartProducts(cart); // Populate for response
      res.status(200).json({ success: true, message: 'Cart updated', cart: populatedCart });
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// NEW: Remove Cart Item
export const removeCartItem = async (req, res) => {
  const { id: productId } = req.params; // Product ID from URL params
  const userId = req.userId; // User ID from auth middleware

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid Product ID' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialItemCount) {
      // If no item was filtered out, it means the item wasn't in the cart
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();
    const populatedCart = await populateCartProducts(cart); // Populate for response
    res.status(200).json({ success: true, message: 'Item removed from cart', cart: populatedCart });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};