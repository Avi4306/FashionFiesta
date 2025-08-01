import Post from '../models/posts.models.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
<<<<<<< HEAD
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.aggregate([
        {
          $addFields: { // Adds a temporary likeCount field to each document
            likeCount: { $size: { $ifNull: ["$likes", []] } },
          },
        },
        { $sort: { likeCount: -1, createdAt: -1 } }, // Sort by most likes, then newest
        { $skip: skip },
        { $limit: limit },
      ]),
      Post.countDocuments(),
    ]);

    const hasMore = skip + posts.length < total;

    res.status(200).json({ data: posts, page, total, hasMore });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
=======
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
export const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await Post.findById(id);
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query;
    try {
        const title = new RegExp(searchQuery, 'i'); // Case-insensitive search
        const posts = await Post.find({$or: [{ title }, { tags: { $in: tags.split(',') } }] });
        res.status(200).json({data : posts});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost =  (req, res) => {
    const body = req.body;
    const newPost = new Post({ ...body, creator: req.userId , createdAt: new Date().toISOString() });
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
        if (!req.userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const index = post.likes.findIndex((id) => id === String(req.userId));
        if (index === -1) {
            // Like the post
            post.likes.push(req.userId);
        } else {
            // Unlike the post
            post.likes = post.likes.filter((id) => id !== String(req.userId));
        }
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

        if (!updatedPost) {
        return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, message: 'Post liked successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error liking post', error: error.message });
    }
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
<<<<<<< HEAD
    const {name, comment, profilePhoto, userId} = value
=======
    const {name, comment, profilePhoto} = value
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
<<<<<<< HEAD
        post.comments.push({name, comment, profilePhoto, userId, createdAt: new Date().toISOString() });
        await post.save()
        res.status(200).json(post);
=======
        post.comments.push({name, comment, profilePhoto, createdAt: new Date().toISOString() });
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json(updatedPost);
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    } catch (error) {
        console.error('Error adding comment:', error.message)
        res.status(500).json({ message: 'Error adding comment', error });
    }
}