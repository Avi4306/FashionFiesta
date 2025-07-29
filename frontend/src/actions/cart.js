// client/src/actions/cart.js
import * as api from '../api/index'; // Assuming this is your API file
import {
    ADD_TO_CART_LOCAL,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAIL,
    FETCH_CART_SUCCESS,
    FETCH_CART_FAIL,
    MERGE_CART_SUCCESS,
    UPDATE_CART_QUANTITY_SUCCESS,
    UPDATE_CART_QUANTITY_LOCAL,
    REMOVE_CART_ITEM_SUCCESS,
    REMOVE_CART_ITEM_LOCAL,
    SET_CART_LOADING,
    SET_CART_ERROR,
    CLEAR_CART,
} from '../constants/actionTypes';

// Helper to load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const serializedCart = localStorage.getItem('cart');
        if (serializedCart === null) {
            return { items: [] };
        }
        const parsedCart = JSON.parse(serializedCart);
        return { items: parsedCart.items || [] };
    } catch (e) {
        console.error("Error loading cart from storage", e);
        return { items: [] };
    }
};

// Helper to save cart to localStorage
const saveCartToStorage = (cartData) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cartData));
    } catch (e) {
        console.error("Error saving cart to storage", e);
    }
};

// Helper for error dispatching
const handleActionError = (dispatch, error, defaultMessage) => {
    console.error("Cart action error:", error.response?.data?.message || error.message);
    dispatch({ type: SET_CART_ERROR, payload: error.response?.data?.message || defaultMessage });
};

// --- GET CART ACTION ---
// This action will fetch the cart from DB for logged-in users or from localStorage for guests
export const getCart = (userId) => async (dispatch) => {
    dispatch({ type: SET_CART_LOADING, payload: true });
    if (userId) { // User is logged in
        try {
            const { data } = await api.fetchCart();
            dispatch({ type: FETCH_CART_SUCCESS, payload: data.cart });
            saveCartToStorage(data.cart); // Keep localStorage in sync with DB cart
        } catch (error) {
            handleActionError(dispatch, error, 'Failed to fetch cart from server.');
            dispatch({ type: FETCH_CART_FAIL }); // Specific fail type for fetching
            // Fallback to local storage if DB fetch fails for a logged-in user
            const localCart = loadCartFromStorage();
            dispatch({ type: FETCH_CART_SUCCESS, payload: localCart }); // Load local cart even if server fails
        } finally {
            dispatch({ type: SET_CART_LOADING, payload: false });
        }
    } else { // User is a guest
        const localCart = loadCartFromStorage();
        dispatch({ type: FETCH_CART_SUCCESS, payload: localCart }); // Use FETCH_CART_SUCCESS for local load too
        dispatch({ type: SET_CART_LOADING, payload: false }); // Ensure loading state is turned off
    }
};

// --- ADD TO CART ACTION ---
export const addToCart = (product, quantity = 1) => async (dispatch, getState) => {
    const { auth, cart } = getState();

    // Check for product._id presence early
    if (!product || !product._id) {
        console.error("Product or product._id is missing for addToCart action.");
        handleActionError(dispatch, {}, "Invalid product data provided.");
        return;
    }

    const isLoggedIn = !!auth.authData?.token; // Assuming authData contains user info and a token

    if (isLoggedIn) {
        try {
            const { data } = await api.addToCart(product._id, quantity);
            dispatch({ type: ADD_TO_CART_SUCCESS, payload: data.cart }); // Backend should return the updated cart
            saveCartToStorage(data.cart); // Keep localStorage in sync with DB cart
        } catch (error) {
            handleActionError(dispatch, error, 'Failed to add item to cart on server.');
            dispatch({ type: ADD_TO_CART_FAIL, payload: error.response?.data?.message });
        }
    } else {
        // User is a guest, update local state and storage immutably
        const existingCartItems = cart.cart?.items || [];
        const itemIndex = existingCartItems.findIndex(
            (item) => item.product._id === product._id
        );

        let newItems;
        if (itemIndex > -1) {
            newItems = existingCartItems.map((item, index) => {
                if (index === itemIndex) {
                    return { ...item, quantity: item.quantity + quantity };
                }
                return item;
            });
        } else {
            newItems = [...existingCartItems, { product: product, quantity: quantity }];
        }

        const updatedCart = { items: newItems };
        saveCartToStorage(updatedCart);
        dispatch({ type: ADD_TO_CART_LOCAL, payload: updatedCart });
    }
};

