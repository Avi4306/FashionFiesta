
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
    console.log(newProduct)
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

const getProducts = async (req, res) => {
  try {
    const { category, page = 1, limit = 12, sort = "newest" } = req.query;

    const numericPage = parseInt(page, 10);
    const numericLimit = parseInt(limit, 10);

    const filter = category ? { category } : {};
    const skip = (numericPage - 1) * numericLimit;

    const sortOptions = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(numericLimit);
    res.json({
      products,
      currentPage: numericPage,
      totalPages: Math.ceil(totalProducts / numericLimit),
      totalProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductsBySearch = async (req, res) => {
    const { searchQuery } = req.query;

    try {
        // Create a case-insensitive regex for the search term
        const title = new RegExp(searchQuery, 'i');
        
        // Find products that match the title OR tags.
        const products = await Product.find({ 
            $or: [{ title }, { tags: { $in: searchQuery.split(',') } }] 
        });

        res.status(200).json({ data: products });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get products by category (for carousel)
const getProductsByCategory = async (req, res) => {
  const { category, limit } = req.query;
  try {
    const query = category ? { category } : {};
    const products = await Product.find(query)
      .limit(Number(limit) || 10)
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get distinct categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

export {createProduct,getProductById, getProducts, getProductsBySearch,updateProduct,deleteProduct, getProductsByCategory, getCategories} 