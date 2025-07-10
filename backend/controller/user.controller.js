import mongoose from 'mongoose'
import User from '../models/users.models.js'

const createUser =( async(req, res) => {
  const user = req.body;
  
  if(!user.name || !user.email || !user.password) {
    return res.status(400).json({ success: false ,message: 'Name and price are required' });
  }
  const newUser = new User(user);
  try {
    await newUser.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

const deleteUser = ( async(req,res) =>
{
     const {id} = req.params;
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

export {createUser,getUser,updateUser,deleteUser} 