import express from 'express';
import {
    createDonation,
    deleteDonation,
    getMyDonations,
} from '../controller/donation.controller.js';
import { auth } from '../middleware/auth.js';

const donationRouter = express.Router();

// Define API routes and map them to controller functions
donationRouter.post('/', auth, createDonation);
donationRouter.get('/your-donations', auth, getMyDonations)
donationRouter.delete('/:id', auth, deleteDonation);

export default donationRouter;