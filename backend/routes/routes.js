import express from 'express'
// import User from '../models/users.models.js'
import { createUser,getUser,updateUser,deleteUser } from '../controller/user.controller.js';    
const router = express.Router();



router.get("/",(req,res)=>
{
    res.send("!HOME PAGE");
})
router.get("/user",(req,res)=>
{
    res.send("!USER PAGE");
})

router.post('/user',createUser );

router.delete('/user/:id',deleteUser);
router.put('/user/:id',updateUser);
router.get('/user/:name',getUser);

export default router;
