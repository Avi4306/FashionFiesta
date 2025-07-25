import {
    ADD_TO_CART_LOCAL,
    ADD_TO_CART_SUCCESS,
    FETCH_CART_SUCCESS,
    MERGE_CART_SUCCESS,
    ADD_TO_CART_FAIL,
    FETCH_CART_FAIL,
    UPDATE_CART_ITEM_QUANTITY, // Added
    REMOVE_CART_ITEM,         // Added
    LOGOUT                    // Added for cleanup
} from '../constants/actionTypes';

const initialState = {
    cart: { items: [] },
    error: null,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART_LOCAL:
            return {
                ...state,
                cart: action.payload,
            };
        case ADD_TO_CART_SUCCESS:
        case FETCH_CART_SUCCESS:
        case MERGE_CART_SUCCESS:
            return {
                ...state,
                cart: action.payload,
                error: null,
            };
        case UPDATE_CART_ITEM_QUANTITY:
            // Find the item and update its quantity immutably
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
            };
        case REMOVE_CART_ITEM:
            // Filter out the item to be removed immutably
            return {
                ...state,
                cart: {
                    ...state.cart,
                    items: state.cart.items.filter(
                        (item) => item.product._id !== action.payload
                    ),
                },
            };
        case ADD_TO_CART_FAIL:
        case FETCH_CART_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        case LOGOUT:
            // Clean up the cart state on user logout
            return initialState;
        default:
            return state;
    }
};

export default cartReducer;