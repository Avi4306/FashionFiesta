import { AUTH, AUTH_ERROR } from "../constants/actionTypes";
import * as api from "../api/index.js";
import { mergeLocalCart } from "./cart.js";

const handleCartMerge = (dispatch) => {
  const localCart = JSON.parse(localStorage.getItem('cart'));
  if (localCart && localCart.items.length > 0) {
    dispatch(mergeLocalCart(localCart.items));
  }
};

export const login = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.login(formData);
    dispatch({ type: AUTH, data });
    handleCartMerge(dispatch); // Use the new, reusable function
    navigate("/");
  } catch (error) {
    console.log(error);
    dispatch({
      type: AUTH_ERROR,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const googleLogin = (googleUser, navigate) => async (dispatch) => {
  try {
    const { data } = await api.googleLogin(googleUser);
    dispatch({ type: AUTH, data });
    handleCartMerge(dispatch); // Use the new, reusable function
    navigate("/");
  } catch (error) {
    console.error("Google Login Error:", error);
    dispatch({
      type: AUTH_ERROR,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

export const sendSignupOtp = (email) => async (dispatch) => {
  try {
    await api.sendOtp(email);
  } catch (error) {
    dispatch({ type: AUTH_ERROR, payload: error.response?.data?.message || 'OTP Error' });
  }
};

export const verifySignupOtp = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.verifyOtpSignup(formData);
    dispatch({ type: AUTH, data });
    handleCartMerge(dispatch); // Use the new, reusable function
    navigate('/');
  } catch (error) {
    dispatch({ type: AUTH_ERROR, payload: error.response?.data?.message || 'OTP verification failed' });
  }
};