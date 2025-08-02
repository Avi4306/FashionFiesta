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
  END_ADMIN_LOADING,
  // New action types for designer applications
  FETCH_DESIGNER_APPLICATIONS,
  APPROVE_DESIGNER_APPLICATION,
  REJECT_DESIGNER_APPLICATION,
} from '../constants/actionTypes';

const initialState = {
  users: [],
  products: [],
  posts: [],
  applications: [], // 🆕 Added for designer applications
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
  isLoading: false,
};

const admin = (state = initialState, action) => {
  switch (action.type) {
    // --- Global Loading and Error States ---
    case START_ADMIN_LOADING:
      return {
        ...state,
        isLoading: true,
        // Optionally clear data when loading starts for a fresh fetch
        // applications: [], // Uncomment if you want to clear applications on start loading
        // users: [],
        // products: [],
        // posts: [],
        error: null
      };
    case END_ADMIN_LOADING:
      return { ...state, isLoading: false };

    case SET_ADMIN_ERROR:
      return { ...state, error: action.payload, isLoading: false }; // Ensure loading is false on error
    case CLEAR_ADMIN_ERROR:
      return { ...state, error: null };

    // --- User Management Cases ---
    case FETCH_ADMIN_USERS:
      return {
        ...state,
        users: action.payload.users,
        usersPagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
        },
        error: null,
      };
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
      return {
        ...state,
        products: action.payload.products,
        productsPagination: {
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
        posts: action.payload.posts,
        postsPagination: {
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

    // --- Designer Application Management Cases ---
    case FETCH_DESIGNER_APPLICATIONS:
      return {
        ...state,
        applications: action.payload, // 🆕 Store the fetched applications
        error: null,
      };
    case APPROVE_DESIGNER_APPLICATION:
    case REJECT_DESIGNER_APPLICATION:
      return {
        ...state,
        // 🆕 Filter out the approved/rejected application from the list
        applications: state.applications.filter(
          (app) => app._id !== action.payload
        ),
        error: null,
      };

    default:
      return state;
  }
};

export default admin;
