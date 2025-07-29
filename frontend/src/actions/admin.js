// client/src/actions/admin.js
import * as api from '../api';
import {
  FETCH_ADMIN_USERS,
  CREATE_ADMIN_USER,
  UPDATE_ADMIN_USER_ROLE,
  UPDATE_ADMIN_USER_PASSWORD,
  DELETE_ADMIN_USER,
  FETCH_ADMIN_PRODUCTS,
  CREATE_ADMIN_PRODUCT, // Added
  UPDATE_ADMIN_PRODUCT, // Added
  DELETE_ADMIN_PRODUCT,
  FETCH_ADMIN_POSTS,
  CREATE_ADMIN_POST, // Added
  UPDATE_ADMIN_POST, // Added
  DELETE_ADMIN_POST,
  SET_ADMIN_ERROR,
  CLEAR_ADMIN_ERROR,
  AUTH
} from '../constants/actionTypes';

// Helper to handle dispatching success/error messages
const handleResponse = (dispatch, type, payload, successMessage) => {
  dispatch({ type: CLEAR_ADMIN_ERROR });
  dispatch({ type, payload });
  // You might want to dispatch a general UI notification here too (e.g., a toast message)
  console.log(successMessage);
  return { success: true, data: payload }; // Return success status and data for component feedback
};

const handleError = (dispatch, error, defaultMessage) => {
  console.error("Admin action error:", error);
  const errorMessage = error.response?.data?.message || defaultMessage;
  dispatch({ type: SET_ADMIN_ERROR, payload: errorMessage });
  // You might want to dispatch a general UI notification here too (e.g., a toast message)
  return { success: false, message: errorMessage }; // Return failure status and message
};

// --- User Management Actions ---
export const getAdminUsers = () => async (dispatch) => {
  try {
    const { data } = await api.adminGetAllUsers();
    return handleResponse(dispatch, FETCH_ADMIN_USERS, data, 'Users fetched successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to fetch users.');
  }
};

export const createAdminUser = (userData) => async (dispatch) => {
  try {
    const { data } = await api.adminCreateUser(userData);
    return handleResponse(dispatch, CREATE_ADMIN_USER, data, 'User created successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to create user.');
  }
};

export const updateAdminUserRole = (id, role) => async (dispatch, getState) => { // <-- Add getState here
  try {
    const { data } = await api.adminUpdateUserRole(id, { role });
    // 'data' here is the updated user object returned from your backend
    handleResponse(dispatch, UPDATE_ADMIN_USER_ROLE, data, `User role updated to ${role}.`);

    // --- NEW LOGIC TO UPDATE CURRENT USER'S LOCAL STORAGE AND AUTH STATE ---
    const currentState = getState();
    const currentUserAuthData = currentState.auth.authData; // Get the current logged-in user's auth data

    // Check if the user whose role was updated is the same as the currently logged-in user
    if (currentUserAuthData && currentUserAuthData.result?._id === data._id) {
      // Construct the new authData for the current user
      // We take the existing token but update the 'result' object with the new user data
      const updatedAuthDataForCurrentUser = {
        ...currentUserAuthData,
        result: data, // 'data' contains the full updated user object (including the new role)
      };

      // Dispatch the AUTH action to update the main auth state and localStorage
      dispatch({ type: AUTH, data: updatedAuthDataForCurrentUser });
      console.log("Logged-in user's role updated in Redux auth state and localStorage.");
    }
    // --- END NEW LOGIC ---

    return { success: true, data }; // Return success for component feedback
  } catch (error) {
    return handleError(dispatch, error, 'Failed to update user role.');
  }
};
export const updateAdminUserPassword = (id, newPassword) => async (dispatch) => {
  try {
    const { data } = await api.adminUpdateUserPassword(id, { newPassword });
    return handleResponse(dispatch, UPDATE_ADMIN_USER_PASSWORD, data, 'User password updated successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to update user password.');
  }
};

export const deleteAdminUser = (id) => async (dispatch) => {
  try {
    await api.adminDeleteUser(id);
    return handleResponse(dispatch, DELETE_ADMIN_USER, id, 'User deleted successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to delete user.');
  }
};

// --- Product Management Actions ---
export const getAdminProducts = () => async (dispatch) => {
  try {
    const { data } = await api.adminGetAllProducts();
    return handleResponse(dispatch, FETCH_ADMIN_PRODUCTS, data, 'Products fetched successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to fetch products.');
  }
};

export const createAdminProduct = (productData) => async (dispatch) => {
  try {
    const { data } = await api.adminCreateProduct(productData); // Call the API to create
    return handleResponse(dispatch, CREATE_ADMIN_PRODUCT, data, 'Product created successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to create product.');
  }
};

export const updateAdminProduct = (id, productData) => async (dispatch) => {
  try {
    const { data } = await api.adminUpdateProduct(id, productData); // Call the API to update
    return handleResponse(dispatch, UPDATE_ADMIN_PRODUCT, data, 'Product updated successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to update product.');
  }
};

export const deleteAdminProduct = (id) => async (dispatch) => {
  try {
    await api.adminDeleteProduct(id);
    return handleResponse(dispatch, DELETE_ADMIN_PRODUCT, id, 'Product deleted successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to delete product.');
  }
};

// --- Post Management Actions ---
export const getAdminPosts = () => async (dispatch) => {
  try {
    const { data } = await api.adminGetAllPosts();
    return handleResponse(dispatch, FETCH_ADMIN_POSTS, data, 'Posts fetched successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to fetch posts.');
  }
};

export const createAdminPost = (postData) => async (dispatch) => {
  try {
    const { data } = await api.adminCreatePost(postData); // Call the API to create
    return handleResponse(dispatch, CREATE_ADMIN_POST, data, 'Post created successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to create post.');
  }
};

export const updateAdminPost = (id, postData) => async (dispatch) => {
  try {
    const { data } = await api.adminUpdatePost(id, postData); // Call the API to update
    return handleResponse(dispatch, UPDATE_ADMIN_POST, data, 'Post updated successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to update post.');
  }
};

export const deleteAdminPost = (id) => async (dispatch) => {
  try {
    await api.adminDeletePost(id);
    return handleResponse(dispatch, DELETE_ADMIN_POST, id, 'Post deleted successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to delete post.');
  }
};