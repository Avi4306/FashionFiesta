import Outfit from '../models/outfit.model.js';

// Controller to get all outfits with pagination
export const getOutfits = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalOutfits = await Outfit.countDocuments();
    const outfits = await Outfit.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      outfits,
      totalPages: Math.ceil(totalOutfits / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to create a new outfit
export const createOutfit = async (req, res) => {
  const { imageUrl, description } = req.body;
  const outfit = new Outfit({
    imageUrl,
    description,
    likes: [],
    submittedBy: 'anonymous_user', // You would typically get this from an authenticated user
  });

  try {
    const newOutfit = await outfit.save();
    res.status(201).json(newOutfit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller to like or unlike an outfit
export const likeOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id);
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }

    const { userId } = req.body;
    const isLiked = outfit.likes.includes(userId);

    let updatedLikes;
    if (isLiked) {
      updatedLikes = outfit.likes.filter(id => id !== userId);
    } else {
      updatedLikes = [...outfit.likes, userId];
    }
    
    outfit.likes = updatedLikes;
    const updatedOutfit = await outfit.save();
    res.json(updatedOutfit);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to delete an outfit by its ID
export const deleteOutfit = async (req, res) => {
  try {
    const deletedOutfit = await Outfit.findByIdAndDelete(req.params.id);
    
    if (!deletedOutfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    
    res.json({ message: 'Outfit deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopOutfits = async (req, res) => {
  try {
    const topOutfits = await Outfit.find().sort({ likes: -1 }).limit(3);
    res.status(200).json(topOutfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};