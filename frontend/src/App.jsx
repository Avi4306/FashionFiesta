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
import Community from "./components/Community/Community.jsx";
import StyleDiaries from "./components/StyleDiaries/StyleDiaries.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
import Auth from "./components/Auth/Auth.jsx";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // Dispatch an action to fetch posts or any other initial data
    dispatch(getPosts());
  }, [dispatch]);
  return (<>
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
       }
       />
      <Route path="/style-diaries" element={<StyleDiaries/>} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
    <Footer/>
    </Router>
  </>)
}

export default App;
