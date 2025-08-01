<<<<<<< HEAD
import {AUTH, AUTH_ERROR, UPDATE_PROFILE,LOGOUT, CLEAR_ERROR} from '../constants/actionTypes';
=======
import {AUTH, AUTH_ERROR, UPDATE_PROFILE,LOGOUT} from '../constants/actionTypes';
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf

const auth = (state = { authData: null, error: null }, action) => {
    switch (action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
<<<<<<< HEAD
            return {...state, authData : action?.data, error : null};
=======
            return {...state, authData : action?.data};
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
        case AUTH_ERROR:
            return { ...state, error: action.payload };
        case UPDATE_PROFILE:
            return { ...state, authData: action?.data };
        case LOGOUT:
<<<<<<< HEAD
            localStorage.removeItem("profile");
            return {...state, authData: null};
        case CLEAR_ERROR:
=======
            localStorage.clear();
            return {...state, authData: null};
        case 'CLEAR_ERROR':
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
            return { ...state, error: null };
        default:
            return state;
    }
}
export default auth;