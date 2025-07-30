import {
  FETCH_PRODUCT,
  FETCH_PRODUCTS,
  FETCH_ALL_PRODUCTS,
  START_LOADING,
  END_LOADING,
  CREATE_PRODUCT,
  FETCH_CAROUSELS,
  FETCH_PRODUCT_BY_SEARCH,
  DELETE_PRODUCT,
  ADD_REVIEW,
  FETCH_RECOMMENDATIONS
} from '../constants/actionTypes';

const initialState = {
  searchProducts : [],
  isLoading: false,
  product: null,
  products: [],
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  categoryCarousels: {}, // 🆕 carousel-specific product groups
  reFetchTrigger: Date.now(),
  success: false,
  recommendedProducts : []
};

export default function productsData(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true, success : false };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_PRODUCT:
      return { ...state, product: action.payload };
    case FETCH_ALL_PRODUCTS:
      return { ...state, products: action.payload };
    case FETCH_PRODUCTS:
      return {
        ...state,
        products: action.payload.data,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalProducts: action.payload.totalProducts,
        categoryFilter: action.payload.category,
      };
    case CREATE_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
        totalProducts: state.totalProducts + 1,
        reFetchTrigger: Date.now(),
        success : true
      };
    case FETCH_CAROUSELS:
      return {
        ...state,
        categoryCarousels: action.payload, // { category: [products] }
      };
    case FETCH_PRODUCT_BY_SEARCH:
      return {
        ...state,
        searchProducts: action.payload.data, // The actual product array from backend's `data` field
        searchCurrentPage: action.payload.currentPage,
        searchTotalPages: action.payload.totalPages,
        searchTotalProducts: action.payload.totalProducts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
      };
    case ADD_REVIEW:
      return {
          ...state,
          products: state.products.map((product) =>
              product._id === action.payload._id ? action.payload : product
          ),
          product: action.payload, // Update the single product if it's currently in view
      };
    case FETCH_RECOMMENDATIONS:
      return {
        ...state,
        recommendedProducts: action.payload,
      };
    default:
      return state;
  }
}