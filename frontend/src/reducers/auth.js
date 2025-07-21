import {AUTH, AUTH_ERROR,LOGOUT} from '../constants/actionTypes';

const auth = (state = { authData: null, error: null }, action) => {
    switch (action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return {...state, authData : action?.data};
        case AUTH_ERROR:
            return { ...state, error: action.payload };
        case LOGOUT:
            localStorage.clear();
            return {...state, authData: null};
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}
export default auth;