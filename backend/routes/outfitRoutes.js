import express from 'express';
import { getOutfits, createOutfit, likeOutfit, deleteOutfit, getTopOutfits } from '../controller/outfit.controller.js';

const outfitRouter = express.Router();

// GET all outfits
outfitRouter.get('/', getOutfits);

outfitRouter.get('/top', getTopOutfits);
// POST a new outfit
outfitRouter.post('/', createOutfit);

// PATCH to like an outfit
outfitRouter.patch('/:id/like', likeOutfit);

outfitRouter.delete('/:id', deleteOutfit);

export default outfitRouter;
