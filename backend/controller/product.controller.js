
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


const deleteProduct = async (req, res) => {
    const { id } = req.params;

    // Check if the product ID is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No product with id: ${id}`);
    }

    try {
        // Find and delete the product
        await Product.findByIdAndDelete(id);

        res.json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

const addReview = async (req, res) => {
    const { id } = req.params;
    const { comment, rating } = req.body;
    console.log('hi')

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthenticated" });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No product with that id');
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Check if the user has already reviewed this product
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.userId.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: "Product already reviewed" });
        }
        
        // Create the new review object, including the profilePhoto
        const review = {
            name: req.userName,
            profilePhoto: req.userProfilePhoto, // NEW: Add profile photo
            rating: Number(rating),
            comment,
            user: req.userId,
            createdAt: new Date().toISOString(),
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        
        // Calculate the new average rating
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        const updatedProduct = await product.save();
        
        res.status(201).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
};

export {createProduct,getProductById, getProducts, getProductsBySearch,updateProduct,deleteProduct, getProductsByCategory, getCategories, addReview} 