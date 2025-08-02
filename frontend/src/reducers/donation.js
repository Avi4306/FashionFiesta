// src/reducers/donationReducer.js

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

// Initial state for the donation submission process
const submissionInitialState = {
  loading: false, // True when an API request is in progress
  success: false, // True if the last submission was successful
  error: null,    // Holds any error message
  donation: null  // Will hold the created donation data on success
};

/**
 * Reducer for handling a new donation submission state.
 * @param {Object} state - The current state.
 * @param {Object} action - The dispatched action.
 */
export const donationSubmission = (state = submissionInitialState, action) => {
  switch (action.type) {
    case SUBMIT_DONATION_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case SUBMIT_DONATION_SUCCESS:
      return { ...state, loading: false, success: true, donation: action.payload, error: null };
    case SUBMIT_DONATION_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case SUBMIT_DONATION_SUCCESS_RESET:
      return { ...state, success: false, donation: null }; // Reset success and donation data
    case CLEAR_DONATION_ERROR:
      return { ...state, error: null }; // Clear only the error
    default:
      return state;
  }
};

// ---
// Initial state for the donation list and updates
const listInitialState = {
  loading: false,
  error: null,
  donations: [],
  updateLoading: false, // Separate loading state for updates
  updateError: null,
  updateSuccess: false,
  deleteLoading: false, // New loading state for deletion
  deleteError: null,
  deleteSuccess: false,
};

/**
 * Reducer for handling the list of donations and updates to them.
 * @param {Object} state - The current state.
 * @param {Object} action - The dispatched action.
 */
export const donationList = (state = listInitialState, action) => {
  switch (action.type) {
    case FETCH_MY_DONATIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_MY_DONATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        donations: action.payload,
        error: null,
      };

    case FETCH_MY_DONATIONS_FAIL:
      return { ...state, loading: false, error: action.payload, donations: [] };

    case UPDATE_DONATION_REQUEST:
      return { ...state, updateLoading: true, updateError: null, updateSuccess: false };

    case UPDATE_DONATION_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: true,
        updateError: null,
        // The list is re-fetched by the action, so we don't need to manually update it here.
      };

    case UPDATE_DONATION_FAIL:
      return { ...state, updateLoading: false, updateError: action.payload, updateSuccess: false };

    case DELETE_DONATION_REQUEST:
      return { ...state, deleteLoading: true, deleteError: null, deleteSuccess: false };

    case DELETE_DONATION_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        deleteSuccess: true,
        deleteError: null,
      };

    case DELETE_DONATION_FAIL:
      return { ...state, deleteLoading: false, deleteError: action.payload, deleteSuccess: false };

    case CLEAR_DONATION_LIST_ERROR:
      return { ...state, error: null, updateError: null, deleteError: null };

    default:
      return state;
  }
};