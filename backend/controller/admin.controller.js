// server/controllers/adminController.js
import User from '../models/users.models.js';
import Product from '../models/products.models.js'; // Assuming you have a Product model
import Post from '../models/posts.models.js';     // Assuming you have a Post model
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import { sendEmail } from '../utils/sendEmail.js';

// --- User Management ---
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const limit = parseInt(req.query.limit) || 10; // Items per page, default to 10

    const skipIndex = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skipIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments(); // Get total count for pagination info

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalItems: totalUsers,
      users: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdminUser = async (req, res) => {
  const { name, email, password, role, profilePhoto, bio, socialLinks, location, designerDetails } = req.body;

  try {
    // 1. Check for existing user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // 2. Hash the password before saving (as your model doesn't have pre-save hook for this)
    const hashedPassword = await bcrypt.hash(password, 12); // Use a salt round like 10 or 12

    // 3. Create the new user instance. Mongoose will validate against your schema.
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // Assign the role from the request body (e.g., 'admin', 'designer', 'customer')
      profilePhoto: profilePhoto || '',
      bio: bio || '',
      socialLinks: socialLinks || {},
      location: location || {},
      designerDetails: designerDetails || {},
    });

    // 4. Save the new user to the database
    await newUser.save();

    // 5. Respond with the created user (exclude password for security)
    const userResponse = newUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);

  } catch (error) {
    console.error("Error creating user:", error);
    // Handle validation errors from Mongoose schema or other errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Something went wrong during user creation.' });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No user with id: ${id}` });
  }

  const allowedRoles = ['customer', 'pending_designer', 'designer', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role provided.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminUserPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No user with id: ${id}` });
    }
    if (!newPassword) {
        return res.status(400).json({ message: 'New password is required.' });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword, updatedAt: new Date() },
            { new: true, runValidators: true } // Run schema validators (for password regex)
        ).select('-password'); // Don't return password hash

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user password:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No user with id: ${id}` });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const products = await Product.find()
      .skip(skipIndex)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
      products: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductAdmin = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);
  await Product.findByIdAndDelete(id);
  res.json({ message: "Product deleted successfully." });
};
// Add createProductAdmin, updateProductAdmin functions similarly

// --- Post Management (Example - You'll need Post model and add more CRUD ops) ---
export const getAllPostsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const posts = await Post.find()
      .skip(skipIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalItems: totalPosts,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePostAdmin = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
  await Post.findByIdAndDelete(id);
  res.json({ message: "Post deleted successfully." });
};

