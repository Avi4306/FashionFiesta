import * as api from '../api';
import { FETCH_ALL, CREATE_POST, DELETE_POST, LIKE_POST } from '../constants/actionTypes';

export const getPosts = () => async (dispatch) => {
    try {
        const { data } = await api.fetchPosts(); //There is data object in response
        dispatch({type: FETCH_ALL, payload: data });

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