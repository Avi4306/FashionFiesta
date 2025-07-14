import { useState } from 'react'
import './App.css'
import Header from '../components/Header/Header'
import NavBar from '../components//Header/NavBar'
import OOTW from '../components/OOTWsection/OOTW'
import Hero from '../components/Hero/Hero'
// import AnimatedBackground from '../components/TSWave'
import TrendingSection from '../components/Categories/TrendingSection'
import BlogSection from '../components/Blog/Blog'
import Designers from '../components/Designer/Designers'
import Footer from '../components/Footer/Footer'

function App() {
  return (<>
    <Header />
    <NavBar />
    <Hero/>
    <OOTW/>
    <TrendingSection />
    <BlogSection/>
    <Designers/>
    <Footer/>
  </>)
}

export default App;
