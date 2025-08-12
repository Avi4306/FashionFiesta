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
  // New action types for donation management
  FETCH_ADMIN_DONATIONS,
  UPDATE_ADMIN_DONATION_STATUS,
  DELETE_ADMIN_DONATION,
  FETCH_ADMIN_OUTFITS,
  DELETE_ADMIN_OUTFIT,
  CREATE_ADMIN_OUTFIT,
} from '../constants/actionTypes';

const initialState = {
  users: [],
  products: [],
  posts: [],
  applications: [], // Added for designer applications
  donations: [], // 🆕 Added for donations
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
  // 🆕 Pagination state for donations
  donationsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  error: null,
  isLoading: false,

  outfits: [],

outfitsPagination: {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
},
};

const admin = (state = initialState, action) => {
  switch (action.type) {
    // --- Global Loading and Error States ---
    case START_ADMIN_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case END_ADMIN_LOADING:
      return { ...state, isLoading: false };

    case SET_ADMIN_ERROR:
      return { ...state, error: action.payload, isLoading: false };
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
        applications: action.payload,
        error: null,
      };
    case APPROVE_DESIGNER_APPLICATION:
    case REJECT_DESIGNER_APPLICATION:
      return {
        ...state,
        applications: state.applications.filter(
          (app) => app._id !== action.payload
        ),
        error: null,
      };
    
    // --- Donation Management Cases ---
    case FETCH_ADMIN_DONATIONS:
      return {
        ...state,
        donations: action.payload.donations,
        donationsPagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
        },
        error: null,
      };
    case UPDATE_ADMIN_DONATION_STATUS:
      return {
        ...state,
        donations: state.donations.map((donation) =>
          donation._id === action.payload._id ? action.payload : donation
        ),
        error: null,
      };
    case DELETE_ADMIN_DONATION:
      return {
        ...state,
        donations: state.donations.filter((donation) => donation._id !== action.payload),
        error: null,
      };
      case FETCH_ADMIN_OUTFITS:
        return {
          ...state,
          outfits: action.payload.outfits,
          outfitsPagination: {
            currentPage: action.payload.currentPage,
            totalPages: action.payload.totalPages,
            totalItems: action.payload.totalItems,
          },
          error: null,
        };
      case CREATE_ADMIN_OUTFIT:
        return {
          ...state,
          outfits: [action.payload, ...state.outfits],
          error: null,
        };

      case DELETE_ADMIN_OUTFIT:
        return {
          ...state,
          outfits: state.outfits.filter((outfit) => outfit._id !== action.payload),
          error: null,
        };
    default:
      return state;
  }
};

export default admin;