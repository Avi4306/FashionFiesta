// client/src/actions/admin.js
import * as api from '../api';
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
  AUTH,
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

/**
 * Action creator to clear any admin-related error from the state.
 * This is the function that was missing the export.
 */
export const clearAdminError = () => async (dispatch) => {
  dispatch({ type: CLEAR_ADMIN_ERROR });
};

// --- User Management Actions ---
export const getAdminUsers = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING }); // Dispatch loading start
  try {
    console.log("Fetching users with page:", page, "limit:", limit);
    const { data } = await api.adminGetAllUsers(page, limit);
    console.log(data)
    return handleResponse(dispatch, FETCH_ADMIN_USERS, data, 'Users fetched successfully with pagination.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to fetch users.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING }); // Dispatch loading end
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

export const updateAdminUserRole = (id, role) => async (dispatch, getState) => {
  try {
    const { data } = await api.adminUpdateUserRole(id, { role });
    handleResponse(dispatch, UPDATE_ADMIN_USER_ROLE, data, `User role updated to ${role}.`);

    const currentState = getState();
    const currentUserAuthData = currentState.auth.authData;

    // If the updated user is the currently logged-in user, update their role in Redux auth state
    if (currentUserAuthData && currentUserAuthData.result?._id === data._id) {
      const updatedAuthDataForCurrentUser = {
        ...currentUserAuthData,
        result: data, // 'data' here is the updated user object
      };

      dispatch({ type: AUTH, data: updatedAuthDataForCurrentUser });
      console.log("Logged-in user's role updated in Redux auth state and localStorage.");
    }

    return { success: true, data };
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
export const getAdminProducts = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING }); // Dispatch loading start
  try {
    console.log("Fetching products with page:", page, "limit:", limit);
    const { data } = await api.adminGetAllProducts(page, limit);
    return handleResponse(dispatch, FETCH_ADMIN_PRODUCTS, data, 'Products fetched successfully with pagination.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to fetch products.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING }); // Dispatch loading end
  }
};

export const createAdminProduct = (productData) => async (dispatch) => {
  try {
    const { data } = await api.adminCreateProduct(productData);
    return handleResponse(dispatch, CREATE_ADMIN_PRODUCT, data, 'Product created successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to create product.');
  }
};

export const updateAdminProduct = (id, productData) => async (dispatch) => {
  try {
    const { data } = await api.adminUpdateProduct(id, productData);
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
export const getAdminPosts = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING }); // Dispatch loading start
  try {
    console.log("Fetching posts with page:", page, "limit:", limit);
    const { data } = await api.adminGetAllPosts(page, limit);
    return handleResponse(dispatch, FETCH_ADMIN_POSTS, data, 'Posts fetched successfully with pagination.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to fetch posts.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING }); // Dispatch loading end
  }
};

export const createAdminPost = (postData) => async (dispatch) => {
  try {
    let finalPostData = { ...postData };
    
        if (finalPostData.selectedFiles && finalPostData.selectedFiles.length > 0) {
          // Create an array of promises for each image upload
          const uploadPromises = finalPostData.selectedFiles.map((imageData) =>
            api.uploadImage(imageData, "posts")
          );
    
          // Wait for all image uploads to complete
          const uploadedImages = await Promise.all(uploadPromises);
    
          // Replace the base64 images with the array of secure URLs
          finalPostData = {
            ...finalPostData,
            selectedFiles: uploadedImages.map((res) => res.data.imageUrl),
          };
        }
    const { data } = await api.adminCreatePost(postData);
    return handleResponse(dispatch, CREATE_ADMIN_POST, data, 'Post created successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to create post.');
  }
};

export const updateAdminPost = (id, postData) => async (dispatch) => {
  try {
    const { data } = await api.adminUpdatePost(id, postData);
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

// --- Designer Application Management Actions ---

/**
 * Fetches all pending designer applications.
 */
export const getDesignerApplications = () => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING });
  try {
    const { data } = await api.fetchDesignerApplications();
    return handleResponse(dispatch, FETCH_DESIGNER_APPLICATIONS, data, 'Designer applications fetched successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to fetch designer applications.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING });
  }
};

/**
 * Approves a specific designer application.
 * @param {string} id - The user ID of the applicant to approve.
 */
export const approveDesignerApplication = (id) => async (dispatch, getState) => {
  dispatch({ type: START_ADMIN_LOADING });
  try {
    const { data } = await api.approveDesignerApplication(id); // 'data' will contain the updated user object

    // Dispatch action to remove the application from the list in the admin reducer
    handleResponse(dispatch, APPROVE_DESIGNER_APPLICATION, id, 'Designer application approved successfully.');

    const currentState = getState();
    const currentUserAuthData = currentState.auth.authData;

    // If the approved user is the currently logged-in admin, update their role in Redux auth state
    if (currentUserAuthData && currentUserAuthData.result?._id === data.user._id) {
      const updatedAuthDataForCurrentUser = {
        ...currentUserAuthData,
        result: data.user, // 'data.user' is the updated user object from the backend
      };
      dispatch({ type: AUTH, data: updatedAuthDataForCurrentUser });
      console.log("Logged-in user's role updated to designer/admin in Redux auth state and localStorage.");
    }

    return { success: true, data };
  } catch (error) {
    return handleError(dispatch, error, 'Failed to approve designer application.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING });
  }
};

/**
 * Rejects a specific designer application.
 * @param {string} id - The user ID of the applicant to reject.
 * @param {string} reason - The reason for rejection.
 */
export const rejectDesignerApplication = (id, reason) => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING });
  try {
    await api.rejectDesignerApplication(id, { reason });

    // Dispatch action to remove the application from the list in the admin reducer
    handleResponse(dispatch, REJECT_DESIGNER_APPLICATION, id, 'Designer application rejected successfully.');

    return { success: true };
  } catch (error) {
    return handleError(dispatch, error, 'Failed to reject designer application.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING });
  }
};

// --- Donation Management Actions ---

/**
 * Fetches all donations for the admin view.
 */
export const getAdminDonations = () => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING });
  try {
    const { data } = await api.adminGetAllDonations();
    return handleResponse(dispatch, FETCH_ADMIN_DONATIONS, data, 'All donations fetched successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to fetch donations.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING });
  }
};

