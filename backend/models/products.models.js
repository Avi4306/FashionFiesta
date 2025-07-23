import mongoose, { Mongoose, Schema }  from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
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
    creator: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    discount:{
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    category: {
        type: String,
        required: false,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        required: false,
        default : 0,
        min: 0
    },
    sizes: {
        type: [String],
        default: []
    },
    colors: {
        type: [String],
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    images: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        default: 0,
        min : 0,
        max: 5
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            comment: String,
            rating: Number
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
