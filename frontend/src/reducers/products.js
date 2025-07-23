import {
  FETCH_PRODUCT,
  FETCH_ALL_PRODUCTS,
  START_LOADING,
  END_LOADING,
  CREATE_PRODUCT,
} from '../constants/actionTypes';

const initialState = {
  isLoading: false,
  product: null,
  products: [],
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0
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
      return {
        ...state,
        products: action.payload.data,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      };
    case CREATE_PRODUCT:
      return { ...state, products: [...state.products, action.payload], totalProducts: state.totalProducts + 1, };
    default:
      return state;
  }
}