import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.models.js'; // Ensure this path is correct: users.models.js or User.js
import Post from '../models/posts.models.js';
import Product from '../models/products.models.js';
import Otp from '../models/otp.models.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

// Helper function to generate JWT token
const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Standard expiration for custom tokens
  });

// --- User Login ---
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: 'User does not exist' });

    // Handle Google-authenticated users trying to log in with password
    if (existingUser.authProvider === 'google' && !existingUser.password) {
      return res.status(403).json({ message: 'This account was registered with Google. Please use Google login.' });
    }

    // Compare provided password with hashed password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(existingUser);

    // CRITICAL FIX: Remove password hash before sending user data to frontend
    const userResult = existingUser.toObject(); // Convert Mongoose document to plain object
    delete userResult.password; // Remove the password field

    res.status(200).json({ result: userResult, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Something went wrong during login.' });
  }
};

// --- Google Authentication ---
export const googleAuth = async (req, res) => {
  const { name, email, profilePhoto } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        profilePhoto: profilePhoto || '',
        authProvider: 'google',
        password: null, // Google users don't have a local password
        role: 'customer', // Default role for new Google signups
        bio: '',
        designerDetails: null, // Default to null for sub-documents
        socialLinks: {
          instagram: '', facebook: '', twitter: '', website: '',
        },
        location: {
          city: '', state: '', country: '',
        },
      });
    }

    // Generate token with user role
    // For Google users, you might want a longer expiration (1d is fine)
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // CRITICAL FIX: Remove password hash (which is null here) before sending user data to frontend
    const userResult = user.toObject();
    delete userResult.password;

    res.status(200).json({ result: userResult, token });
  } catch (err) {
    console.error("Google Auth error:", err);
    res.status(500).json({ message: err.message || 'Something went wrong during Google authentication.' });
  }
};

