import {
  FETCH_OUTFITS,
  CREATE_OUTFIT,
  LIKE_OUTFIT,
  DELETE_OUTFIT,
  OUTFIT_ERROR,
  OUTFIT_LOADING,
  FETCH_TOP_OUTFITS,
} from '../constants/actionTypes';

const initialState = {
  outfits: [],
  topOutfits: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

const outfitReducer = (state = initialState, action) => {
  switch (action.type) {
    case OUTFIT_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_OUTFITS:
      return {
        ...state,
        outfits: action.payload.outfits,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        loading: false,
        error: null,
      };
      case FETCH_TOP_OUTFITS:
      return {
        ...state,
        loading: false,
        topOutfits: action.payload,
      };
    case CREATE_OUTFIT:
      return {
        ...state,
        outfits: [action.payload, ...state.outfits],
        loading: false,
        error: null,
      };

    case LIKE_OUTFIT:
      return {
        ...state,
        outfits: state.outfits.map((outfit) =>
          outfit._id === action.payload._id ? action.payload : outfit
        ),
        topOutfits: state.topOutfits.map((outfit) =>
          outfit._id === action.payload._id ? action.payload : outfit
        ),
        loading: false,
        error: null,
      };

    case DELETE_OUTFIT:
  return {
    ...state,
    outfits: state.outfits.filter((outfit) => outfit._id !== action.payload),
    topOutfits: state.topOutfits.filter((outfit) => outfit._id !== action.payload),
    loading: false,
    error: null,
  };

    case OUTFIT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default outfitReducer;