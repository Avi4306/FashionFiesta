import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import DesignerProfile from './components/DesignerProfile.jsx';
import StyleDiaries from "./components/StyleDiaries/StyleDiaries.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
import Auth from './components/Auth/Auth.jsx';
import PostDetails from './components/StyleDiaries/Posts/PostDetails/PostDetails.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
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
import AdminDesignerApplications from './components/Admin/AdminDesignerApplications.jsx'; // 🆕 Import the new component
import ImageSearchForm from './components/ImageSearch.jsx';
import { getCart } from './actions/cart';
import ApplyDesignerForm from './components/User/ApplyDesignForm';
import Products from './components/Products/Products.jsx';
import DonateClothes from './components/Donations/DonateClothes.jsx'
import MyDonations from './components/Donations/MyDonations.jsx';
import AdminDonations from './components/Admin/AdminDonationsManagemet.jsx';
import OutfitOfTheWeek from './components/OutfitOfTheWeek/OutfitOfTheWeek.jsx';
import AdminOutfitManagement from './components/Admin/AdminOutfitsManagement.jsx'

function App() {
  // Using useSelector to get authData for consistent role checking
  const authData = useSelector((state) => state.auth.authData);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch cart data if user is logged in
    if (authData?.token) {
      dispatch(getCart(authData?.result?._id));
    }
  }, [dispatch, authData?.token, authData?.result?._id]); // Depend on authData for re-fetch

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
          <Route path="/auth" element={!authData ? <Auth /> : <Navigate to='/' replace />} />

          {/* Style Diaries Routes */}
          <Route path="/style-diaries" element={<StyleDiaries />} />
          <Route path="/style-diaries/search" element={<StyleDiaries />} />
          <Route path="/style-diaries/:id" element={<PostDetails />} />
          <Route path="/designer/:id" element={<DesignerProfile />} />

          {/* About Us Route */}
          <Route path="/aboutus" element={<AboutUs />} />

          {/* User Profile & Details Routes */}
          <Route path="/user/profile" element={<PrivateRoute ><Profile /></PrivateRoute>} />
          <Route path="/user/:id" element={<UserDetails />} /> {/* Publicly viewable user details */}
          <Route path="/user/:id/posts" element={<UserPostsPage />} />
          <Route path="/user/:id/products" element={<UserProductsPage />} />

          {/* Product Routes */}
          <Route path="/products/trending" element={<TrendingStyles />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products/search" element={<SearchPage />} />
          <Route path="/products/category/:category" element={<Products navigateOnCategoryChange={true} />} />
          <Route path="/products/category" element={<Products navigateOnCategoryChange={true} />} />
          <Route path="/donations/donate" element={<DonateClothes />} />
          <Route path="/donations/your-donations" element={<MyDonations />} />

          {/* Cart Route */}
          <Route path="/cart" element={<CartPage />} />

          {/* Featured Designers Route */}
          <Route path="/users/featured-designers" element={<FeaturedDesigners />} />

          <Route path="/outfit-of-the-week" element={<OutfitOfTheWeek />} />

          {/* Image Search Route */}
          <Route path='/search' element={<ImageSearchForm />} />

          {/* --- PROTECTED ROUTES WITH ROLE-BASED ACCESS --- */}

          {/* Apply Designer Page - ONLY accessible to 'customer' role */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/apply-designer" element={<ApplyDesignerForm />} />
          </Route>

          {/* Admin Panel Routes - ONLY accessible to 'admin' role */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/products" element={<AdminProductManagement />} />
            <Route path="/admin/posts" element={<AdminPostManagement />} />
            <Route path="/admin/designer-applications" element={<AdminDesignerApplications />} /> 
            <Route path="/admin/donations" element={<AdminDonations />} /> 
            <Route path="/admin/outfit-of-the-week" element={<AdminOutfitManagement />} /> 
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
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;