import * as api from '../api';
import { FETCH_USER, START_LOADING, END_LOADING } from '../constants/actionTypes';

export const getUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchUser(id); //There is data object in response
        // dispatch({type: FETCH_USER, payload: data });
        console.log(data)
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error(error);        
    }
}