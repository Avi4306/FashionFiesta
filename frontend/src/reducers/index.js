import {combineReducers} from 'redux';
import posts from './posts.js';
import auth from './auth.js';
import user from './user.js';
import productsData from './products.js';
import cart from './cart.js'
import admin from './admin.js';
import search from './search.js';

export default combineReducers({posts, auth, user, productsData, cart, admin, search}); //posts : posts