// --- Request OTP for Signup ---
export const requestOtpSignup = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User with this email already exists.' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email }); // Clear previous OTPs for this email
    await Otp.create({ email, code: otpCode, expiresAt: Date.now() + 10 * 60 * 1000 }); // OTP valid for 10 minutes

    await sendOtpEmail(email, otpCode);
    console.log(`OTP for ${email}: ${otpCode}`); // Log OTP for testing/debugging
    res.status(200).json({ message: 'OTP sent to your email address.' });
  } catch (err) {
    console.error("Request OTP error:", err);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// --- Verify OTP and Signup ---
export const verifyOtpAndSignup = async (req, res) => {
  const { email, otp, password, confirmPassword, firstName, lastName, profilePhoto } = req.body;
  try {
    const otpEntry = await Otp.findOne({ email, code: otp });
    if (!otpEntry || otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if user already exists after OTP verification (edge case if another signup happened concurrently)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        await Otp.deleteMany({ email }); // Clean up OTP
        return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`, // Combine first and last name for 'name' field
      profilePhoto: profilePhoto || '',
      isVerified: true, // Assuming OTP verification means the user is verified
      authProvider: 'local',
      role: 'customer', // Default role for new local signups
      bio: '',
      designerDetails: null, // Default to null for sub-documents
      socialLinks: {
        instagram: '', facebook: '', twitter: '', website: '',
      },
      location: {
        city: '', state: '', country: '',
      },
    });

    await Otp.deleteMany({ email }); // Clean up all OTPs for this email after successful signup

    const token = generateToken(newUser);

    // CRITICAL FIX: Remove password hash before sending user data to frontend
    const userResult = newUser.toObject();
    delete userResult.password;

    res.status(200).json({ result: userResult, token });
  } catch (err) {
    console.error("Verify OTP and Signup error:", err);
    // Mongoose validation errors (e.g., password regex not matched)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(' ') });
    }
    res.status(500).json({ message: 'Something went wrong during signup.' });
  }
};

// --- Delete User Account ---
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body; // Password for local auth users

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Ensure the user trying to delete is the owner of the account
    // req.userId is set by the 'auth' middleware
    if (req.userId !== user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this account.' });
    }

    // For local accounts, require password confirmation
    if (user.authProvider !== 'google') {
      if (!password) return res.status(400).json({ message: 'Password is required to delete your account.' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect password.' });
    }

    // Delete associated posts and products
    await Post.deleteMany({ creator: user._id });
    await Product.deleteMany({ creator: user._id });
    await User.findByIdAndDelete(user._id); // Delete the user account itself

    res.status(200).json({ message: 'Account and associated data deleted successfully.' });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: 'Server error during account deletion.' });
  }
};

// --- Get User Profile (Public/Self) ---
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password'); // Good: Excludes password
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};

// --- Update User Profile ---
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Contains fields like name, bio, profilePhoto, socialLinks, location, designerDetails

  // IMPORTANT FIX: Prevent direct password updates via this endpoint.
  // Password changes should go through a dedicated secure endpoint that hashes the new password.
  if (updateData.password) {
    return res.status(400).json({ message: 'Password cannot be updated via this endpoint. Please use a dedicated password change feature.' });
  }

  try {
    // Ensure the user updating is the owner of the account
    if (req.userId !== id) {
        return res.status(403).json({ message: 'You are not authorized to update this profile.' });
    }

    // Use { new: true, runValidators: true } to return the updated document and apply schema validations
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update user error:", err);
    // Handle Mongoose validation errors specifically
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(' ') });
    }
    res.status(500).json({ message: 'Profile update failed.', error: err.message });
  }
};

// --- Get User Posts ---
export const getUserPosts = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await Post.find({ creator: id });
    res.json(posts);
  } catch (err) {
    console.error("Get user posts error:", err);
    res.status(500).json({ message: 'Error fetching posts.' });
  }
};

// --- Get User Products ---
export const getUserProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ creator: id });
    res.json(products);
  } catch (err) {
    console.error("Get user products error:", err);
    res.status(500).json({ message: 'Error fetching products.' });
  }
};

// --- Get Featured Designers ---
export const getFeaturedDesigners = async (req, res) => {
  try {
    const topDesignersBySales = await User.aggregate([
      {
        $match: {
          role: 'designer',
          'designerDetails.verified': true
        }
      },
      {
        $lookup: {
          from: 'products', // Name of the products collection in MongoDB
          localField: '_id',
          foreignField: 'creator',
          as: 'products'
        }
      },
      {
        $addFields: {
          salesCount: { $size: '$products' } // This actually counts products, not sales. Adjust if you have a separate sales field.
        }
      },
      {
        $sort: {
          salesCount: -1
        }
      },
      {
        $limit: 12
      },
      {
        $project: {
          name: 1,
          profilePhoto: 1,
          bio: 1,
          _id: 1,
          salesCount: 1 // Include salesCount if you want to display it
        }
      }
    ]);

    if (!topDesignersBySales || topDesignersBySales.length === 0) {
      return res.status(404).json({ message: "No featured designers found." });
    }

    res.status(200).json(topDesignersBySales);
  } catch (error) {
    console.error('Error fetching featured designers:', error);
    res.status(500).json({ message: error.message });
  }
};

export const applyDesignerApplication = async (req, res) => {
  const { id } = req.params;
  // Destructure new fields from req.body
  const { message, portfolioLink, yearsExperience, specializations, whyYou } = req.body;

  // ... (existing checks)

  try {
    const user = await User.findById(id);
    // ... (existing role check)

    user.role = 'pending_designer';
    user.designerApplication = {
      message,
      portfolioLink,
      yearsExperience: yearsExperience ? parseInt(yearsExperience) : 0, // Convert to number
      specializations,
      whyYou,
      appliedAt: new Date(),
      status: 'pending'
    };

    const updatedUser = await user.save();
    res.status(200).json({ result: updatedUser, message: "Designer application submitted successfully." });

  } catch (error) {
    console.error("Error submitting designer application:", error);
    res.status(500).json({ message: "Something went wrong during application submission." });
  }
};