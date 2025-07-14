import Post from '../models/posts.models.js';

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