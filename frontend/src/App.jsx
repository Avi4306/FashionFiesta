import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import NavBar from './components//Header/NavBar'
import OOTW from './components/OOTWsection/OOTW'
import Hero from './components/Hero/Hero'
import Quotes from './components/quotes/quotescard.jsx'
import TrendingSection from './components/Categories/TrendingSection'
import BlogSection from './components/Blog/Blog.jsx'
import Designers from './components/Designer/Designers.jsx'
import Footer from './components/Footer/Footer.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useEffect} from "react";
import { useDispatch } from "react-redux";
import {getPosts} from "./actions/posts";
import StyleDiaries from "./components/StyleDiaries/StyleDiaries.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
import Auth from './components/Auth/Auth.jsx';
import PostDetails from './components/StyleDiaries/Posts/PostDetails/PostDetails.jsx';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.jsx'
import Profile from './components/User/Profile.jsx'
<<<<<<< HEAD
import UserDetails from './components/User/UserDetails.jsx'
import TrendingStyles from './components/TrendingStyles/TrendingStyles.jsx'
import ProductDetails from './components/Products/Product/ProductDetails.jsx'
import CartPage from './components/CartPage.jsx'
import SearchPage from './components/SearchPage.jsx'
import FeaturedDesigners from './components/FeaturedDesigners.jsx'
import UserPostsPage from './components/User/UserPostsPage.jsx'
import UserProductsPage from './components/User/UserProductsPage.jsx'
import CircleAnimations from './components/Animations/circleanimation.jsx';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dispatch an action to fetch posts or any other initial data
    dispatch(getPosts());

    // Set a delay before showing main content
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // show animation for 3 sec

    return () => clearTimeout(timer);
  }, [dispatch]);

  const user = JSON.parse(localStorage.getItem('profile'));

  return (<>
    {loading ? (
        <div className = "h-screen w-full flex items-center justify-center">
          <CircleAnimations />
        </div>
    ) : (
=======

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // Dispatch an action to fetch posts or any other initial data
    dispatch(getPosts());
  }, [dispatch]);
  const user = JSON.parse(localStorage.getItem('profile'));
  return (<>
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    <Router>
    <Header />
    <NavBar />
    <Routes>
      <Route path="/" element={
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
<<<<<<< HEAD
      }
      />
=======
       }
       />
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
      <Route path="/auth" element={!user ? <Auth/> : <Navigate to='/' replace />} />
      <Route path="/style-diaries" element={<StyleDiaries/>} />
      <Route path="/style-diaries/search" element={<StyleDiaries/>} />
      <Route path="/style-diaries/:id" element={<PostDetails/>} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/auth" element={<Auth />} />
<<<<<<< HEAD
      <Route path="/user/:id" element={<UserDetails />} />
      <Route path="/user/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/products/trending" element={<TrendingStyles/>} />
      <Route path="/products/:id" element={<ProductDetails/>} />
      <Route path="/products/:id" element={<ProductDetails/>} />
      <Route path="/products/search" element={<SearchPage/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/users/featured-designers" element={<FeaturedDesigners />} />
      <Route path="/user/:id/posts" element={<UserPostsPage />} />
      <Route path="/user/:id/products" element={<UserProductsPage />} />
    </Routes>
    <Footer/>
    </Router>
    )}
  </>);
=======
      {/* <Route path="/user" element={<UserDetails />} /> */}
      <Route path="/user/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    </Routes>
    <Footer/>
    </Router>
  </>)
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
}

export default App;
