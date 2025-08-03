// src/actions/donation.js

import * as api from '../api'; // Import your API service
import {
  SUBMIT_DONATION_REQUEST,
  SUBMIT_DONATION_SUCCESS,
  SUBMIT_DONATION_FAIL,
  CLEAR_DONATION_ERROR,
  SUBMIT_DONATION_SUCCESS_RESET,
  FETCH_MY_DONATIONS_REQUEST,
  FETCH_MY_DONATIONS_SUCCESS,
  FETCH_MY_DONATIONS_FAIL,
  UPDATE_DONATION_REQUEST,
  UPDATE_DONATION_SUCCESS,
  UPDATE_DONATION_FAIL,
  CLEAR_DONATION_LIST_ERROR,
  DELETE_DONATION_REQUEST,
  DELETE_DONATION_SUCCESS,
  DELETE_DONATION_FAIL,
} from '../constants/actionTypes';

/**
 * Action to submit a new donation.
 * @param {object} donationData - The data for the new donation.
 */
export const submitDonation = (donationData) => async (dispatch) => {
  try {
    dispatch({ type: SUBMIT_DONATION_REQUEST });

    let finalDonationData = { ...donationData };

    if (finalDonationData.photos && finalDonationData.photos.length > 0) {
      // Create an array of promises for each image upload
      const uploadPromises = finalDonationData.photos.map((imageData) =>
        api.uploadImage(imageData, "donation")
      );

      // Wait for all image uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);

      // Replace the base64 images with the array of secure URLs
      finalDonationData = {
        ...finalDonationData,
        photos: uploadedImages.map((res) => res.data.imageUrl),
      };
    }

    const { data } = await api.createDonation(finalDonationData);

    dispatch({ type: SUBMIT_DONATION_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error submitting donation:", error);
    dispatch({
      type: SUBMIT_DONATION_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

/**
 * Action to fetch all donations for the logged-in user.
 */
export const fetchMyDonations = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_MY_DONATIONS_REQUEST });
    const { data } = await api.getMyDonations();
    dispatch({ type: FETCH_MY_DONATIONS_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error fetching donations:", error);
    dispatch({
      type: FETCH_MY_DONATIONS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Action to update an existing donation.
 * @param {string} id - The ID of the donation to update.
 * @param {object} updateData - The data to update.
 */
export const updateDonation = (id, updateData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_DONATION_REQUEST });
    const { data } = await api.updateDonation(id, updateData);
    dispatch({ type: UPDATE_DONATION_SUCCESS, payload: data });
    // After a successful update, re-fetch the donations list
    dispatch(fetchMyDonations());
  } catch (error) {
    console.error("Error updating donation:", error);
    dispatch({
      type: UPDATE_DONATION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Action to delete an existing donation.
 * @param {string} id - The ID of the donation to delete.
 */
export const deleteDonation = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_DONATION_REQUEST });
    await api.deleteDonation(id);
    dispatch({ type: DELETE_DONATION_SUCCESS, payload: id });
    // After a successful deletion, re-fetch the donations list to update the UI
    dispatch(fetchMyDonations());
  } catch (error) {
    console.error("Error deleting donation:", error);
    dispatch({
      type: DELETE_DONATION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Action to clear any donation submission-related errors.
 */
export const clearDonationError = () => (dispatch) => {
  dispatch({ type: CLEAR_DONATION_ERROR });
};

/**
 * Action to clear any donation list-related errors.
 */
export const clearDonationListError = () => (dispatch) => {
  dispatch({ type: CLEAR_DONATION_LIST_ERROR });
};

/**
 * Action to reset the donation submission success state.
 */
export const resetDonationSuccess = () => (dispatch) => {
  dispatch({ type: SUBMIT_DONATION_SUCCESS_RESET });
};