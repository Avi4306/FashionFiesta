import express from 'express'
import { createUser,getUser,updateUser,deleteUser } from '../controller/user.controller.js';    
import { createProduct,getProduct,updateProduct,deleteProduct } from '../controller/product.controller.js';  
import axios from 'axios';  

const router = express.Router();

router.get("/",(req,res)=>
{
    res.send("!Hii there noob I'M live You Know");
})
router.get("/user",(req,res)=>
{
    res.send("!USER PAGE");
})

router.post('/user',createUser );

router.delete('/user/:id',deleteUser);
router.put('/user/:id',updateUser);
router.get('/user/:name',getUser);


router.post('/product',createProduct);

router.delete('/product/:id',deleteProduct);
router.put('/product/:id',updateProduct);
router.get('/product/:name',getProduct);

router.post('/recommend/:id',async (req,res)=>{

    const {id} = req.body

     try {
    const response = await axios.post('http://localhost:5000/recommend', { id });
    res.json(response.data);
  } catch (error) {
    console.error('Flask error:', error.message);
    res.status(500).json({ error: 'Recommendation failed' });
  }
});





export default router;
