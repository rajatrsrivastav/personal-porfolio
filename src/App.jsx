import React, { useState, useEffect } from 'react'
import Lenis from 'lenis'
import CuratedWork from './components/CuratedWork'
import Skills from './components/Skills'
import AboutMe from './components/AboutMe'
import CareerSection from './components/CareerSection'
import GithubSection from './components/GithubSection'
import FinalCta from './components/FinalCta'
import HomeHero from './components/HomeHero'
import Navbar from './components/Navbar'
import ContactModal from './components/ContactModal'
import ContributionsPage from './pages/ContributionsPage'

function App() {
  const [contactOpen, setContactOpen] = useState(false)
  const isContributionsPage = window.location.pathname.replace(/\/+$/, '') === '/contributions'

  useEffect(() => {
    if (isContributionsPage) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [isContributionsPage])

  if (isContributionsPage) return <ContributionsPage />

  return (
    <div>
      <Navbar onOpenContact={() => setContactOpen(true)} />
      <main>
        <HomeHero onOpenContact={() => setContactOpen(true)} />
        <AboutMe />
        <CareerSection />
        <CuratedWork />
        <GithubSection />
        <Skills />
      </main>
      <FinalCta />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}

export default App
