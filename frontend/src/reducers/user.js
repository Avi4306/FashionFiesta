import { FETCH_USER, FETCH_USER_POSTS, FETCH_USER_PRODUCTS, DELETE_ACCOUNT, START_LOADING, END_LOADING, FETCH_DESIGNERS} from "../constants/actionTypes";

const user = (state = {isLoading : true, user : null, posts: [], products: [], designers: []}, action) =>{
    switch (action.type) {
        case FETCH_USER:
            return {...state, user: action.payload};
        case FETCH_USER_POSTS:
            return { ...state, posts: action.payload };
        case FETCH_USER_PRODUCTS:
            return { ...state, products: action.payload };
        case DELETE_ACCOUNT:
            return { ...state, user: null, posts: [], products: [] };
        case START_LOADING:
            return { ...state, isLoading: true }; // Set loading state to true
        case END_LOADING:
            return { ...state, isLoading: false }; // Set loading state to false
        case FETCH_DESIGNERS:
            return {
                ...state,
                designers: action.payload,
            };
        default:
            return state;
    }
}

export default user