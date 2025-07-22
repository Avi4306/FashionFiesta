import * as api from '../api';
import { FETCH_USER, UPDATE_PROFILE,START_LOADING, END_LOADING } from '../constants/actionTypes';

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
export const updateProfile = (id, formData) => async (dispatch) => {
  try {
    const { data } = await api.updateUser(id, formData);

    const updatedUser = {
      result: data,
      token: JSON.parse(localStorage.getItem("profile"))?.token,
    };

    dispatch({ type: UPDATE_PROFILE, data: updatedUser });
    localStorage.setItem("profile", JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Profile update failed:", error?.response?.data || error.message);
  }
};