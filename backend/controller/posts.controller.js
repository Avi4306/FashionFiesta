import Post from '../models/posts.models.js';
import mongoose from 'mongoose';

export const getPosts = () => async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
}

export const createPost = () =>  (req, res) => {
    const body = req.body;
    const newPost = new Post(body);
    try {
        newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: 'Error creating post', error: error.message });
    }
}

export const deletePost = ( async(req,res) =>
{
     const {id} = req.params;
     if (!mongoose.Types.ObjectId.isValid(id)) {
       return res.status(404).json({ success: false, message: 'Invalid Post ID' });
     }
     try{
       await Post.findByIdAndDelete(id);
       console.log("Post deleted successfully");
       res.status(200).json({ success: true,message:"Post deleted"});

     }
     catch(err)
     {
       console.error(err)
       res.status(404).json({ success: false, message: 'Post not found!' })
     }
});

export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Post ID' });
    }
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
        );

        if (!updatedPost) {
        return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, message: 'Post liked successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error liking post', error: error.message });
    }
}