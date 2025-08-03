// server/controllers/adminController.js
import User from '../models/users.models.js';
import Product from '../models/products.models.js';     // Assuming you have a Product model
import Post from '../models/posts.models.js';         // Assuming you have a Post model
import Donation from '../models/donation.model.js'; // New: Import the Donation model
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import { sendEmail } from '../utils/sendEmail.js';
import Outfit from '../models/outfit.model.js'; // Adjust the path as necessary


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

        // 2. Hash the password before saving
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

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
        res.status(500).json({ message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No user with id: ${id}` });
        }

        const allowedRoles = ['customer', 'pending_designer', 'designer', 'admin'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role provided.' });
        }

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

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No user with id: ${id}` });
        }
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required.' });
        }

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
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No user with id: ${id}` });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Product Management ---
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
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No product with id: ${id}` });
        }
        await Product.findByIdAndDelete(id);
        res.json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createAdminProduct = async (req, res) => {
    const productData = req.body;
    const { tags, selectedFile, name } = productData;

    try {
        let imageUrl = '';
        if (selectedFile) {
            console.log("Simulating image upload for product...");
            imageUrl = selectedFile;
        }

        const newProduct = new Product({
            ...productData,
            title : name,
            creator: req.userId,
            creatorName: req.userName,
            images: imageUrl ? [imageUrl] : [],
            tags: tags
        });
        delete newProduct.name
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAdminProduct = async (req, res) => {
    const { id } = req.params;
    const productData = req.body;
    const { selectedFile, tags, ...rest } = productData;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No product with id: ${id}` });
        }

        let imageUrl = '';
        if (selectedFile && selectedFile.startsWith('data:image')) {
            console.log("Simulating image re-upload for product...");
            imageUrl = selectedFile;
        } else if (selectedFile) {
            imageUrl = selectedFile;
        }

        const updatedFields = {
            ...rest,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            ...(imageUrl && { images: [imageUrl] }),
            updatedAt: new Date(),
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Post Management ---
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
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No post with id: ${id}` });
        }
        await Post.findByIdAndDelete(id);
        res.json({ message: "Post deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createAdminPost = async (req, res) => {
    const postData = req.body;
    console.log(postData)
    const { tags, selectedFile, message } = postData;

    try {
        let imageUrl = '';
        if (selectedFile) {
            console.log("Simulating image upload for post...");
            imageUrl = selectedFile;
        }

        const newPost = new Post({
            ...postData,
            content : message,
            selectedFile: imageUrl,
            creator: req.userId,
            name: req.userName,
            tags
        });
        delete newPost.message
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAdminPost = async (req, res) => {
    const { id } = req.params;
    const postData = req.body;
    const { selectedFile, tags, ...rest } = postData;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No post with id: ${id}` });
        }

        let imageUrl = '';
        if (selectedFile && selectedFile.startsWith('data:image')) {
            console.log("Simulating image re-upload for post...");
            imageUrl = selectedFile;
        } else if (selectedFile) {
            imageUrl = selectedFile;
        }

        const updatedFields = {
            ...rest,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            ...(imageUrl && { selectedFile: imageUrl }),
            updatedAt: new Date(),
        };

        const updatedPost = await Post.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Designer Application Routes ---
export const getDesignerApplications = async (req, res) => {
    try {
        const applications = await User.find({ role: 'pending_designer' })
            .select('name email designerApplication')
            .sort({ 'designerApplication.appliedAt': 1 });

        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching designer applications:", error);
        res.status(500).json({ message: "Something went wrong fetching applications." });
    }
};

export const approveDesignerApplication = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No user with id: ${id}` });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role !== 'pending_designer') {
            return res.status(400).json({ message: "User is not a pending designer." });
        }

        user.role = 'designer';
        user.designerDetails = {
            brandName: user.designerApplication?.brandName || '',
            portfolioUrl: user.designerApplication?.portfolioLink || '',
            verified: true,
            salesCount: user.designerDetails?.salesCount || 0,
        };
        user.designerApplication = undefined;

        const updatedUser = await user.save();
        await sendEmail({
            to: user.email,
            subject: "🎉 Your Designer Application Has Been Approved",
            html: `
                <p>Hi ${updatedUser.name},</p>
                <p>Congratulations! We are thrilled to inform you that your application to become a <strong>designer</strong> on our platform has been <strong>approved</strong>!</p>
                <p>Your role has been updated. You can now log in and start exploring your opportunities.</p>
                <p>Explore the <a href="${process.env.FRONTEND_URL}/">home page</a> to begin your journey with Fashion Fiesta.</p>
                <br/>
                <p>Best regards,</p>
                <p>The Fashion Fiesta Team</p>
            `,
        });
        res.status(200).json({ message: "Designer approved successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error approving designer application:", error);
        res.status(500).json({ message: "Something went wrong during approval." });
    }
};