export const createAdminProduct = async (req, res) => {
  const productData = req.body;
  const { name, description, price, category, tags, selectedFile } = productData; // Assuming selectedFile is base64

  try {
    // Handle image upload if selectedFile is present (e.g., upload to Cloudinary)
    let imageUrl = '';
    if (selectedFile) {
      // This is a placeholder. You need actual Cloudinary upload logic here.
      // Example: const uploadedResponse = await cloudinary.uploader.upload(selectedFile);
      // imageUrl = uploadedResponse.secure_url;
      console.log("Simulating image upload for product...");
      imageUrl = selectedFile; // For now, just pass base64 if no actual upload
    }

    const newProduct = new Product({
      ...productData,
      creator: req.userId, // Creator ID from auth middleware
      creatorName: req.userName, // Creator Name from auth middleware
      images: imageUrl ? [imageUrl] : [], // Store image URL(s)
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    res.status(500).json({ message: 'Failed to create product.' });
  }
};

export const updateAdminProduct = async (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  const { selectedFile, tags, ...rest } = productData;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);

  try {
    let imageUrl = '';
    if (selectedFile && selectedFile.startsWith('data:image')) { // Only re-upload if it's a new base64 string
      // Placeholder for Cloudinary upload
      console.log("Simulating image re-upload for product...");
      imageUrl = selectedFile; // For now, just pass base64
    } else if (selectedFile) { // If it's already a URL string
        imageUrl = selectedFile;
    }

    const updatedFields = {
      ...rest,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      ...(imageUrl && { images: [imageUrl] }), // Only update images if a new one was provided
      updatedAt: new Date(),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    res.status(500).json({ message: 'Failed to update product.' });
  }
};


// --- Post Management ---
// ... (getAllPostsAdmin, deletePostAdmin)

export const createAdminPost = async (req, res) => {
  const postData = req.body;
  const { title, message, tags, selectedFile } = postData;

  try {
    let imageUrl = '';
    if (selectedFile) {
      // Placeholder for Cloudinary upload
      console.log("Simulating image upload for post...");
      imageUrl = selectedFile; // For now, just pass base64
    }

    const newPost = new Post({
      title,
      message,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      selectedFile: imageUrl, // Store image URL
      creator: req.userId,
      name: req.userName, // Creator name from auth middleware
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    res.status(500).json({ message: 'Failed to create post.' });
  }
};

export const updateAdminPost = async (req, res) => {
  const { id } = req.params;
  const postData = req.body;
  const { selectedFile, tags, ...rest } = postData;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  try {
    let imageUrl = '';
    if (selectedFile && selectedFile.startsWith('data:image')) { // Only re-upload if it's a new base64 string
      // Placeholder for Cloudinary upload
      console.log("Simulating image re-upload for post...");
      imageUrl = selectedFile; // For now, just pass base64
    } else if (selectedFile) { // If it's already a URL string
        imageUrl = selectedFile;
    }

    const updatedFields = {
      ...rest,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      ...(imageUrl && { selectedFile: imageUrl }), // Only update image if a new one was provided
      updatedAt: new Date(),
    };

    const updatedPost = await Post.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
    if (!updatedPost) return res.status(404).json({ message: 'Post not found.' });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    res.status(500).json({ message: 'Failed to update post.' });
  }
};

export const getDesignerApplications = async (req, res) => {
  try {
    // Find users with role 'pending_designer'
    const applications = await User.find({ role: 'pending_designer' })
      .select('name email designerApplication') // Select only necessary fields
      .sort({ 'designerApplication.appliedAt': 1 }); // Sort by application date

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching designer applications:", error);
    res.status(500).json({ message: "Something went wrong fetching applications." });
  }
};

// Approve a designer application
export const approveDesignerApplication = async (req, res) => {
  const { id } = req.params; // Application user ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No user with id: ${id}`);
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ensure the user is currently a pending designer
    if (user.role !== 'pending_designer') {
      return res.status(400).json({ message: "User is not a pending designer." });
    }

    // Update user role to 'designer'
    user.role = 'designer';

    // Transfer relevant application details to designerDetails and set verified
    user.designerDetails = {
      brandName: user.designerApplication?.brandName || '', // Use application data if available
      portfolioUrl: user.designerApplication?.portfolioLink || '', // Use application portfolio link
      verified: true, // Mark as verified upon approval
      salesCount: user.designerDetails?.salesCount || 0, // Keep existing sales count if any
    };

    // Clear designerApplication details after approval (optional, but keeps data clean)
    user.designerApplication = undefined; // Or set to null, or an empty object if schema requires
    
    const updatedUser = await user.save();
    await sendEmail({
      to: user.email,
      subject: "🎉 Your Designer Application Has Been Approved",
      html: `
        <p>Hi ${user.name},</p>
        <p>Congratulations! Your application to become a designer on our platform has been approved.</p>
        <p>You can now access your designer dashboard and start uploading your work.</p>
        <p><a href="https://yourapp.com/designer/dashboard">Go to Dashboard</a></p>
        <br/>
        <p>— The Team</p>
      `,
    });
    // Respond with the updated user (or just a success message)
    res.status(200).json({ message: "Designer approved successfully.", user: updatedUser });

  } catch (error) {
    console.error("Error approving designer application:", error);
    res.status(500).json({ message: "Something went wrong during approval." });
  }
};

// Reject a designer application
export const rejectDesignerApplication = async (req, res) => {
  const { id } = req.params; // Application user ID
  const { reason } = req.body; // Rejection reason from frontend

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No user with id: ${id}`);
  }

  if (!reason || reason.trim() === '') {
    return res.status(400).json({ message: "Rejection reason is required." });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== 'pending_designer') {
      return res.status(400).json({ message: "User is not a pending designer." });
    }

    user.role = 'customer';

    user.designerApplication = {
      ...user.designerApplication, // Keep existing application data
      status: 'rejected',
      reviewedBy: req.userId, // ID of the admin who rejected (from auth middleware)
      reviewedAt: new Date(),
      rejectionReason: reason,
    };

    const updatedUser = await user.save();
    await sendEmail({
      to: user.email,
      subject: "🛑 Your Designer Application Was Not Approved",
      html: `
        <p>Hi ${user.name},</p>
        <p>Thank you for applying to become a designer on our platform.</p>
        <p>Unfortunately, your application was not approved at this time.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>You're welcome to revise and apply again in the future.</p>
        <br/>
        <p>— The Team</p>
      `,
    });
    res.status(200).json({ message: "Designer application rejected successfully.", user: updatedUser });

  } catch (error) {
    console.error("Error rejecting designer application:", error);
    res.status(500).json({ message: "Something went wrong during rejection." });
  }
};