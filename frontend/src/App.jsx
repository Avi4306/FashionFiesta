import { useState, useEffect } from 'react'; // Keep useState if you use it elsewhere
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css'; // Your main CSS file
import Header from './components/Header/Header';
import NavBar from './components/Header/NavBar';
import OOTW from './components/OOTWsection/OOTW';
import Hero from './components/Hero/Hero';
import Quotes from './components/quotes/quotescard.jsx';
import TrendingSection from './components/Categories/TrendingSection';
import BlogSection from './components/Blog/Blog.jsx';
import Designers from './components/Designer/Designers.jsx';
import Footer from './components/Footer/Footer.jsx';

import { getPosts } from "./actions/posts"; // Your existing action
import StyleDiaries from "./components/StyleDiaries/StyleDiaries.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
import Auth from './components/Auth/Auth.jsx';
import PostDetails from './components/StyleDiaries/Posts/PostDetails/PostDetails.jsx';
import PrivateRoute from './components/PrivateRoute.jsx'; // Your existing PrivateRoute
import Profile from './components/User/Profile.jsx';
import UserDetails from './components/User/UserDetails.jsx';
import TrendingStyles from './components/TrendingStyles/TrendingStyles.jsx';
import ProductDetails from './components/Products/Product/ProductDetails.jsx';
import CartPage from './components/CartPage.jsx';
import SearchPage from './components/SearchPage.jsx';
import FeaturedDesigners from './components/FeaturedDesigners.jsx';
import UserPostsPage from './components/User/UserPostsPage.jsx';
import UserProductsPage from './components/User/UserProductsPage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // The role-based protected route component
import AdminDashboard from './components/Admin/AdminDashboard.jsx'; // Admin Dashboard component
import AdminUserManagement from './components/Admin/AdminUserManagement.jsx'; // Admin User Management
import AdminProductManagement from './components/Admin/AdminProductManagement.jsx'; // Admin Product Management
import AdminPostManagement from './components/Admin/AdminPostManagement.jsx'; // Admin Post Management
import ImageSearchForm from './components/ImageSearch.jsx';

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile')); // Keep this for the Auth redirect logic

  useEffect(() => {
    // Dispatch an action to fetch posts or any other initial data
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Header />
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Quotes />
                <OOTW />
                <Quotes />
                <TrendingSection />
                <BlogSection />
                <Designers />
                <Quotes />
              </>
            }
          />

          {/* Authentication Route: Redirects if user is already logged in */}
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to='/' replace />} />

          {/* Style Diaries Routes */}
          <Route path="/style-diaries" element={<StyleDiaries />} />
          <Route path="/style-diaries/search" element={<StyleDiaries />} /> {/* Consider if this should be a separate component */}
          <Route path="/style-diaries/:id" element={<PostDetails />} />

          {/* About Us Route */}
          <Route path="/aboutus" element={<AboutUs />} />

          {/* User Profile & Details Routes */}
          <Route path="/user/:id" element={<UserDetails />} />
          <Route path="/user/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> {/* Your existing PrivateRoute */}
          <Route path="/user/:id/posts" element={<UserPostsPage />} />
          <Route path="/user/:id/products" element={<UserProductsPage />} />

          {/* Product Routes */}
          <Route path="/products/trending" element={<TrendingStyles />} />
          <Route path="/products/:id" element={<ProductDetails />} /> {/* Single route for product details */}
          <Route path="/products/search" element={<SearchPage />} />

          {/* Cart Route */}
          <Route path="/cart" element={<CartPage />} />

          {/* Featured Designers Route */}
          <Route path="/users/featured-designers" element={<FeaturedDesigners />} />

          {/* --- NEW ADMIN PANEL ROUTES --- */}
          {/* These routes are protected by the ProtectedRoute component, allowing only 'admin' role */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/products" element={<AdminProductManagement />} />
            <Route path="/admin/posts" element={<AdminPostManagement />} />
            {/* Add more specific admin routes here as you build them */}
          </Route>

          {/* Unauthorized Access Page */}
          <Route path="/unauthorized" element={
            <div style={{ textAlign: 'center', padding: '50px', color: '#dc2626' }}>
              <h1>403 - Forbidden</h1>
              <p>You do not have permission to access this page.</p>
              <p><Link to="/" style={{ color: '#44403c', textDecoration: 'underline' }}>Go to Home</Link></p>
            </div>
          } />

          {/* Catch-all for undefined routes (404 Page) */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '50px', color: '#78716c' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
              <p><Link to="/" style={{ color: '#44403c', textDecoration: 'underline' }}>Go to Home</Link></p>
            </div>
          } />
          <Route path='/search' element = {<ImageSearchForm/>}/>
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;