/**
 * Updates the status of a specific donation.
 * @param {string} id - The ID of the donation to update.
 * @param {string} status - The new status (e.g., 'Approved', 'Cancelled').
 */
export const updateAdminDonationStatus = (id, status) => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING });
  try {
    const { data } = await api.adminUpdateDonationStatus(id, { status });
    return handleResponse(dispatch, UPDATE_ADMIN_DONATION_STATUS, data, `Donation status updated to ${status}.`);
  } catch (error) {
    return handleError(dispatch, error, 'Failed to update donation status.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING });
  }
};

/**
 * Deletes a specific donation.
 * @param {string} id - The ID of the donation to delete.
 */
export const deleteAdminDonation = (id) => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING });
  try {
    await api.adminDeleteDonation(id);
    return handleResponse(dispatch, DELETE_ADMIN_DONATION, id, 'Donation deleted successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to delete donation.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING });
  }
};

export const getAdminOutfits = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING });
  try {
    const { data } = await api.adminGetAllOutfits(page, limit);
    return handleResponse(dispatch, FETCH_ADMIN_OUTFITS, data, 'Outfits fetched successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to fetch outfits.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING });
  }
};

export const createAdminOutfit = (outfitData) => async (dispatch) => {
  try {
    let finalData = { ...outfitData };

    // Upload image if it's base64
    if (finalData.selectedFile?.startsWith('data:image')) {
      const uploadResponse = await api.uploadImage(finalData.selectedFile, 'outfits');
      finalData.imageUrl = uploadResponse.data.imageUrl;
    } else {
      finalData.imageUrl = finalData.selectedFile; // Assume it's already a valid URL
    }

    // Remove local-only field before sending
    delete finalData.selectedFile;
    const { data } = await api.adminCreateOutfit(outfitData);
    return handleResponse(dispatch, CREATE_ADMIN_OUTFIT, data, 'Outfit created successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to create outfit.');
  }
};

export const deleteAdminOutfit = (id) => async (dispatch) => {
  dispatch({ type: START_ADMIN_LOADING });
  try {
    await api.adminDeleteOutfit(id);
    return handleResponse(dispatch, DELETE_ADMIN_OUTFIT, id, 'Outfit deleted successfully.');
  } catch (error) {
    return handleError(dispatch, error, 'Failed to delete outfit.');
  } finally {
    dispatch({ type: END_ADMIN_LOADING });
  }
};