import * as api from '../api';
import { FETCH_USER, FETCH_USER_POSTS, FETCH_USER_PRODUCTS, UPDATE_PROFILE, DELETE_ACCOUNT, LOGOUT, START_LOADING, END_LOADING, AUTH_ERROR, FETCH_DESIGNERS, SET_ERROR, AUTH, CLEAR_ERROR } from '../constants/actionTypes';

const handleError = (dispatch, error, defaultMessage) => {
  console.error("API Error:", error);
  const errorMessage = error.response?.data?.message || defaultMessage;
  dispatch({ type: SET_ERROR, payload: errorMessage });
  dispatch({ type: END_LOADING }); // Ensure loading state ends on error
  return { success: false, message: errorMessage }; // Return failure indicator
};

export const getUserProfileData = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const [user, posts, products] = await Promise.all([
          api.fetchUserById(id),
          api.fetchUserPosts(id),
          api.fetchUserProducts(id),
        ]);
        dispatch({type: FETCH_USER, payload: user.data });
        dispatch({ type: FETCH_USER_POSTS, payload: posts.data });
      dispatch({ type: FETCH_USER_PRODUCTS, payload: products.data });
    } catch (error) {
      console.error(error);        
    } finally{
      dispatch({ type: END_LOADING });
    }
}
export const updateProfile = (id, formData) => async (dispatch) => {
  try {
    const { data } = await api.updateUser(id, formData);

    const updatedUser = {
      result: data,
      token: JSON.parse(localStorage.getItem("profile"))?.token,
    };

    dispatch({ type: UPDATE_PROFILE, payload: updatedUser });
    localStorage.setItem("profile", JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Profile update failed:", error?.response?.data || error.message);
  }
};

export const deleteAccount = (userId, password, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    await api.deleteUserAccount(userId, password); // API call

    dispatch({ type: DELETE_ACCOUNT });

    dispatch({ type: LOGOUT });
    localStorage.removeItem("profile");

    dispatch({ type: END_LOADING });
    navigate("/");
  } catch (error) {
    console.error("Failed to delete account:", error?.response?.data || error.message);
    dispatch({
      type: AUTH_ERROR,
      payload: error.response?.data?.message || "Something went wrong",
    });
    dispatch({ type: END_LOADING });
  }
};

export const getFeaturedDesigners = () => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchFeaturedDesigners();
        dispatch({ type: FETCH_DESIGNERS, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error('Failed to fetch designers:', error);
        dispatch({ type: END_LOADING });
    }
};
export const fetchUserPosts = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchUserPosts(id);
    dispatch({ type: FETCH_USER_POSTS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

// NEW: Action to fetch all products for a user
export const fetchUserProducts = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchUserProducts(id);
    dispatch({ type: FETCH_USER_PRODUCTS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const applyForDesignerRole = (userId, formData) => async (dispatch) => { // Removed 'navigate' from parameters
  dispatch({ type: START_LOADING }); // Start loading state
  dispatch({ type: CLEAR_ERROR }); // Clear any previous errors

  try {
    const { data } = await api.applyForDesignerRole(userId, formData); // Call your API
    console.log("Action Success Data:", data);

    dispatch({ type: AUTH, data }); // Update user data in Redux state (including new role)
    dispatch({ type: END_LOADING }); // End loading state
    return { success: true, message: "Your application has been submitted successfully!", data }; // Return success indicator
  } catch (error) {
    // handleError will dispatch SET_ERROR and END_LOADING
    return handleError(dispatch, error, 'Failed to submit application. Please try again.');
  }
};