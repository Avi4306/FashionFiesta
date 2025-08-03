import Outfit from '../models/outfit.model.js';

// Controller to get all outfits with pagination
export const getOtherOutfitsThisWeek = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Step 1: Get top 3 IDs this week
    const top3 = await Outfit.find({ createdAt: { $gte: startOfWeek } })
      .sort({ likes: -1 })
      .limit(3)
      .select('_id');
    const top3Ids = top3.map((o) => o._id);

    // Step 2: Fetch rest
    const query = {
      createdAt: { $gte: startOfWeek },
      _id: { $nin: top3Ids }
    };

    const total = await Outfit.countDocuments(query);
    const outfits = await Outfit.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      outfits,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
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
    submittedBy: req.userId, // You would typically get this from an authenticated user
    creatorName: req.userName
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

    const userId = req.userId;
    const isLiked = outfit.likes.some(id => id.toString() === userId.toString());

    let updatedLikes;
    if (isLiked) {
      updatedLikes = outfit.likes.filter(id => id.toString() !== userId.toString());
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
    const outfit = await Outfit.findById(req.params.id);

    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    // Ensure only the owner can delete
    if (outfit.submittedBy.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this outfit' });
    }

    await Outfit.findByIdAndDelete(req.params.id);

    res.json({ message: 'Outfit deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopOutfitsThisWeek = async (req, res) => {
  try {
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const top3 = await Outfit.find({ createdAt: { $gte: startOfWeek } })
      .sort({ likes: -1 })
      .limit(3);

    res.status(200).json(top3);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};