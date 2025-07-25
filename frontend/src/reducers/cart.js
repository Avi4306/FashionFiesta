import {
    ADD_TO_CART_LOCAL,
    ADD_TO_CART_SUCCESS,
    FETCH_CART_SUCCESS,
    MERGE_CART_SUCCESS,
    ADD_TO_CART_FAIL,
    FETCH_CART_FAIL,
} from '../constants/actionTypes';

const initialState = {
    cart: { items: [] }, // Default to an empty cart object
    error: null,
};

const cart = (state = initialState, action) => {
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
        case ADD_TO_CART_FAIL:
        case FETCH_CART_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default cart;