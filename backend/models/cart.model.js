// server/models/cart.model.js
import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to your Product model
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1, // Quantity must be at least 1
    },
}, { _id: false }); // Do not generate an _id for subdocuments if not needed elsewhere

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model (assuming you have one for authentication)
        required: true,
        unique: true, // Each user has only one cart
    },
    items: [cartItemSchema], // Array of cart items
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
});

// Update 'updatedAt' field on save
cartSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;