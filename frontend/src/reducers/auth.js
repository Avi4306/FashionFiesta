import {
  AUTH,
  AUTH_ERROR,
  UPDATE_PROFILE,
  LOGOUT,
  CLEAR_ERROR,
  START_LOADING, // 🆕 Imported
  END_LOADING // 🆕 Imported
} from '../constants/actionTypes';

const auth = (state = { authData: null, error: null, isLoading: false }, action) => { // 🆕 Added isLoading to initial state
  switch (action.type) {
    case AUTH:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data, error: null, isLoading: false }; // 🆕 Clear error and set isLoading to false on success
    case AUTH_ERROR:
      return { ...state, error: action.payload, isLoading: false }; // 🆕 Set error and set isLoading to false
    case UPDATE_PROFILE:
      // Assuming action.data here is the updated user object with token
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data, error: null, isLoading: false }; // 🆕 Clear error and set isLoading to false
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null, error: null, isLoading: false }; // 🆕 Clear error and set isLoading to false
    case CLEAR_ERROR:
      return { ...state, error: null };
    // 🆕 New cases for loading states
    case START_LOADING:
      return { ...state, isLoading: true, error: null }; // 🆕 Set isLoading to true and clear error
    case END_LOADING:
      return { ...state, isLoading: false }; // 🆕 Set isLoading to false
    default:
      return state;
  }
}
export default auth;