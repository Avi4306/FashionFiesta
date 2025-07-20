import { FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH,CREATE_POST, DELETE_POST, LIKE_POST, START_LOADING, END_LOADING } from '../constants/actionTypes';
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
    case START_LOADING:
      return { ...state, isLoading: true }; // Set loading state to true
    case END_LOADING:
      return { ...state, isLoading: false }; // Set loading state to false
    default:
      return state;
  }
}
export default posts;