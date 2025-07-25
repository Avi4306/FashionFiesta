import {
  FETCH_POSTS,
  FETCH_POST,
  FETCH_BY_SEARCH,
  CREATE_POST,
  DELETE_POST,
  LIKE_POST,
  START_LOADING,
  END_LOADING,
  COMMENT_POST
} from '../constants/actionTypes';

const initialState = {
  isLoading: true,
  posts: {
    data: [],
    page: 1
  },
  post: null,
  hasMore: true,
  total: 0
};

const posts = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS:
  return {
    ...state,
    posts: {
      data:
        action.payload.page === 1
          ? action.payload.data
          : [...state.posts.data, ...action.payload.data],
      currentPage: action.payload.page,
    },
    hasMore: action.payload.hasMore,
  };


    case FETCH_POST:
      return { ...state, post: action.payload };

    case FETCH_BY_SEARCH:
      return {
        ...state,
        posts: {
          data: Array.isArray(action.payload) ? action.payload : [],
          page: 1
        }
      };

    case CREATE_POST:
      return {
        ...state,
        posts: {
          ...state.posts,
          data: [...state.posts.data, action.payload]
        },
        total: state.total + 1
      };

    case DELETE_POST:
      return {
        ...state,
        posts: {
          ...state.posts,
          data: state.posts.data.filter((post) => post._id !== action.payload)
        },
        total: state.total - 1
      };

    case LIKE_POST:
    case COMMENT_POST:
      return {
        ...state,
        posts: {
          ...state.posts,
          data: state.posts.data.map((post) =>
            post._id === action.payload._id ? action.payload : post
          )
        }
      };

    case START_LOADING:
      return { ...state, isLoading: true };

    case END_LOADING:
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default posts;