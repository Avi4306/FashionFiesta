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

        // No changes needed here for Option 1, as 'role' is part of the User model,
        // and 'creator' simply stores the User's ObjectId.
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
        // --- MODIFIED: Populate 'name', 'profilePhoto', AND 'role' from the 'User' model ---
        const product = await Product.findById(req.params.id).populate('creator', 'name profilePhoto role');
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

        // --- MODIFIED: Populate 'name', 'profilePhoto', AND 'role' from the 'User' model ---
        const products = await Product.find(filter)
            .sort(sortOptions[sort] || { createdAt: -1 })
            .skip(skip)
            .limit(numericLimit)
            .populate('creator', 'name profilePhoto role'); // Add 'role' to populate here

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
    // 🆕 Add pagination parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 9; // Default to 9 items per page (you can adjust this)
    const skip = (page - 1) * limit;

    try {
        const titleRegex = new RegExp(searchQuery, 'i'); // Case-insensitive regex for title
        // Split search query by comma for tags, trim each tag, and filter out empty strings
        const searchTags = searchQuery.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        // Build the query filter
        let queryFilter = {
            $or: [
                { title: titleRegex }, // Search by title
            ]
        };

        // If there are valid tags in the search query, add them to the $or condition
        if (searchTags.length > 0) {
            queryFilter.$or.push({ tags: { $in: searchTags } }); // Search by tags
        }

        // 1. Get the total count of products matching the filter (without pagination)
        const totalProducts = await Product.countDocuments(queryFilter);

        // 2. Calculate total pages
        const totalPages = Math.ceil(totalProducts / limit);

        // 3. Find products with pagination, and populate creator info
        const products = await Product.find(queryFilter)
            .populate('creator', 'name profilePhoto role') // Populate 'name', 'profilePhoto', and 'role'
            .skip(skip)   // Skip documents for pagination
            .limit(limit); // Limit documents per page

        // Return paginated data along with metadata
        res.status(200).json({
            data: products,
            currentPage: page,
            totalPages: totalPages,
            totalProducts: totalProducts,
            // You can also include the limit if needed: limit: limit,
        });
    } catch (error) {
        console.error("Error in getProductsBySearch:", error.message); // Log full error
        res.status(404).json({ message: error.message });
    }
};

// Get products by category (for carousel)
const getProductsByCategory = async (req, res) => {
    const { category, limit } = req.query;
    try {
        const query = category ? { category } : {};
        // --- MODIFIED: Populate 'name', 'profilePhoto', AND 'role' from the 'User' model ---
        const products = await Product.find(query)
            .limit(Number(limit) || 10)
            .sort({ createdAt: -1 })
            .populate('creator', 'name profilePhoto role'); // Add 'role' to populate here

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
            const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
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

    if (!req.userName) {
        return res.status(400).json({ message: "Reviewer name is required." });
    }

    // You might also want to include req.userRole in the review if it's relevant,
    // though typically reviews only need name/photo.
    // const reviewerRole = req.userRole;

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
            profilePhoto: req.userProfilePhoto || '', // Using || '' for safety if photo is optional
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
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Something went wrong." });
    }
};

export { createProduct, getProductById, getProducts, getProductsBySearch, updateProduct, deleteProduct, getProductsByCategory, getCategories, addReview }