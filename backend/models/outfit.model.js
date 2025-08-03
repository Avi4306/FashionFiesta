import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: [String], // An array of user IDs
    default: [],
  },
  submittedBy: {
    type: String,
    required: true,
  },
  creatorName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Outfit = mongoose.model('Outfit', outfitSchema);
export default Outfit;
