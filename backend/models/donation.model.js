// backend/models/donationModel.js
import mongoose, { Mongoose } from 'mongoose';

const donationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    itemType: {
        type: String,
        required: [true, 'Item type is required.'],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required.'],
        min: [1, 'Quantity must be at least 1.'],
    },
    condition: {
        type: String,
        required: [true, 'Condition is required.'],
        enum: ['new_with_tags', 'like_new', 'gently_used', 'worn'], // Enforce allowed values
        message: 'Invalid condition type.'
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters.']
    },
    pickupAddress: {
        street: { type: String, required: [true, 'Street address is required.'], trim: true },
        city: { type: String, required: [true, 'City is required.'], trim: true },
        state: { type: String, required: [true, 'State is required.'], trim: true },
        zip: { type: String, required: [true, 'Zip code is required.'], trim: true, match: [/^\d{6}$/, 'Invalid Indian zip code (6 digits).'] }, // Basic Indian zip code validation
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required.'],
        trim: true,
        match: [/^\d{10}$/, 'Invalid Indian contact number (10 digits).'] // Basic Indian mobile number validation
    },
    preferredPickupDate: {
        type: Date,
        default: null,
    },
    preferredPickupTime: {
        type: String,
        default: null,
        // You might add a regex for time format validation if needed, e.g., /^([01]\d|2[0-3]):([0-5]\d)$/
    },
    photos: {
        type: [String], // Array of Base64 strings or URLs
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'collected', 'cancelled', 'rejected'], // Donation lifecycle
        default: 'pending',
    },
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;