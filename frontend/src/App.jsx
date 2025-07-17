import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import NavBar from './components//Header/NavBar'
import OOTW from './components/OOTWsection/OOTW'
import Hero from './components/Hero/Hero'
import Quotes from './components/quotes/quotescard.jsx'
import TrendingSection from './components/Categories/TrendingSection'
import Header from './components/Header/Header.jsx'
import NavBar from './components/Header/NavBar.jsx'
import OOTW from './components/OOTWsection/OOTW.jsx'
import Hero from './components/Hero/Hero.jsx'
// import AnimatedBackground from '../components/TSWave'
import TrendingSection from './components/Categories/TrendingSection.jsx'
import BlogSection from './components/Blog/Blog.jsx'
import Designers from './components/Designer/Designers.jsx'
import Footer from './components/Footer/Footer.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {useEffect} from "react";
import { useDispatch } from "react-redux";
import {getPosts} from "./actions/posts";
import Community from "./components/Community/Community.jsx";
import StyleDiaries from "./components/StyleDiaries/StyleDiaries.jsx";

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
    </Routes>
    <Footer/>
    </Router>
  </>)
}

export default App;
