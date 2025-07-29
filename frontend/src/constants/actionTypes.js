export const CREATE_POST = 'CREATE_POST';
export const DELETE_POST = 'DELETE_POST';
export const FETCH_POSTS = 'FETCH_POSTS';
export const FETCH_POST = 'FETCH_POST';
export const FETCH_BY_SEARCH = 'FETCH_BY_SEARCH';
export const LIKE_POST = 'LIKE_POST';
export const AUTH = 'AUTH';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGOUT = 'LOGOUT';
export const START_LOADING = 'START_LOADING';
export const END_LOADING = 'END_LOADING';
export const COMMENT_POST = 'COMMENT_POST';

export const FETCH_USER = 'FETCH_USER'
export const UPDATE_PROFILE = 'UPDATE_PROFILE'
export const CLEAR_ERROR = 'CLEAR_ERROR'

export const FETCH_USER_POSTS = 'FETCH_USER_POSTS';
export const FETCH_USER_PRODUCTS = 'FETCH_USER_PRODUCTS';
export const DELETE_PRODUCT = 'DELETE_PRODUCT'

export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';


export const FETCH_PRODUCT = 'FETCH_PRODUCT'
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS'
export const FETCH_ALL_PRODUCTS = 'FETCH_ALL_PRODUCTS'
export const CREATE_PRODUCT = 'CREATE_PRODUCT'
export const FETCH_CAROUSELS = 'FETCH_CAROUSELS'
export const FETCH_PRODUCT_BY_SEARCH = 'FETCH_PRODUCT_BY_SEARCH'
export const ADD_REVIEW = 'ADD_REVIEW'
export const FETCH_RECOMMENDATIONS = 'FETCH_RECOMMENDATIONS';

// Cart Action Types
export const SET_CART_LOADING = 'SET_CART_LOADING'; // To indicate API call is in progress
export const SET_CART_ERROR = 'SET_CART_ERROR';     // For generic cart errors

// For fetching cart
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
export const FETCH_CART_FAIL = 'FETCH_CART_FAIL';

// For adding to cart
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS'; // When API call succeeds (logged in)
export const ADD_TO_CART_LOCAL = 'ADD_TO_CART_LOCAL';     // When updated locally (guest)
export const ADD_TO_CART_FAIL = 'ADD_TO_CART_FAIL'

// For updating item quantity
export const UPDATE_CART_QUANTITY_SUCCESS = 'UPDATE_CART_QUANTITY_SUCCESS'; // When API call succeeds (logged in)
export const UPDATE_CART_QUANTITY_LOCAL = 'UPDATE_CART_QUANTITY_LOCAL';     // When updated locally (guest)

// For removing item
export const REMOVE_CART_ITEM_SUCCESS = 'REMOVE_CART_ITEM_SUCCESS'; // When API call succeeds (logged in)
export const REMOVE_CART_ITEM_LOCAL = 'REMOVE_CART_ITEM_LOCAL';     // When updated locally (guest)

export const MERGE_CART_SUCCESS = 'MERGE_CART_SUCCESS'; // After merging local cart to DB on login
export const CLEAR_CART = 'CLEAR_CART'; // For clearing cart (can be used for both local and DB clear)


export const FETCH_DESIGNERS = 'FETCH_DESIGNERS'



// NEW ADMIN ACTION TYPES
export const FETCH_ADMIN_USERS = 'FETCH_ADMIN_USERS';
export const CREATE_ADMIN_USER = 'CREATE_ADMIN_USER'; // For creating new users via admin panel
export const UPDATE_ADMIN_USER_ROLE = 'UPDATE_ADMIN_USER_ROLE';
export const UPDATE_ADMIN_USER_PASSWORD = 'UPDATE_ADMIN_USER_PASSWORD'; // For changing passwords via admin
export const DELETE_ADMIN_USER = 'DELETE_ADMIN_USER';

export const FETCH_ADMIN_PRODUCTS = 'FETCH_ADMIN_PRODUCTS';
export const CREATE_ADMIN_PRODUCT = 'CREATE_ADMIN_PRODUCT';
export const UPDATE_ADMIN_PRODUCT = 'UPDATE_ADMIN_PRODUCT';
export const DELETE_ADMIN_PRODUCT = 'DELETE_ADMIN_PRODUCT';

export const FETCH_ADMIN_POSTS = 'FETCH_ADMIN_POSTS';
export const CREATE_ADMIN_POST = 'CREATE_ADMIN_POST';
export const UPDATE_ADMIN_POST = 'UPDATE_ADMIN_POST';
export const DELETE_ADMIN_POST = 'DELETE_ADMIN_POST';

export const SET_ADMIN_ERROR = 'SET_ADMIN_ERROR';
export const CLEAR_ADMIN_ERROR = 'CLEAR_ADMIN_ERROR';
