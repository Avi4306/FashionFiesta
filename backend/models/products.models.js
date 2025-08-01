<<<<<<< HEAD
import mongoose from "mongoose";
=======
import mongoose  from "mongoose";
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
<<<<<<< HEAD
=======
        required: false,
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
<<<<<<< HEAD
    creator: {
        type: mongoose.Schema.Types.ObjectId,
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
    numReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            name: { // NEW: Add a name field for the reviewer
                type: String,
                required: true,
            },
            profilePhoto: { // NEW: Add a profile photo field for the reviewer
                type: String,
            },
            comment: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true
            }
        }
    ],
=======
    discount:{
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: false
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
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);
<<<<<<< HEAD
export default Product;
=======
export default Product;
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
