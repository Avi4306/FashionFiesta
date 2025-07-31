import mongoose from "mongoose";

// Schema for the details of an active/approved designer
const designerDetailsSchema = new mongoose.Schema({
  brandName: { type: String, trim: true },
  portfolioUrl: {
    type: String,
    trim: true,
    // Regex for URL validation - make it optional for designer details as they might not have it initially, but encouraged
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
      "Please enter a valid URL.",
    ],
  },
  // This indicates if the designer's profile has been approved/verified by an admin
  verified: { type: Boolean, default: false },
  salesCount: { type: Number, default: 0 },
}, { _id: false }); // Do not create a separate _id for this subdocument

// Schema for a designer's application
const designerApplicationSchema = new mongoose.Schema({
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  portfolioLink: {
    type: String,
    trim: true,
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
      "Please enter a valid URL for your portfolio.",
    ],
  },
  yearsExperience: { type: Number, default: 0, min: 0 }, // Add this
  specializations: { type: String, trim: true, maxlength: 500 }, // Add this
  whyYou: { type: String, trim: true, maxlength: 500 }, // Add this
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  rejectionReason: { type: String, trim: true }
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
    lowercase: true, // Store emails in lowercase for consistency
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
    default: "", // An empty string or a default placeholder URL
  },
  role: {
    type: String,
    enum: ['customer', 'pending_designer', 'designer', 'admin'],
    default: "customer",
  },
  // This field holds details only if the user is an approved 'designer'
  designerDetails: {
    type: designerDetailsSchema,
    default: {} // Default to an empty object to ensure it's always there but empty
  },
  // This field holds the details of a designer application, if one has been submitted
  designerApplication: {
    type: designerApplicationSchema,
    // This can be null/undefined if no application has been submitted
    // or if an application was rejected and cleared.
    // You might set it to an empty object default if you always want it present.
    // For now, it's better to leave it without a default if it's truly optional.
  },
  bio: { type: String, default: '', maxlength: 500 }, // Added maxlength for bio
  socialLinks: {
    instagram: {
      type: String,
      default: '',
      trim: true,
      match: [
        /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/,
        "Please enter a valid Instagram profile URL.",
      ],
    },
    facebook: {
      type: String,
      default: '',
      trim: true,
      match: [
        /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
        "Please enter a valid Facebook profile URL.",
      ],
    },
    twitter: {
      type: String,
      default: '',
      trim: true,
      match: [
        /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}\/?$/,
        "Please enter a valid Twitter profile URL.",
      ],
    },
    website: {
      type: String,
      default: '',
      trim: true,
      match: [
        /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/\S*)?$/,
        "Please enter a valid website URL.",
      ],
    },
  },
  location: {
    city: { type: String, default: '', trim: true },
    state: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const User = mongoose.model("User", userSchema);
export default User;