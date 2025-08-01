<<<<<<< HEAD
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

=======
import { FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH,CREATE_POST, DELETE_POST, LIKE_POST, START_LOADING, END_LOADING, COMMENT_POST } from '../constants/actionTypes';
const posts = (state = {isLoading: true, posts : [], post : null}, action) => { // Here State is initialized as an empty array
  // posts is the current state, action is the action being dispatched
  switch (action.type) {
    case FETCH_ALL:
      return {...state, posts: action.payload}; // action.payload contains the data fetched from the API
    case FETCH_POST:
      return {...state, post: action.payload};
    case FETCH_BY_SEARCH:
      return {...state, posts: action.payload}; // action.payload contains the data fetched by search
    case CREATE_POST:
      return {...state, posts: [ ...state.posts, action.payload ]}; // action.payload contains the new post data
    case DELETE_POST:
      return {...state, posts: state.posts.filter((post) => post._id !== action.payload)}; // action.payload contains the id of the post to be deleted
    case LIKE_POST:
      return {...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post)}; // action.payload contains the updated post data after liking
    case COMMENT_POST:
      return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) }; // action.payload contains the updated comments array after commenting
    case START_LOADING:
      return { ...state, isLoading: true }; // Set loading state to true
    case END_LOADING:
      return { ...state, isLoading: false }; // Set loading state to false
    default:
      return state;
  }
}
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
export default posts;