// --- MERGE LOCAL CART (on successful login) ---
export const mergeLocalCart = (localCartItems) => async (dispatch) => {
    dispatch({ type: SET_CART_LOADING, payload: true });
    try {
        const { data } = await api.mergeCarts(localCartItems);
        localStorage.removeItem('cart'); // Clear local storage after successful merge
        dispatch({ type: MERGE_CART_SUCCESS, payload: data.cart });
        saveCartToStorage(data.cart); // Save the merged DB cart to local storage for persistence
        console.log('Cart merged successfully with backend.');
    } catch (error) {
        handleActionError(dispatch, error, 'Failed to merge cart with server.');
        dispatch({ type: FETCH_CART_FAIL });
    } finally {
        dispatch({ type: SET_CART_LOADING, payload: false });
    }
};

// --- UPDATE CART ITEM QUANTITY ACTION ---
export const updateCartItemQuantity = (productId, newQuantity) => async (dispatch, getState) => {
    const { auth, cart } = getState();

    // Basic validation
    if (newQuantity < 1) {
        // If quantity is less than 1, remove the item instead
        dispatch(removeCartItem(productId));
        return;
    }

    const isLoggedIn = !!auth.authData?.token;

    if (isLoggedIn) {
        try {
            const { data } = await api.updateCartItem(productId, newQuantity);
            dispatch({ type: UPDATE_CART_QUANTITY_SUCCESS, payload: data.cart }); // Backend returns updated cart
            saveCartToStorage(data.cart);
        } catch (error) {
            handleActionError(dispatch, error, 'Failed to update item quantity on server.');
            dispatch({ type: FETCH_CART_FAIL });
        }
    } else {
        // Local update for guest user
        // Calculate the new cart based on current Redux state and save to local storage
        const currentCart = getState().cart.cart; // Get current cart from Redux store
        const updatedItems = currentCart.items.map(item =>
            item.product._id === productId ? { ...item, quantity : newQuantity } : item
        );
        const newItems = { ...currentCart, items: updatedItems };
        const updatedCart = { items: newItems };
        saveCartToStorage(updatedCart);
        // Dispatch the local action which your reducer handles and saves to localStorage
        dispatch({ type: UPDATE_CART_QUANTITY_LOCAL, payload: { productId, quantity: newQuantity } }); // Reducer expects {productId, quantity}
    }
};

// --- REMOVE CART ITEM ACTION ---
export const removeCartItem = (productId) => async (dispatch, getState) => {
    const { auth, cart } = getState();

    const isLoggedIn = !!auth.authData?.token;

    if (isLoggedIn) {
        try {
            await api.removeCartItem(productId);
            // After successful removal from DB, re-fetch to ensure sync
            const { data } = await api.fetchCart();
            dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: data.cart });
            saveCartToStorage(data.cart);
        } catch (error) {
            handleActionError(dispatch, error, 'Failed to remove item from cart on server.');
            dispatch({ type: FETCH_CART_FAIL });
        }
    } else {
        // Guest user, update local state and localStorage
        const existingCartItems = cart.cart?.items || [];
        const newItems = existingCartItems.filter(item => item.product._id !== productId);
        const updatedCart = { items: newItems };
        saveCartToStorage(updatedCart);
        dispatch({ type: REMOVE_CART_ITEM_LOCAL, payload: updatedCart });
    }
};

// --- CLEAR CART ACTION ---
export const clearCart = () => async (dispatch, getState) => {
    const { auth } = getState();
    const isLoggedIn = !!auth.authData?.token;

    if (isLoggedIn) {
        try {
            await api.clearUserCart();
            dispatch({ type: CLEAR_CART });
            saveCartToStorage({ items: [] }); // Clear local storage explicitly
        } catch (error) {
            handleActionError(dispatch, error, 'Failed to clear cart on server.');
        }
    } else {
        // Guest user
        dispatch({ type: CLEAR_CART });
        saveCartToStorage({ items: [] }); // Clear local storage explicitly
    }
};