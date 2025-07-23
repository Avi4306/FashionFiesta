import {combineReducers} from 'redux';
import posts from './posts.js';
import auth from './auth.js';
import user from './user.js';
import productsData from './products.js';

export default combineReducers({posts, auth, user, productsData}); //posts : posts