import {
  FETCH_PRODUCT,
  FETCH_PRODUCTS,
  FETCH_ALL_PRODUCTS,
  START_LOADING,
  END_LOADING,
  CREATE_PRODUCT,
  FETCH_CAROUSELS, // 🆕 New action
} from '../constants/actionTypes';

const initialState = {
  isLoading: false,
  product: null,
  products: [],
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  categoryCarousels: {}, // 🆕 carousel-specific product groups
  reFetchTrigger: Date.now(),
};

export default function productsData(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
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
      };
    case FETCH_CAROUSELS: // 🆕 New case
      return {
        ...state,
        categoryCarousels: action.payload, // { category: [products] }
      };
    default:
      return state;
  }
}