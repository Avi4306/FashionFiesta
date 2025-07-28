// client/src/reducers/cart.js

import {
    ADD_TO_CART_LOCAL,
    ADD_TO_CART_SUCCESS,
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
    LOGOUT, // For cart cleanup on user logout
} from '../constants/actionTypes';

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const serializedCart = localStorage.getItem('cart');
        if (serializedCart === null) {
            return { items: [] }; // Always return an object with an 'items' array
        }
        const parsedCart = JSON.parse(serializedCart);
        return { items: parsedCart.items || [] };
    } catch (e) {
        console.error("Error loading cart from storage:", e);
        return { items: [] }; // Return empty cart on error
    }
};

const initialState = {
    // Initialize cart state by loading from localStorage
    cart: loadCartFromStorage(),
    loading: false, // Indicates if an API call is in progress
    error: null,    // Stores any error messages
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CART_LOADING:
            return { ...state, loading: action.payload, error: null };

        case SET_CART_ERROR:
            return { ...state, error: action.payload, loading: false };

        // For all success/local actions where the payload is the entire updated cart object { items: [...] }
        case ADD_TO_CART_SUCCESS:
        case FETCH_CART_SUCCESS:
        case MERGE_CART_SUCCESS:
        case UPDATE_CART_QUANTITY_SUCCESS:
        case REMOVE_CART_ITEM_SUCCESS:
        case ADD_TO_CART_LOCAL: // When action creator prepares the full updated cart for guest
            return {
                ...state,
                cart: action.payload, // action.payload is the entire { items: [...] } cart object
                error: null,         // Clear any previous error on success
                loading: false,      // Turn off loading on success
            };

        // For local updates where payload contains specific item data (e.g., productId, quantity)
        // These cases are for when actions don't return the full updated cart object
        case UPDATE_CART_QUANTITY_LOCAL:
            return {
                ...state,
                cart: {
                    ...state.cart,
                    items: state.cart.items.map((item) =>
                        item.product._id === action.payload.productId
                            ? { ...item, quantity: action.payload.quantity }
                            : item
                    ),
                },
                error: null,
            };
        case REMOVE_CART_ITEM_LOCAL:
            return {
                ...state,
                cart: {
                    ...state.cart,
                    items: state.cart.items.filter(
                        (item) => item.product._id !== action.payload // action.payload is just the productId
                    ),
                },
                error: null,
            };

        case CLEAR_CART:
            // Resets the cart to an empty state
            return {
                ...state,
                cart: { items: [] },
                error: null,
                loading: false,
            };

        // For API failures, error message is set by SET_CART_ERROR
        case FETCH_CART_FAIL:
            return { ...state, loading: false }; // Just ensure loading is false on fail

        case LOGOUT:
            // On user logout, reset the cart state to its initial (empty) state
            // and clear localStorage.
            localStorage.removeItem('cart');
            return initialState;

        default:
            return state;
    }
};

export default cartReducer;