import * as api from '../api';
import {
  FETCH_PRODUCT,
  START_LOADING,
  END_LOADING,
  FETCH_PRODUCTS,
  CREATE_PRODUCT,
  FETCH_CAROUSELS,
  FETCH_PRODUCT_BY_SEARCH
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

export const getProductsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: 'START_LOADING' });
    const { data } = await api.fetchProductsBySearch(searchQuery);
    dispatch({ type: FETCH_PRODUCT_BY_SEARCH, payload: data });
    dispatch({ type: 'END_LOADING' });
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = (productData) => async (dispatch) => {
  try {
    let finalProductData = { ...productData };

    if (finalProductData.images && finalProductData.images.length > 0) {
      // Create an array of promises for each image upload
      const uploadPromises = finalProductData.images.map((imageData) =>
        api.uploadImage(imageData, "products")
      );

      // Wait for all image uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);

      // Replace the base64 images with the array of secure URLs
      finalProductData = {
        ...finalProductData,
        images: uploadedImages.map((res) => res.data.imageUrl),
      };
    }

    const { data } = await api.createProduct(finalProductData);
    dispatch({ type: "CREATE_PRODUCT", payload: data });
  } catch (error) {
    console.error('Create Product Error:', error.message);
  }
};

export const fetchCarousels = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data: categories } = await api.fetchCategories();
    
    const productPromises = categories.map(async (category) => {
      const { data: products } = await api.fetchProducts({ category, limit: 10 }); 
      return { category, products };
    });

    const results = await Promise.all(productPromises);

    const categoryData = results.reduce((acc, current) => {
      acc[current.category] = current.products;
      return acc;
    }, {});
    
    dispatch({ type: FETCH_CAROUSELS, payload: categoryData });
  } catch (error) {
    console.error("Error fetching carousels:", error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};