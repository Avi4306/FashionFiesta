import { FETCH_USER , START_LOADING, END_LOADING} from "../constants/actionTypes";

const user = (state = {isLoading : true, user : {}}, action) =>{
    switch (action.type) {
        case FETCH_USER:
            return {...state, user: action.payload};
        case START_LOADING:
            return { ...state, isLoading: true }; // Set loading state to true
        case END_LOADING:
            return { ...state, isLoading: false }; // Set loading state to false
        default:
            return state;
    }
}

export default user