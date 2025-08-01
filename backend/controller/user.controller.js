<<<<<<< HEAD
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.models.js';
import Post from '../models/posts.models.js';
import Product from '../models/products.models.js';
import Otp from '../models/otp.models.js'; // ✅ Make sure this model exists
import { sendOtpEmail } from '../utils/sendEmail.js';

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: 'User does not exist' });

    if (!existingUser.password)
      return res.status(403).json({ message: 'Use Google login for this account' });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(existingUser);
=======
import mongoose from 'mongoose'
import User from '../models/users.models.js'
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
    console.log(token)
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
<<<<<<< HEAD
};

export const googleAuth = async (req, res) => {
  const { name, email, profilePhoto } = req.body;
=======
}

export const googleAuth = async (req, res) => {
  const { name, email} = req.body;
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
<<<<<<< HEAD
        profilePhoto: profilePhoto || '',
        authProvider: 'google',
=======
        profilePhoto : '',
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
        password: null,
        role: 'customer',
        bio: '',
        designerDetails: null,
<<<<<<< HEAD
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

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
=======
      });
    }

    const token = jwt.sign({ 
      id: user._id,
      email: user.email,
      role: user.role
      }, process.env.JWT_SECRET, { expiresIn: '1d' });
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf

    res.status(200).json({ result: user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

<<<<<<< HEAD
export const requestOtpSignup = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email }); // clear previous OTPs
    await Otp.create({ email, code: otpCode, expiresAt: Date.now() + 10 * 60 * 1000 });

    await sendOtpEmail(email, otpCode);
    console.log(otpCode + "fLTU")
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOtpAndSignup = async (req, res) => {
  const { email, otp, password, confirmPassword, firstName, lastName, profilePhoto } = req.body;
  try {
    console.log(otp)
    const otpEntry = await Otp.findOne({ email, code: otp });
    if (!otpEntry || otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      profilePhoto: profilePhoto || '',
      isVerified: true,
      authProvider: 'local',
      role: 'customer',
    });

    await Otp.deleteMany({ email });

    const token = generateToken(newUser);
    res.status(200).json({ result: newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (req.userId !== user._id.toString()) return res.status(403).json({ message: 'Not authorized.' });

    if (user.authProvider !== 'google') {
      if (!password) return res.status(400).json({ message: 'Password required.' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect password.' });
    }

    await Post.deleteMany({ creator: user._id });
    await Product.deleteMany({ creator: user._id });
    await User.findByIdAndDelete(user._id);

    res.status(200).json({ message: 'Account deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
=======
const signupUser =( async(req, res) => {
  const {email, password, confirmPassword, firstName, lastName} = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser) return res.status(400).json({ message: 'User already exists' });
    
    if(password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
    const token = jwt.sign({ 
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ result, token });
  } catch (error) {
    console.error('Signup error',error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

const deleteUser = ( async(req,res) =>
{
     const {id} = req.params;
     if (!mongoose.Types.ObjectId.isValid(id)) {
       return res.status(404).json({ success: false, message: 'Invalid User ID' });
     }
     try{
       await User.findByIdAndDelete(id);
       res.status(200).json({ success: true,message:"User deleted"});

     }
     catch(err)
     {
       console.error(err)
       res.status(404).json({ success: false, message: 'User not found!' })
     }
});

const getUser = ( async(req,res)=>
{
   const {id} = req.params;

   try{
      
      const user = await User.findById({id}).select(-password);
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
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

<<<<<<< HEAD
export const getUserPosts = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await Post.find({ creator: id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const getUserProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ creator: id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getFeaturedDesigners = async (req, res) => {
    try {
        const topDesignersBySales = await User.aggregate([
            // Stage 1: Find all verified designers
            {
                $match: {
                    role: 'designer',
                    'designerDetails.verified': true
                }
            },
            
            // Stage 2: Join with the products collection
            {
                $lookup: {
                    from: 'products', // Name of the products collection in MongoDB
                    localField: '_id', // The designer's user ID
                    foreignField: 'creator', // The designer ID field on the product
                    as: 'products' // Store the joined products in a new 'products' array field
                }
            },
            
            // Stage 3: Count the number of products for each designer
            {
                $addFields: {
                    salesCount: { $size: '$products' }
                }
            },
            
            // Stage 4: Sort by salesCount in descending order
            {
                $sort: {
                    salesCount: -1
                }
            },
            
            // Stage 5: Limit the results
            {
                $limit: 12
            },
            
            // Stage 6: Project only the fields you need for the frontend
            {
                $project: {
                    name: 1,
                    profilePhoto: 1,
                    bio: 1,
                    _id: 1 // Keep the designer's ID
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
=======
export {loginUser, signupUser,getUser,updateUser,deleteUser} 
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
