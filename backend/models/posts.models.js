import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
<<<<<<< HEAD
    title: {
=======
    title: {    
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
    },
    creatorPfp: {
        type: String,
    },
    creator: {
<<<<<<< HEAD
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
=======
        type: String,
        required: true,
        ref: 'User'
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    },
    name: {
        type: String,
        ref: 'User',
        required: true,
        trim: true
    },
    tags: [{
        type: String,
        required: true
    }],
<<<<<<< HEAD
    selectedFiles: {
        type: [String],
        default: []
=======
    selectedFile: {
        type: String,
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    },
    likes: { 
        type: [String],
        default: []
    },
    comments: [{
        name: String,
        comment: String,
        profilePhoto: String,
<<<<<<< HEAD
        userId: String,
=======
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
        createdAt: {
            type: Date,
            default: Date.now
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);
export default Post;