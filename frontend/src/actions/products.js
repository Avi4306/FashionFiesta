import * as api from '../api';
import {
  FETCH_PRODUCT,
  START_LOADING,
  END_LOADING,
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

export const getProducts = (category, page = 1, sort = "newest") => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchProducts({ category, page, sort });
    dispatch({
      type: FETCH_PRODUCTS,
      payload: {
        data: data.products,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalProducts: data.totalProducts,
        category,
      },
    });

    dispatch({ type: END_LOADING });
  } catch (error) {
    console.error("Error fetching products:", error);
    dispatch({ type: END_LOADING });
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

    for (const category of categories) {
      const { data: products } = await api.fetchProducts(category);
      categoryData[category] = products;
    }
    dispatch({ type: FETCH_CAROUSELS, payload: categoryData });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error)
  }
};