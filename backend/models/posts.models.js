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
    name: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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