import React, { useState, useEffect, useRef } from 'react'
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
  const lenisRef = useRef(null)
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
    lenisRef.current = lenis

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isContributionsPage])

  useEffect(() => {
    if (!lenisRef.current) return
    if (contactOpen) {
      lenisRef.current.stop()
    } else {
      lenisRef.current.start()
    }
  }, [contactOpen])

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
