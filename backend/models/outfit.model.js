import mongoose from 'mongoose';

// Define the schema for an Outfit
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Outfit = mongoose.model('Outfit', outfitSchema);
export default Outfit;