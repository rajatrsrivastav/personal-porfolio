'use client';

import { useState } from 'react';
import CuratedWork from '../src/components/CuratedWork';
import Skills from '../src/components/Skills';
import AboutMe from '../src/components/AboutMe';
import CareerSection from '../src/components/CareerSection';
import GithubSection from '../src/components/GithubSection';
import FinalCta from '../src/components/FinalCta';
import HomeHero from '../src/components/HomeHero';
import Navbar from '../src/components/Navbar';
import ContactModal from '../src/components/ContactModal';
import FixedHangingDeadpool from '../src/components/FixedHangingDeadpool';
import BlogSection from '../src/components/BlogSection';
import DogpoolPet from '../src/components/DogpoolPet';

export default function HomePage() {
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = () => setContactOpen(true);
  return <><a className="skip-link" href="#main-content">Skip to content</a><FixedHangingDeadpool /><Navbar /><main id="main-content"><HomeHero onOpenContact={openContact} /><AboutMe /><CareerSection /><CuratedWork /><BlogSection /><GithubSection /><Skills /></main><FinalCta onOpenContact={openContact} /><ContactModal open={contactOpen} onClose={() => setContactOpen(false)} /><DogpoolPet /></>;
}
