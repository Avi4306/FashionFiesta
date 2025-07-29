// client/src/reducers/admin.js
import {
  FETCH_ADMIN_USERS,
  CREATE_ADMIN_USER,
  UPDATE_ADMIN_USER_ROLE,
  UPDATE_ADMIN_USER_PASSWORD,
  DELETE_ADMIN_USER,
  FETCH_ADMIN_PRODUCTS,
  CREATE_ADMIN_PRODUCT,
  UPDATE_ADMIN_PRODUCT,
  DELETE_ADMIN_PRODUCT,
  FETCH_ADMIN_POSTS,
  CREATE_ADMIN_POST,
  UPDATE_ADMIN_POST,
  DELETE_ADMIN_POST,
  SET_ADMIN_ERROR,
  CLEAR_ADMIN_ERROR,
  START_ADMIN_LOADING,
  END_ADMIN_LOADING
  // You might want to add START_LOADING, END_LOADING here if you want a global admin loading state
} from '../constants/actionTypes';

const initialState = {
  users: [],
  products: [],
  posts: [],
  // Pagination specific states for each resource
  usersPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  productsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  postsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  error: null,
  isLoading: false, // Optional: Add loading state for UI feedback
};

const admin = (state = initialState, action) => {
  switch (action.type) {
    // --- User Management Cases ---
    case FETCH_ADMIN_USERS:
      return {
        ...state,
        users: action.payload.users, // Store only the users array
        usersPagination: {          // Store pagination info
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
        },
        error: null,
      };
    case CREATE_ADMIN_USER:
      // When a new user is created, it's typically added to the start/end of the current view
      // You might also want to re-fetch the first page to ensure correct pagination counts
      // For simplicity, here we just add it to the existing array.
      // If you are relying heavily on `totalItems`, consider re-fetching for accuracy.
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
      // When a user is deleted, you might want to re-fetch the current page
      // to ensure the list remains full if possible, and update pagination info.
      // For simplicity, here we just filter it out.
      // If you are relying heavily on `totalItems`, consider re-fetching for accuracy.
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
        error: null,
      };

    // --- Product Management Cases ---
    case FETCH_ADMIN_PRODUCTS:
      return {
        ...state,
        products: action.payload.products, // Store only the products array
        productsPagination: {             // Store pagination info
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
        },
        error: null,
      };
    case CREATE_ADMIN_PRODUCT:
      return { ...state, products: [...state.products, action.payload], error: null };
    case UPDATE_ADMIN_PRODUCT:
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
      return {
        ...state,
        posts: action.payload.posts, // Store only the posts array
        postsPagination: {          // Store pagination info
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
        },
        error: null,
      };
    case CREATE_ADMIN_POST:
      return { ...state, posts: [...state.posts, action.payload], error: null };
    case UPDATE_ADMIN_POST:
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
    case START_ADMIN_LOADING:
      return { 
        ...state, 
        isLoading: true,
        users: [],
        products: [],
        posts: [],
        error: null 
      };
    case END_ADMIN_LOADING:
      return { ...state, isLoading: false };
      
    case SET_ADMIN_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ADMIN_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default admin;