import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css';

// Component Imports (truncated for brevity, assume all are correctly imported)
import Header from './components/Header/Header';
import NavBar from './components/Header/NavBar';
import OOTW from './components/OOTWsection/OOTW';
import Hero from './components/Hero/Hero';
import Quotes from './components/quotes/quotescard.jsx';
import TrendingSection from './components/Categories/TrendingSection';
import BlogSection from './components/Blog/Blog.jsx';
import Designers from './components/Designer/Designers.jsx';
import Footer from './components/Footer/Footer.jsx';
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
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';
import AdminUserManagement from './components/Admin/AdminUserManagement.jsx';
import AdminProductManagement from './components/Admin/AdminProductManagement.jsx';
import AdminPostManagement from './components/Admin/AdminPostManagement.jsx';
import ImageSearchForm from './components/ImageSearch.jsx';

// Import cart actions
import { getCart, mergeLocalCart, clearCart } from './actions/cart'; // Keep clearCart import

function App() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const isLoggedIn = !!auth.authData?.token;

  const mergeAttemptedRef = useRef(false);

  // useEffect for initial cart loading and merging
  useEffect(() => {
    const localCartData = localStorage.getItem('cart');
    const localCart = localCartData ? JSON.parse(localCartData) : { items: [] };

    if (isLoggedIn) {
      if (localCart.items.length > 0 && !mergeAttemptedRef.current) {
        console.log("Logged in: Local cart found. Attempting to merge with server cart.");
        dispatch(mergeLocalCart(localCart.items));
        mergeAttemptedRef.current = true;
      } else {
        console.log("Logged in: Fetching cart from server.");
        dispatch(getCart(auth.authData?.result?._id));
      }
    } else {
      console.log("Guest user: Loading cart from local storage.");
      dispatch(getCart());
      mergeAttemptedRef.current = false;
    }
  }, [isLoggedIn, auth.authData?.result?._id, dispatch]);

  // Separate useEffect to ensure local storage is cleared on logout
  useEffect(() => {
    if (!isLoggedIn) {
      mergeAttemptedRef.current = false;
      localStorage.removeItem('cart');
      // ✅ FIX: Call the clearCart action creator function
      dispatch(clearCart());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Header />
        <NavBar />
        <Routes>
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

          <Route path="/auth" element={!isLoggedIn ? <Auth /> : <Navigate to='/' replace />} />

          <Route path="/style-diaries" element={<StyleDiaries />} />
          <Route path="/style-diaries/search" element={<StyleDiaries />} />
          <Route path="/style-diaries/:id" element={<PostDetails />} />

          <Route path="/aboutus" element={<AboutUs />} />

          <Route path="/user/:id" element={<UserDetails />} />
          <Route path="/user/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/user/:id/posts" element={<UserPostsPage />} />
          <Route path="/user/:id/products" element={<UserProductsPage />} />

          <Route path="/products/trending" element={<TrendingStyles />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products/search" element={<SearchPage />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/users/featured-designers" element={<FeaturedDesigners />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/products" element={<AdminProductManagement />} />
            <Route path="/admin/posts" element={<AdminPostManagement />} />
          </Route>

          <Route path="/unauthorized" element={
            <div style={{ textAlign: 'center', padding: '50px', color: '#dc2626' }}>
              <h1>403 - Forbidden</h1>
              <p>You do not have permission to access this page.</p>
              <p><Link to="/" style={{ color: '#44403c', textDecoration: 'underline' }}>Go to Home</Link></p>
            </div>
          } />

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