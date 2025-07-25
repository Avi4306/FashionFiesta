import * as api from '../api/index';
import { ADD_TO_CART_LOCAL, ADD_TO_CART_SUCCESS, ADD_TO_CART_FAIL, FETCH_CART_SUCCESS, FETCH_CART_FAIL, MERGE_CART_SUCCESS } from '../constants/actionTypes';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return { items: [] };
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.error("Error loading cart from storage", e);
    return { items: [] };
  }
};

export const getCart = (userId) => async (dispatch) => {
  if (userId) {
    // User is logged in, fetch from backend
    try {
      const { data } = await api.fetchCart();
      dispatch({ type: FETCH_CART_SUCCESS, payload: data.cart });
    } catch (error) {
      dispatch({ type: FETCH_CART_FAIL, payload: error.response?.data?.message });
    }
  } else {
    // User is a guest, load from localStorage
    const localCart = loadCartFromStorage();
    dispatch({ type: FETCH_CART_SUCCESS, payload: localCart });
  }
};

export const addToCart = (product) => async (dispatch, getState) => {
  const { auth, cart } = getState();

  // The 'quantity' is passed here, but we'll use a default of 1 for simplicity
  const quantity = 1;

  if (auth.user) {
    // User is logged in, call backend API
    try {
      // The backend API handles the update logic
      const { data } = await api.addToCart(product._id, quantity);
      dispatch({ type: ADD_TO_CART_SUCCESS, payload: data.cart });
    } catch (error) {
      dispatch({ type: ADD_TO_CART_FAIL, payload: error.response?.data?.message });
    }
  } else {
    // User is a guest, update local state and storage immutably
    const existingCart = cart.cart;

    // Find if the product already exists in the cart
    const itemIndex = existingCart.items.findIndex(
      (item) => item.product._id === product._id
    );
    
    let newItems;

    if (itemIndex > -1) {
      // If the item exists, create a NEW array with the updated item
      newItems = existingCart.items.map((item, index) => {
        if (index === itemIndex) {
          // Return a NEW item object with the incremented quantity
          return { ...item, quantity: item.quantity + quantity };
        }
        return item; // Return all other items as they are
      });
    } else {
      // If the item is new, create a NEW array with all old items + the new item
      newItems = [...existingCart.items, { product, quantity }];
    }
    
    // Create a NEW cart object with the new items array
    const updatedCart = {
      ...existingCart,
      items: newItems,
    };

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch({ type: ADD_TO_CART_LOCAL, payload: updatedCart });
  }
};

// This action is dispatched on login if a local cart exists
export const mergeLocalCart = (localCartItems) => async (dispatch) => {
  try {
    const { data } = await api.mergeCarts(localCartItems);
    localStorage.removeItem('cart'); // Clear local cart after successful merge
    dispatch({ type: MERGE_CART_SUCCESS, payload: data.cart });
    console.log('merge')
  } catch (error) {
    dispatch({ type: ADD_TO_CART_FAIL, payload: error.response?.data?.message });
  }
};