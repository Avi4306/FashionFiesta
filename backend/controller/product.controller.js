
import mongoose from 'mongoose'
import Product from '../models/products.models.js'

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discount,
      category,
      brand,
      stock,
      sizes,
      colors,
      tags,
      images,
    } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      discount,
      category,
      brand,
      stock,
      sizes,
      colors,
      tags,
      images,
      creator: req.userId,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};


const deleteProduct = ( async(req,res) =>
{
     const {id} = req.params;
     if (!mongoose.Types.ObjectId.isValid(id)) {
       return res.status(404).json({ success: false, message: 'Invalid Product ID' });
     }
     try{
       await Product.findByIdAndDelete(id);
       
       res.status(200).json({ success: true,message:"Product deleted"});

     }
     catch(err)
     {
       console.error(err)
       res.status(404).json({ success: false, message: 'Product not found!' })
     }
});

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('creator', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAllProducts = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 9; // fixed limit per page

  try {
    const startIndex = (Number(page) - 1) * limit;

    const total = await Product.countDocuments({});
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      data: products,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
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

export {createProduct,getProductById, getAllProducts,updateProduct,deleteProduct} 