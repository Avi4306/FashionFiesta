
import mongoose from 'mongoose'
import Product from '../models/products.models.js'

const createProduct =( async(req, res) => {
  const product = req.body;
  
  if(!product.name || !product.price || !product.category || !product.stock || !product.images) {
    return res.status(400).json({ success: false ,message: 'Name and price are required' });
  }
  const newProduct = new Product(product);
  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

const deleteProduct = ( async(req,res) =>
{
     const {id} = req.params;
     try{
       await Product.findByIdAndDelete(id);
       res.status(200).json({ success: true,message:"Product deleted"});

     }
     catch(err)
     {
       console.error(err)
       res.status(404).json({ success: false, message: 'User not found!' })
     }
});

const getProduct = async (req, res) => {
  const { name } = req.params;

  try {
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Invalid product name' });
    }

    const product = await Product.find({ name });

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const updateProduct = ( async(req,res) =>
{
  const {id} = req.params;
  const product = req.body;
  if(!mongoose.Types.ObjectId.isValid(id))
  {
     return res.status(404).json(({ success: false, message: 'invalid Product' }))
  }
    try{
          const updatedProduct = await Product.findByIdAndUpdate(id,product);
          res.status(200).json({ success: true,data:updatedProduct})    
    }
    catch(err)
    {
      console.error(err)
      res.status(500).json({success:false,message:"server error"})
    }
})

export {createProduct,getProduct,updateProduct,deleteProduct} 