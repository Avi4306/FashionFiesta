import express from 'express'
import { createUser,getUser,updateUser,deleteUser } from '../controller/user.controller.js';    
import { createProduct,getProduct,updateProduct,deleteProduct } from '../controller/product.controller.js';    

const router = express.Router();

router.get("/",(req,res)=>
{
    res.send("!Hii there I'M live You Know");
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




export default router;
