import * as api from '../api';
import {
  FETCH_PRODUCT,
  START_LOADING,
  END_LOADING,
  FETCH_ALL_PRODUCTS,
  CREATE_PRODUCT,
} from '../constants/actionTypes';

export const getProductById = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchProduct(id);
    dispatch({ type: FETCH_PRODUCT, payload: data });

    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Fetch Product Error:', error.message);
  }
};

export const getAllProducts = (page = 1) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchAllProducts(page);
    dispatch({ type: FETCH_ALL_PRODUCTS, payload: data });

    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Fetch All Products Error:', error.message);
  }
};

export const createProduct = (productData) => async (dispatch) => {
  try {
    const { data } = await api.createProduct(productData);
    dispatch({ type: CREATE_PRODUCT, payload: data });
  } catch (error) {
    console.error('Create Product Error:', error.message);
  }
};
