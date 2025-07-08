import express from 'express'
import User from '../models/users.models.js'
const router = express.Router();


router.get("/",(req,res)=>
{
    res.send("!HOME PAGE");
})
router.get("/user",(req,res)=>
{
    res.send("!USER PAGE");
})

router.post('/user', async (req, res) => {
  const user = req.body;
  
  if(!user.name || !user.email || !user.password) {
    return res.status(400).json({ success: false ,message: 'Name and price are required' });
  }
  const newUser = new User(user);
  console.log(user.name,user.email,user.password)
  try {
    await newUser.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;