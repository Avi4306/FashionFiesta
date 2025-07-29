// server/routes/adminRoutes.js
import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import {
  getAllUsers,
  createAdminUser, // New controller for creating users
  updateUserRole,
  updateAdminUserPassword, // New controller for updating passwords
  deleteUser,
  getAllProductsAdmin,
  deleteProductAdmin,
  getAllPostsAdmin,
  deletePostAdmin,
  createAdminPost,
  updateAdminPost,
  createAdminProduct,
  updateAdminProduct
} from '../controller/admin.controller.js';

const adminRouter = express.Router();

// Apply authentication and admin role authorization to all routes in this adminRouter
adminRouter.use(auth); // 1. Authenticate the user (verify token)
adminRouter.use(authorizeRoles('admin')); // 2. Authorize: Only allow users with 'admin' role

// User Management Routes
adminRouter.get('/users', getAllUsers);
adminRouter.post('/users', createAdminUser); // Route to create new user (admin can assign role)
adminRouter.patch('/users/:id/role', updateUserRole); // Update user's role
adminRouter.patch('/users/:id/password', updateAdminUserPassword); // Update user's password
adminRouter.delete('/users/:id', deleteUser); // Delete user

// Product Management Routes
adminRouter.get('/products', getAllProductsAdmin);
adminRouter.delete('/products/:id', deleteProductAdmin);
adminRouter.post('/products', createAdminProduct);
adminRouter.patch('/products/:id', updateAdminProduct);

// Post Management Routes
adminRouter.get('/posts', getAllPostsAdmin);
adminRouter.delete('/posts/:id', deletePostAdmin);
adminRouter.post('/posts', createAdminPost);
adminRouter.patch('/posts/:id', updateAdminPost);

export default adminRouter;