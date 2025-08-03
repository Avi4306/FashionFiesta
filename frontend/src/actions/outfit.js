import {
  FETCH_OUTFITS,
  CREATE_OUTFIT,
  LIKE_OUTFIT,
  DELETE_OUTFIT,
  OUTFIT_ERROR,
  OUTFIT_LOADING,
  FETCH_TOP_OUTFITS
} from '../constants/actionTypes';
import * as api from '../api'; // Make sure this includes fetchOutfits, createOutfit, likeOutfit, deleteOutfit

// ⏬ Fetch with pagination — updated to store metadata
export const fetchOutfits = (page = 1, limit = 8) => async (dispatch) => {
  dispatch({ type: OUTFIT_LOADING });
  try {
    const { data } = await api.fetchOutfits(page, limit);
    dispatch({
      type: FETCH_OUTFITS,
      payload: {
        outfits: data.outfits,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      },
    });
  } catch (error) {
    dispatch({ type: OUTFIT_ERROR, payload: error.message });
  }
};

// ✅ Create Outfit
export const createOutfit = (newOutfit) => async (dispatch) => {
  dispatch({ type: OUTFIT_LOADING });
  try {
    let finalOutfitData = { ...newOutfit };

    if (finalOutfitData.image) {
      const { data: uploadedImage } = await api.uploadImage(finalOutfitData.image, "outfits");
      finalOutfitData = {
        ...finalOutfitData,
        imageUrl: uploadedImage.imageUrl,
      };
    }

    delete finalOutfitData.image;

    const { data } = await api.createOutfit(finalOutfitData);
    dispatch({ type: CREATE_OUTFIT, payload: data });

    // ✅ Refetch top outfits after new submission
    dispatch(fetchTopOutfits());
  } catch (error) {
    dispatch({ type: OUTFIT_ERROR, payload: error.message });
  }
};

// ❤️ Like an outfit
export const likeOutfit = (id) => async (dispatch) => {
  try {
    const { data } = await api.likeOutfit(id);
    dispatch({ type: LIKE_OUTFIT, payload: data });
    dispatch(fetchTopOutfits())
  } catch (error) {
    dispatch({ type: OUTFIT_ERROR, payload: error.message });
  }
};

// 🗑️ Delete Outfit (optional)
export const deleteOutfit = (id) => async (dispatch) => {
  dispatch({ type: OUTFIT_LOADING });
  try {
    await api.deleteOutfit(id);
    dispatch({ type: DELETE_OUTFIT, payload: id });
  } catch (error) {
    dispatch({ type: OUTFIT_ERROR, payload: error.message });
  }
};


// Fetch top 3 outfits
export const fetchTopOutfits = () => async (dispatch) => {
  try {
    const { data } = await api.fetchTopOutfits();
    dispatch({ type: FETCH_TOP_OUTFITS, payload: data });
  } catch (error) {
    dispatch({ type: OUTFIT_ERROR, payload: error.message });
  }
};