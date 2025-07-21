import mongoose from 'mongoose'
import User from '../models/users.models.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if(!existingUser) return res.status(404).json({ message: 'User does not exist' });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if(!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
const signupUser =( async(req, res) => {
  const {email, password, confirmPassword, firstName, lastName} = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser) return res.status(400).json({ message: 'User already exists' });
    
    if(password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
    const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
   const {name} = req.params;

   try{
      
       const user = await User.find({name});
       if(name.length===0)
       {
         return res.status(404).json({message:'User not found'})
       }
        res.status(200).json({success:true,data:user})
   }
   catch(err)
   {
     console.error(err)
       res.status(404).json({ success: false, message: 'User not found!' })
   }
});


const updateUser = ( async(req,res) =>
{
  const {id} = req.params;
  const user = req.body;
  if(!mongoose.Types.ObjectId.isValid(id))
  {
     return res.status(404).json(({ success: false, message: 'invalid user' }))
  }
    try{
          const updatedUser = await User.findByIdAndUpdate(id,user);
          res.status(200).json({ success: true,data:updatedUser})    
    }
    catch(err)
    {
      console.error(err)
      res.status(500).json({success:false,message:"server error"})
    }
})

export {loginUser, signupUser,getUser,updateUser,deleteUser} 