import mongoose from 'mongoose'
import User from '../models/users.models.js'
import Post from '../models/posts.models.js'
import Product from '../models/products.models.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if(!existingUser) return res.status(404).json({ message: 'User does not exist' });
    if (!existingUser.password) {
      return res.status(403).json({ message: "Use Google login for this account" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if(!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ 
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

export const googleAuth = async (req, res) => {
  const { name, email, profilePhoto} = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profilePhoto: profilePhoto || '',
        authProvider :  "google",
        password: null,
        role: 'customer',
        bio: '',
        designerDetails: null,
        socialLinks: {
          instagram: '',
          facebook: '',
          twitter: '',
          website: '',
        },
        location: {
          city: '',
          state: '',
          country: '',
        },
      });
    }

    const token = jwt.sign({ 
      id: user._id,
      email: user.email,
      role: user.role
      }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ result: user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const signupUser =( async(req, res) => {
  const {email, password, confirmPassword, firstName, lastName} = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser) return res.status(400).json({ message: 'User already exists' });
    
    if(password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
    const token = jwt.sign({ 
      id: result._id,
      email: result.email,
      role: result.role,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ result, token });
  } catch (error) {
    console.error('Signup error',error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Ensure the logged-in user is deleting their own account
    if (req.userId !== user._id.toString())
      return res.status(403).json({ message: "Not authorized." });

    // If user signed up with email/password, verify password
    if (user.authProvider !== "google") {
      if (!password) return res.status(400).json({ message: "Password required." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect password." });
    }

    // Delete related data
    await Post.deleteMany({ creator: user._id });
    await Product.deleteMany({ creator: user._id });

    // Delete user
    await User.findByIdAndDelete(user._id);

    res.status(200).json({ message: "Account deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
const getUser = ( async(req,res)=>
{
   const {id} = req.params;

   try{
      
      const user = await User.findById(id).select('-password');
      console.log(user)
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
   }
   catch(err)
   {
      console.error(err)
      res.status(500).json({ message: 'Server error' });
   }
});


const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

// Get posts by user
const getUserPosts = async (req, res) => {
  const { id } = req.params;
  const posts = await Post.find({ creator: id });
  res.json(posts);
};

// Get products by user
const getUserProducts = async (req, res) => {
  const { id } = req.params;
  const products = await Product.find({ creator: id });
  res.json(products);
};


export {loginUser, signupUser,getUser,updateUser,deleteUser, getUserPosts, getUserProducts} 