
import { fetchSearchSuggestions } from '../api/index'; // Import your API service
import { CLEAR_SUGGESTIONS, FETCH_SUGGESTIONS_REQUEST, FETCH_SUGGESTIONS_FAILURE, FETCH_SUGGESTIONS_SUCCESS } from '../constants/actionTypes';

// Action Creator for fetching suggestions
export const getSuggestions = (query) => async (dispatch) => {
  // If the query is empty, clear suggestions and don't make an API call
  if (!query.trim()) {
    dispatch({ type: CLEAR_SUGGESTIONS });
    return;
  }

  dispatch({ type: FETCH_SUGGESTIONS_REQUEST }); // Indicate that we are starting to fetch

  try {
    const { data } = await fetchSearchSuggestions(query); // Call your API function
    dispatch({
      type: FETCH_SUGGESTIONS_SUCCESS,
      payload: data, // The suggestions array from the backend
    });
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    dispatch({
      type: FETCH_SUGGESTIONS_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch suggestions', // Error message
    });
  }
};

// Action Creator to clear suggestions (e.g., when search bar is empty or user navigates)
export const clearSuggestions = () => (dispatch) => {
  dispatch({ type: CLEAR_SUGGESTIONS });
};