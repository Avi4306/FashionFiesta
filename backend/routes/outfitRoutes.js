import express from 'express';
import { createOutfit, likeOutfit, deleteOutfit, getOtherOutfitsThisWeek, getTopOutfitsThisWeek } from '../controller/outfit.controller.js';
import {auth} from '../middleware/auth.js'

const outfitRouter = express.Router();

// GET all outfits
outfitRouter.get('/', getOtherOutfitsThisWeek);

outfitRouter.get('/top', getTopOutfitsThisWeek);
// POST a new outfit
outfitRouter.post('/', auth, createOutfit);

// PATCH to like an outfit
outfitRouter.patch('/:id/like',auth, likeOutfit);

outfitRouter.delete('/:id',auth, deleteOutfit);

export default outfitRouter;
