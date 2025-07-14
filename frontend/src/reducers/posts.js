const reducer = (posts = [], action) => { // Here State is initialized as an empty array
  // posts is the current state, action is the action being dispatched
  switch (action.type) {
    case 'FETCH_ALL':
      return action.payload; // action.payload contains the data fetched from the API
    case 'CREATE':
      return [ ...posts, action.payload ]; // action.payload contains the new post data
    case 'UPDATE_POST':
      return posts
    case 'DELETE_POST':
      return posts
    default:
      return posts;
  }
}
export default reducer;