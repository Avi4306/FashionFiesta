import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
    selectedFiles: {
        type: [String],
        default: []
    },
    likes: { 
        type: [String],
        default: []
    },
    comments: [{
        name: String,
        comment: String,
        profilePhoto: String,
        userId: String,
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