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
        required: true,
        ref: 'User'
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
    selectedFile: {
        type: String,
    },
    likes: { 
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);
export default Post;