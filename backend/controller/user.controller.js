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
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

export const googleAuth = async (req, res) => {
  const { name, email} = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profilePhoto : '',
        password: null,
        role: 'customer',
        bio: '',
        designerDetails: null,
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
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

export {loginUser, signupUser,getUser,updateUser,deleteUser} 