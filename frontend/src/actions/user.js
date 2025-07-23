import * as api from '../api';
import { FETCH_USER, FETCH_USER_POSTS, FETCH_USER_PRODUCTS, UPDATE_PROFILE, DELETE_ACCOUNT, LOGOUT, START_LOADING, END_LOADING, AUTH_ERROR } from '../constants/actionTypes';

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

    dispatch({ type: UPDATE_PROFILE, data: updatedUser });
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