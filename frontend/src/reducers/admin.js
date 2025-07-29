// client/src/reducers/admin.js
import {
  FETCH_ADMIN_USERS,
  CREATE_ADMIN_USER,
  UPDATE_ADMIN_USER_ROLE,
  UPDATE_ADMIN_USER_PASSWORD,
  DELETE_ADMIN_USER,
  FETCH_ADMIN_PRODUCTS,
  CREATE_ADMIN_PRODUCT, // Added this import
  UPDATE_ADMIN_PRODUCT, // Added this import
  DELETE_ADMIN_PRODUCT,
  FETCH_ADMIN_POSTS,
  CREATE_ADMIN_POST, // Added this import
  UPDATE_ADMIN_POST, // Added this import
  DELETE_ADMIN_POST,
  SET_ADMIN_ERROR,
  CLEAR_ADMIN_ERROR,
  // You might want to add START_LOADING, END_LOADING here if you want a global admin loading state
} from '../constants/actionTypes';

const initialState = {
  users: [],
  products: [],
  posts: [],
  error: null,
  loading: false, // Optional: Add loading state for UI feedback
};

const admin = (state = initialState, action) => {
  switch (action.type) {
    // --- User Management Cases ---
    case FETCH_ADMIN_USERS:
      return { ...state, users: action.payload, error: null };
    case CREATE_ADMIN_USER:
      return { ...state, users: [...state.users, action.payload], error: null };
    case UPDATE_ADMIN_USER_ROLE:
    case UPDATE_ADMIN_USER_PASSWORD:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
        error: null,
      };
    case DELETE_ADMIN_USER:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
        error: null,
      };

    // --- Product Management Cases ---
    case FETCH_ADMIN_PRODUCTS:
      return { ...state, products: action.payload, error: null };
    case CREATE_ADMIN_PRODUCT: // Handle creation of a new product
      return { ...state, products: [...state.products, action.payload], error: null };
    case UPDATE_ADMIN_PRODUCT: // Handle updating an existing product
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
        error: null,
      };
    case DELETE_ADMIN_PRODUCT:
      return {
        ...state,
        products: state.products.filter((product) => product._id !== action.payload),
        error: null,
      };

    // --- Post Management Cases ---
    case FETCH_ADMIN_POSTS:
      return { ...state, posts: action.payload, error: null };
    case CREATE_ADMIN_POST: // Handle creation of a new post
      return { ...state, posts: [...state.posts, action.payload], error: null };
    case UPDATE_ADMIN_POST: // Handle updating an existing post
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
        error: null,
      };
    case DELETE_ADMIN_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
        error: null,
      };

    // --- Error Handling Cases ---
    case SET_ADMIN_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ADMIN_ERROR:
      return { ...state, error: null };

    // --- Optional Loading States ---
    // Uncomment and use these if you want to manage loading within this reducer
    /*
    case 'START_ADMIN_LOADING': // You'll need to define this action type
      return { ...state, loading: true };
    case 'END_ADMIN_LOADING': // You'll need to define this action type
      return { ...state, loading: false };
    */

    default:
      return state;
  }
};

export default admin;