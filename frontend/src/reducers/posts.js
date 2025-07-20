import { FETCH_ALL, CREATE_POST, DELETE_POST, LIKE_POST } from '../constants/actionTypes';
const posts = (posts = [], action) => { // Here State is initialized as an empty array
  // posts is the current state, action is the action being dispatched
  switch (action.type) {
    case FETCH_ALL:
      return action.payload; // action.payload contains the data fetched from the API
    case CREATE_POST:
      return [ ...posts, action.payload ]; // action.payload contains the new post data
    case DELETE_POST:
      return posts.filter((post) => post._id !== action.payload); // action.payload contains the id of the post to be deleted
    case LIKE_POST:
      return posts.map((post) => post._id === action.payload._id ? action.payload : post); // action.payload contains the updated post data after liking
    default:
      return posts;
  }
}
export default posts;