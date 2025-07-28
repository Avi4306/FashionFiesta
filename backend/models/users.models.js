import mongoose from "mongoose";

const designerDetailsSchema = new mongoose.Schema({
  brandName: { type: String },
  portfolioUrl: {
    type: String,
    // Regex for URL validation
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
      "Please enter a valid URL.",
    ],
  },
  verified: { type: Boolean, default: false },
  appliedAt: { type: Date },
  salesCount: { type: Number, default: 0 },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    // Regex for email validation
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address.",
    ],
  },
  authProvider: { type: String, default: "local" },
  password: {
    type: String,
    required: true,
    // Regex for a strong password: at least 8 characters, with at least one uppercase, one lowercase, one number, and one special character.
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*\s).{8,}$/,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ],
  },
  profilePhoto: {
    type: String,
    required: false,
    default: "",
  },
  role: {
    type: String,
    enum: ['customer', 'pending_designer', 'designer', 'admin'],
    default: "customer",
  },
  designerDetails: designerDetailsSchema,
  bio: { type: String, default: '' },
  socialLinks: {
  instagram: {
    type: String,
    default: '',
    match: [
      /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/,
      "Please enter a valid Instagram profile URL.",
    ],
  },
  facebook: {
    type: String,
    default: '',
    match: [
      /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
      "Please enter a valid Facebook profile URL.",
    ],
  },
  twitter: {
    type: String,
    default: '',
    match: [
      /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}\/?$/,
      "Please enter a valid Twitter profile URL.",
    ],
  },
  website: {
    type: String,
    default: '',
    match: [
      /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/\S*)?$/,
      "Please enter a valid website URL.",
    ],
  },
},

  location: {
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;