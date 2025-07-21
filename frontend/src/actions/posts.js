import * as api from '../api';
import { FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE_POST, DELETE_POST, LIKE_POST, START_LOADING, END_LOADING, COMMENT_POST } from '../constants/actionTypes';

export const getPosts = () => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPosts(); //There is data object in response
        dispatch({type: FETCH_ALL, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error(error);        
    }

}
export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPost(id); //There is data object in response
        dispatch({type: FETCH_POST, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error(error);        
    }

}
export const getPostsBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data : {data} } = await api.fetchPostsBySearch(searchQuery);
        dispatch({ type: FETCH_BY_SEARCH, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error(error);        
    }

}
export const createPost = (post) => async (dispatch) => {
    try {
        const { data } = await api.createPost(post);
        dispatch({ type: CREATE_POST, payload: data });
    } catch (error) {
        console.error(error);
    }
}
export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id);
        dispatch({ type: DELETE_POST, payload: id });
    } catch (error) {
        console.error(error);
    }
}
export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);
        dispatch({ type: LIKE_POST, payload: data.post });
    } catch (error) {
        console.error(error);
    }
}

export const commentPost = (commentData, id) => async (dispatch) => {
    try {
        const { data } = await api.comment(commentData, id);
        console.log(data)
        dispatch({ type: COMMENT_POST, payload: data });
        return data.comments; // Return the updated comments array
    } catch (error) {
        console.error(error);
    }
}