import {
  FETCH_SUGGESTIONS_REQUEST,
  FETCH_SUGGESTIONS_SUCCESS,
  FETCH_SUGGESTIONS_FAILURE,
  CLEAR_SUGGESTIONS,
} from '../constants/actionTypes'; // Import action types

// Initial state for the search suggestions
const initialState = {
  suggestions: [],
  loading: false,
  error: null,
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUGGESTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // Clear any previous errors
      };
    case FETCH_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        suggestions: action.payload, // Update with fetched suggestions
        error: null,
      };
    case FETCH_SUGGESTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        suggestions: [], // Clear suggestions on error
        error: action.payload, // Store the error message
      };
    case CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: [], // Clear the suggestions array
        error: null, // Clear errors as well
      };
    default:
      return state;
  }
};

export default search;