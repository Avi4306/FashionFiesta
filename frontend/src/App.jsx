import { useState } from 'react'
import './App.css'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
import OOTW from '../components/OOTW'
import Hero from '../components/Hero'
// import AnimatedBackground from '../components/TSWave'
import TrendingSection from '../components/TrendingSection'
import BlogSection from '../components/Blog'
import Designers from '../components/Designers'
import Footer from '../components/Footer'
function App() {

  return (<div>
    <Header />
    <NavBar />
    <Hero/>
    <OOTW/>
    <TrendingSection />
    <BlogSection/>
    <Designers/>
    <Footer/>
  </div>)
}

export default App;
