import * as api from '../api/index'; // Assuming this is your API file
import { 
    ADD_TO_CART_LOCAL, 
    ADD_TO_CART_SUCCESS, 
    ADD_TO_CART_FAIL, 
    FETCH_CART_SUCCESS, 
    FETCH_CART_FAIL, 
    MERGE_CART_SUCCESS, 
    UPDATE_CART_ITEM_QUANTITY, 
    REMOVE_CART_ITEM 
} from '../constants/actionTypes';

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
    const quantity = 1; // Default quantity for addToCart

    if (auth.user) {
        // User is logged in, call backend API
        try {
            const { data } = await api.addToCart(product._id, quantity);
            dispatch({ type: ADD_TO_CART_SUCCESS, payload: data.cart });
        } catch (error) {
            dispatch({ type: ADD_TO_CART_FAIL, payload: error.response?.data?.message });
        }
    } else {
        // User is a guest, update local state and storage immutably
        const existingCart = cart.cart;
        const itemIndex = existingCart.items.findIndex(
            (item) => item.product._id === product._id
        );
        
        let newItems;
        if (itemIndex > -1) {
            newItems = existingCart.items.map((item, index) => {
                if (index === itemIndex) {
                    return { ...item, quantity: item.quantity + quantity };
                }
                return item;
            });
        } else {
            newItems = [...existingCart.items, { product, quantity }];
        }
        
        const updatedCart = {
            ...existingCart,
            items: newItems,
        };

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        dispatch({ type: ADD_TO_CART_LOCAL, payload: updatedCart });
    }
};

export const mergeLocalCart = (localCartItems) => async (dispatch) => {
    try {
        const { data } = await api.mergeCarts(localCartItems);
        localStorage.removeItem('cart');
        dispatch({ type: MERGE_CART_SUCCESS, payload: data.cart });
        console.log('merge');
    } catch (error) {
        dispatch({ type: ADD_TO_CART_FAIL, payload: error.response?.data?.message });
    }
};

// --- NEW/UPDATED ACTIONS ---

export const updateCartItemQuantity = (productId, quantity) => async (dispatch, getState) => {
    const { auth, cart } = getState();

    if (auth.user) {
        // User is logged in, call backend API to update quantity
        try {
            const { data } = await api.updateCartItem(productId, quantity);
            // Assuming backend returns the updated cart or success message
            // You might want a specific success type for this, or re-fetch the cart
            dispatch({
                type: UPDATE_CART_ITEM_QUANTITY, // Still dispatch local update for immediate UI feedback
                payload: { productId, quantity },
            });
            // Optionally, dispatch FETCH_CART_SUCCESS with data.cart if backend returns full cart
        } catch (error) {
            console.error("Error updating cart item quantity:", error);
            dispatch({ type: ADD_TO_CART_FAIL, payload: error.response?.data?.message }); // Use a generic cart error type
        }
    } else {
        // Guest user, update local state and localStorage
        const existingCart = cart.cart;
        const newItems = existingCart.items.map(item => 
            item.product._id === productId ? { ...item, quantity: quantity } : item
        );
        const updatedCart = { ...existingCart, items: newItems };
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        dispatch({
            type: UPDATE_CART_ITEM_QUANTITY,
            payload: { productId, quantity },
        });
    }
};

export const removeCartItem = (productId) => async (dispatch, getState) => {
    const { auth, cart } = getState();

    if (auth.user) {
        // User is logged in, call backend API to remove item
        try {
            await api.removeCartItem(productId);
            // Assuming backend confirms deletion, then update local state
            dispatch({
                type: REMOVE_CART_ITEM, // Still dispatch local update for immediate UI feedback
                payload: productId,
            });
            // Optionally, dispatch FETCH_CART_SUCCESS if backend returns updated cart
        } catch (error) {
            console.error("Error removing cart item:", error);
            dispatch({ type: ADD_TO_CART_FAIL, payload: error.response?.data?.message }); // Use a generic cart error type
        }
    } else {
        // Guest user, update local state and localStorage
        const existingCart = cart.cart;
        const newItems = existingCart.items.filter(item => item.product._id !== productId);
        const updatedCart = { ...existingCart, items: newItems };
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        dispatch({
            type: REMOVE_CART_ITEM,
            payload: productId,
        });
    }
};