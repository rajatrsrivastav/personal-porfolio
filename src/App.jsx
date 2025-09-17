import React from 'react'
import CuratedWork from './components/CuratedWork'
import Skills from './components/Skills'
import AboutMe from './components/AboutMe'
import FinalCta from './components/FinalCta'
import HomeHero from './components/HomeHero'
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      <HomeHero />
      <AboutMe />
      <CuratedWork />
      <Skills/>
      <FinalCta />
    </div>
  )
}

export default App
