import mongoose  from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount:{
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    stock: {
        type: Number,
        required: false,
        min: 0
    },
    images: [String],
    rating: {
        type: Number,
        default: 0
    },
    // reviews: [
    //     {
    //         user: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'User'
    //         },
    //         comment: String,
    //         rating: Number
    //     }
    // ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
