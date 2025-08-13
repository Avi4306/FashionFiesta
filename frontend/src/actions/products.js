import * as api from '../api';
import {
  FETCH_PRODUCT,
  START_LOADING,
  END_LOADING,
  FETCH_PRODUCTS,
  CREATE_PRODUCT,
  FETCH_CAROUSELS,
  FETCH_PRODUCT_BY_SEARCH,
  DELETE_PRODUCT,
  ADD_REVIEW,
  FETCH_RECOMMENDATIONS
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
    dispatch({ type: CREATE_PRODUCT, payload: data });
  } catch (error) {
    console.error('Create Product Error:', error.message);
  }
};

export const fetchCarousels = (categoriesToFetch) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    let categories = [];
    if (categoriesToFetch && Array.isArray(categoriesToFetch)) {
      categories = categoriesToFetch;
    } else {
      const { data: allCategories } = await api.fetchCategories();
      categories = allCategories;
    }


    const productPromises = categories.map(async (category) => {
      
      try {
        const { data: products } = await api.fetchProducts({ category, limit: 15 });
        return { category, products };
      } catch (innerError) {
        // If there's an error with a specific category, it will be logged here.
        console.error(`Failed to fetch products for category: ${category}`, innerError.message);
        return { category, products: [] };
      }
    });

    const results = await Promise.all(productPromises);

    const categoryData = results.reduce((acc, current) => {
      acc[current.category] = current.products;
      return acc;
    }, {});
    
    dispatch({ type: FETCH_CAROUSELS, payload: categoryData });
  } catch (error) {
    console.error("Error fetching carousels (outer catch):", error.message);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    await api.deleteProduct(id);
    
    // Dispatch the action to remove the product from the state
    dispatch({ type: DELETE_PRODUCT, payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const addReview = (id, reviewData) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.addReview(id, reviewData);

        // Dispatch an ADD_REVIEW action with the updated product
        dispatch({ type: ADD_REVIEW, payload: data });

        dispatch({ type: END_LOADING });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// products.js action file
export const fetchRecommendations = (id) => async (dispatch) => {
  try {
    console.log('[DEBUG] Fetching recommendations for ID:', id);
    dispatch({ type: 'RECOMMENDATION_LOADING_START' });
    
    // Make the API call to Flask backend
    const response = await fetch('http://127.0.0.1:5000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: id }),
    });

    console.log('[DEBUG] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ERROR] Response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Received recommendations data:', data);
    
    if (!data.recommended) {
      throw new Error('No recommendations found in response');
    }
    
    // Dispatch success action
    dispatch({ 
      type: 'FETCH_RECOMMENDATIONS_SUCCESS', 
      payload: data.recommended 
    });
    
  } catch (error) {
    console.error('[ERROR] Frontend error fetching recommendations:', error);
    dispatch({ 
      type: 'FETCH_RECOMMENDATIONS_ERROR', 
      payload: error.message 
    });
  } finally {
    dispatch({ type: 'RECOMMENDATION_LOADING_END' });
  }
};