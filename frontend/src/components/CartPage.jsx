// src/pages/CartPage.jsx

import React, { useEffect } from 'react'; // Keep useEffect if needed for other component-specific logic
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateCartItemQuantity,
  removeCartItem,
  // Removed getCart and mergeLocalCart imports from here as they are no longer dispatched by this component
} from '../actions/cart';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading, error } = useSelector((state) => state.cart);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Loading Cart...</h2>
        {/* You can add a spinner here */}
        <p>Please wait while we fetch your cart items.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-red-600">
        <h2 className="text-2xl font-semibold mb-4">Error Loading Cart</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()} // Simple way to retry
          className="mt-6 px-6 py-3 rounded-full bg-red-600 text-white font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- Empty Cart State ---
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Browse our products to find something you'll love!</p>
        <button
          onClick={() => navigate('/products/trending')}
          className="mt-6 px-6 py-3 rounded-full bg-black text-white font-semibold"
        >
          Shop Now
        </button>
      </div>
    );
  }

  // --- Cart Display Logic ---
  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateCartItemQuantity(productId, newQuantity));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeCartItem(productId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center space-x-4">
                {/* Ensure product.image exists or provide a fallback */}
                <img src={item.product.images?.[0] || 'https://via.placeholder.com/80'} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600">₹{item.product.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    className="px-3 py-1"
                    disabled={item.quantity <= 1} // Disable decrement if quantity is 1
                  >-</button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)} className="px-3 py-1">+</button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <DeleteOutlineOutlinedIcon fontSize='large' />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-1 p-6 border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between text-lg font-medium mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-medium mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-xl font-bold">
            <span>Order Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-6 px-6 py-3 rounded-full bg-[#DCC5B2] text-white font-semibold hover:bg-opacity-90"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}