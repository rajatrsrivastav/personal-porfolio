'use client';

import React, { useState } from "react";
import Image from 'next/image';
import { useLenis } from 'lenis/react';
import { Github, Linkedin, Mail, MapPin, ArrowUpRight, ArrowUp, Check } from "lucide-react";
function XLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#work" },
  { label: "Activity", href: "#activity" },
  { label: "Skills", href: "#skills" },
];

export default function FinalCta() {
  const lenis = useLenis();
  const currentYear = new Date().getFullYear();
  const email = "rajatrsrivastav810@gmail.com";
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (lenis && !reducedMotion) lenis.scrollTo(el, { offset: -96, duration: 1.05, easing: t => 1 - Math.pow(1 - t, 4) });
      else el.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lenis && !reducedMotion) lenis.scrollTo(0, { duration: 0.9, easing: t => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  };

  return (
    <footer className="footer" role="contentinfo" id="contact">
      <div className="footer-container">
        {/* Left Column: Brand & Bio */}
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <Image className="footer-logo" src="/logo.png" width={56} height={56} alt="Rajat Srivastav" />
            </div>
            <div className="footer-info">
              <h3 className="footer-name">Rajat Srivastav</h3>
              <p className="footer-role">Full-Stack Engineer</p>
            </div>
          </div>

          <p className="footer-tagline">
            Building seamless digital experiences from{" "}
            <span className="whitespace-nowrap">real&#8209;world</span> challenges.
          </p>

          <div className="footer-location">
            <MapPin size={14} className="location-pin" />
            <span>Mumbai, India</span>
            {/* <span className="footer-status-pill">
              <span className="footer-status-dot" />
              <span>Available</span>
            </span> */}
          </div>
        </div>

        {/* Center Column: Navigation */}
        <nav className="footer-nav" aria-label="Footer navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="footer-nav-link"
            >
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Column: Social & Contact */}
        <div className="footer-connect">
          <div className="footer-socials">
            <a
              href="https://www.linkedin.com/in/rajatrsrivastav/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="social-link"
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://github.com/rajatrsrivastav"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="social-link"
              title="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://x.com/rajatrsrivastav"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter) profile"
              className="social-link"
              title="X"
            >
              <XLogo size={17} />
            </a>
          </div>

          {/* Email button with copy & mailto */}
          <a
            href={`mailto:${email}`}
            onClick={handleCopyEmail}
            className={`footer-email ${copied ? "is-copied" : ""}`}
            title="Click to copy email address"
          >
            {copied ? (
              <Check size={14} className="email-icon text-emerald-600" />
            ) : (
              <Mail size={14} className="email-icon" />
            )}
            <span className="email-address">
              {copied ? "Email copied!" : email}
            </span>
            <ArrowUpRight size={13} className="email-arrow" />
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © {currentYear} Rajat Srivastav <span className="footer-divider">·</span> All rights reserved
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="footer-back-to-top"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
