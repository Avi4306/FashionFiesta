import { useState } from 'react'
import './App.css'
import Header from '../components/Header/Header'
import NavBar from '../components//Header/NavBar'
import OOTW from '../components/OOTWsection/OOTW'
import Hero from '../components/Hero/Hero'
// import AnimatedBackground from '../components/TSWave'
import TrendingSection from '../components/TrendingSection'
import BlogSection from '../components/Blog'
import Designers from '../components/Designers'
import Footer from '../components/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {useEffect} from "react";
import { useDispatch } from "react-redux";
import {getPosts} from "./actions/posts";
import Community from "../components/Community/Community.jsx";

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
              <OOTW />
              <TrendingSection />
              <BlogSection />
              <Designers />
            </>
       }
       />
      <Route path="/community" element={<Community />} />
    </Routes>
    <Footer/>
    </Router>
  </>)
}

export default App;
