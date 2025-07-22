import {AUTH, AUTH_ERROR, UPDATE_PROFILE,LOGOUT, CLEAR_ERROR} from '../constants/actionTypes';

const auth = (state = { authData: null, error: null }, action) => {
    switch (action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return {...state, authData : action?.data};
        case AUTH_ERROR:
            return { ...state, error: action.payload };
        case UPDATE_PROFILE:
            return { ...state, authData: action?.data };
        case LOGOUT:
            localStorage.removeItem("profile");
            return {...state, authData: null};
        case CLEAR_ERROR:
            return { ...state, error: null };
        default:
            return state;
    }
}
export default auth;