export const rejectDesignerApplication = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No user with id: ${id}` });
        }
        if (!reason || reason.trim() === '') {
            return res.status(400).json({ message: "Rejection reason is required." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role !== 'pending_designer') {
            return res.status(400).json({ message: "User is not a pending designer." });
        }

        user.role = 'customer';
        user.designerApplication = {
            ...user.designerApplication,
            status: 'rejected',
            reviewedBy: req.userId,
            reviewedAt: new Date(),
            rejectionReason: reason,
        };

        const updatedUser = await user.save();
        await sendEmail({
            to: user.email,
            subject: "🛑 Your Designer Application Was Not Approved",
            html: `
                <p>Dear ${updatedUser.name},</p>
                <p>Thank you for your interest in becoming a designer on our platform.</p>
                <p>After careful consideration, we regret to inform you that your application has been <strong>rejected</strong> at this time.</p>
                ${reason ? `<p><strong>Reason for rejection:</strong> ${reason}</p>` : ''}
                <p>We appreciate you taking the time to apply.</p>
                <p>Best regards,</p>
                <p>The Fashion Fiesta Team</p>
            `,
        });
        res.status(200).json({ message: "Designer application rejected successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error rejecting designer application:", error);
        res.status(500).json({ message: "Something went wrong during rejection." });
    }
};

// --- Donation Management ---
export const getAllDonationsAdmin = async (req, res) => {
    try {
        // 1. Get pagination parameters from the query string with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;

        // 2. Count the total number of documents for pagination metadata
        const totalItems = await Donation.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        // 3. Find donations with pagination and sorting
        const donations = await Donation.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skipIndex);

        // 4. Return the data along with pagination information
        res.json({
            donations,
            currentPage: page,
            totalPages,
            totalItems
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDonationStatus = async (req, res) => {
    try {
        // Find the donation and populate the user data in a single step
        const donation = await Donation.findById(req.params.id).populate('user', 'name email');

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (req.body.status) {
            const oldStatus = donation.status;
            const newStatus = req.body.status;
            donation.status = newStatus;

            // Only send an email if the status has actually changed
            if (oldStatus !== newStatus) {
                // Save the updated donation first
                const updatedDonation = await donation.save();
                
                // Then, send the email
                await sendEmail({
                    to: donation.user.email,
                    subject: `Your Donation Status Has Been Updated to "${newStatus}"`,
                    html: `
                        <p>Hi ${donation.user.name},</p>
                        <p>This is an update regarding your donation request on our platform. The status of your donation has been changed to <strong>${newStatus}</strong>.</p>
                        <p>Thank you for your support!</p>
                        <br/>
                        <p>Best regards,</p>
                        <p>The Fashion Fiesta Team</p>
                    `,
                });
                return res.json(updatedDonation);
            }
        }

        // If no status was provided or the status didn't change, just return the existing donation
        res.json(donation);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDonationAdmin = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        await donation.deleteOne();
        res.json({ message: 'Donation removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOutfitsAdmin = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalOutfits = await Outfit.countDocuments();
    const outfits = await Outfit.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      outfits,
      totalPages: Math.ceil(totalOutfits / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAdminOutfit = async (req, res) => {
  try {
    const { imageUrl, description, submittedBy, creatorName } = req.body;
    console.log(req.body)

    if (!imageUrl || !description || !submittedBy || !creatorName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newOutfit = new Outfit({
      imageUrl,
      description,
      submittedBy,
      creatorName,
      likes: [],
    });

    await newOutfit.save();
    res.status(201).json(newOutfit);
  } catch (error) {
    console.error('Error creating outfit:', error);
    res.status(500).json({ message: 'Failed to create outfit.' });
  }
};

export const deleteOutfitAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: `No outfit found with ID: ${id}` });
        }

        const outfit = await Outfit.findById(id);
        if (!outfit) {
            return res.status(404).json({ message: 'Outfit not found' });
        }

        await outfit.deleteOne();
        res.status(200).json({ message: 'Outfit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};