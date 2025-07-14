import {combineReducers} from 'redux';
import reducer from './posts.js';

export default combineReducers({
    posts: reducer, //posts : posts
});