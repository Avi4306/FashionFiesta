import Cart from '../models/cart.model.js';

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.userId; // Assuming you have a middleware that adds userId to the request

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
    res.status(200).json({ success: true, message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCart = async (req, res) => {
  const userId = req.userId;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, cart });
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

    localCartItems.forEach(localItem => {
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
    });

    await permanentCart.save();
    const updatedCart = await permanentCart.populate('items.product');

    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error('Error merging carts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};