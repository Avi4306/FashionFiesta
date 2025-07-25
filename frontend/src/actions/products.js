import * as api from '../api';
import {
  FETCH_PRODUCT,
  START_LOADING,
  END_LOADING,
  FETCH_ALL_PRODUCTS,
  FETCH_PRODUCTS,
  CREATE_PRODUCT,
  FETCH_CAROUSELS,
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

export const getProducts = ({ page = 1, limit = 15, category = '' } = {}) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    
    // Build query string dynamically
    const query = new URLSearchParams();
    query.append('page', page);
    query.append('limit', limit);
    if (category) query.append('category', category);
    
    const { data } = await api.fetchProducts(query.toString());

    dispatch({ type: FETCH_PRODUCTS, payload: data });

    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error('Fetch Products Error:', error.message);
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

export const fetchCarousels = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data: categories } = await api.fetchCategories();
    const categoryData = {};
    console.log(categories)

    for (const category of categories) {
      const { data: products } = await api.fetchProductsByCategory(category);
      categoryData[category] = products;
    }
    console.log(categoryData)
    dispatch({ type: FETCH_CAROUSELS, payload: categoryData });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error)
  }
};