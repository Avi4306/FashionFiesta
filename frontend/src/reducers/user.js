import {
  FETCH_USER,
  FETCH_USER_POSTS,
  FETCH_USER_PRODUCTS,
  DELETE_ACCOUNT,
  START_LOADING,
  END_LOADING,
  FETCH_DESIGNERS,
  UPDATE_PROFILE,
  SET_ERROR, // Imported
  CLEAR_ERROR // Imported
} from "../constants/actionTypes";

const user = (state = { isLoading: true, user: null, posts: [], products: [], designers: [], error: null }, action) => { // 🆕 Added error to initial state
  switch (action.type) {
    case FETCH_USER:
      return { ...state, user: action.payload, error: null }; // Clear error on successful fetch
    case FETCH_USER_POSTS:
      return { ...state, posts: action.payload, error: null }; // Clear error on successful fetch
    case FETCH_USER_PRODUCTS:
      return { ...state, products: action.payload, error: null }; // Clear error on successful fetch
    case DELETE_ACCOUNT:
      // When an account is deleted, clear user-specific data
      return { ...state, user: null, posts: [], products: [], error: null }; // Clear error
    case START_LOADING:
      return { ...state, isLoading: true, error: null }; // Clear error when loading starts
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_DESIGNERS:
      return {
        ...state,
        designers: action.payload,
        error: null, // Clear error on successful fetch
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
        error: null, // Clear error on successful update
      };
    // 🆕 Handle SET_ERROR and CLEAR_ERROR
    case SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }; // Set error and stop loading
    case CLEAR_ERROR:
      return { ...state, error: null }; // Clear error
    default:
      return state;
  }
}

export default user;