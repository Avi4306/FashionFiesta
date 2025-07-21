import { AUTH, AUTH_ERROR } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const login = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.login(formData);
        dispatch({ type: AUTH, data });
        navigate('/');
    } catch (error) {
        console.log(error);
        dispatch({ type: AUTH_ERROR, payload: error.response?.data?.message || 'Something went wrong' });
    }
}

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        dispatch({ type: AUTH, data });
        navigate('/');
    } catch (error) {
        console.log(error);
        dispatch({ type: AUTH_ERROR, payload: error.response?.data?.message || 'Something went wrong' });
    }
}