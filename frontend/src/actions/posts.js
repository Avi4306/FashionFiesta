import * as api from '../api';

export const getPosts = () => async (dispatch) => {
    try {
        const { data } = await api.fetchPosts(); //There is data object in response
        dispatch({type: 'FETCH_ALL', payload: data });

    } catch (error) {
        console.error(error.message);        
    }

}
export const createPost = (post) => async (dispatch) => {
    try {
        const { data } = await api.createPost(post);
        dispatch({ type: 'CREATE', payload: data });
    } catch (error) {
        console.error(error.message);
    }
}