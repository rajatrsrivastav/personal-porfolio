import React, { useState } from 'react'
import CuratedWork from './components/CuratedWork'
import Skills from './components/Skills'
import AboutMe from './components/AboutMe'
import FinalCta from './components/FinalCta'
import HomeHero from './components/HomeHero'
import Navbar from './components/Navbar'
import ContactModal from './components/ContactModal'

function App() {
  const [contactOpen, setContactOpen] = useState(false)
  return (
    <div>
      <Navbar onOpenContact={() => setContactOpen(true)} />
  <HomeHero onOpenContact={() => setContactOpen(true)} />
      <AboutMe />
      <CuratedWork />
      <Skills/>
      <FinalCta />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}

export default App
