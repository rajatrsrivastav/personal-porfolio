import React, { useState } from 'react'
import CuratedWork from './components/CuratedWork'
import Skills from './components/Skills'
import AboutMe from './components/AboutMe'
import CareerSection from './components/CareerSection'
import GithubSection from './components/GithubSection'
import FinalCta from './components/FinalCta'
import HomeHero from './components/HomeHero'
import Navbar from './components/Navbar'
import ContactModal from './components/ContactModal'
import ContributionsPage from './site-pages/ContributionsPage'
import FixedHangingDeadpool from './components/FixedHangingDeadpool'
import BlogSection from './components/BlogSection.tsx'
import AdminPage from './site-pages/AdminPage'
import BlogPage from './site-pages/BlogPage'
import BlogPostPage from './site-pages/BlogPostPage'

function App() {
  const [contactOpen, setContactOpen] = useState(false)
  const isContributionsPage = window.location.pathname.replace(/\/+$/, '') === '/contributions'
  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
  const isBlogPage = normalizedPath === '/blog'
  const blogPostMatch = normalizedPath.match(/^\/blog\/([^/]+)$/)

  if (normalizedPath === "/admin") return <AdminPage />

  if (isContributionsPage) {
    return (
      <>
        <ContributionsPage />
      </>
    )
  }

  if (isBlogPage || blogPostMatch) {
    return (
      <>
        {isBlogPage ? <BlogPage /> : <BlogPostPage slug={decodeURIComponent(blogPostMatch[1])} />}
      </>
    )
  }

  return (
    <div>
      <FixedHangingDeadpool />
      <Navbar onOpenContact={() => setContactOpen(true)} />
      <main>
        <HomeHero onOpenContact={() => setContactOpen(true)} />
        <AboutMe />
        <CareerSection />
        <CuratedWork />
        <BlogSection />
        <GithubSection />
        <Skills />
      </main>
      <FinalCta />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}

export default App
