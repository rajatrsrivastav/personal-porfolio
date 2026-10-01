import React from "react";
import { Github, Linkedin, Mail, MapPin, ArrowUpRight } from "lucide-react";

function XLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import "./FinalCta.css";

export default function FinalCta() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer" role="contentinfo" id="contact">
      <div className="footer-container">
        {/* Main content */}
        <div className="footer-main">
          <div className="footer-brand">
            <img className="footer-logo" src="/logo.png" alt="Rajat Srivastav" />
            <div className="footer-info">
              <h3 className="footer-name">Rajat Srivastav</h3>
              <p className="footer-role">Full-Stack Engineer</p>
            </div>
          </div>
          
          <p className="footer-tagline">
            Building seamless digital experiences from real-world challenges.
          </p>
          
          <div className="footer-location">
            <MapPin size={14} />
            <span>Mumbai, India</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#work">Projects</a>
          <a href="#activity">Activity</a>
          <a href="#skills">Skills</a>
        </nav>

        {/* Social & Contact */}
        <div className="footer-connect">
          <div className="footer-socials">
            <a 
              href="https://www.linkedin.com/in/rajatrsrivastav/" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="LinkedIn"
              className="social-link"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href="https://github.com/rajatrsrivastav" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="GitHub"
              className="social-link"
            >
              <Github size={18} />
            </a>
            <a 
              href="https://x.com/rajatrsrivastav" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="X (Twitter)"
              className="social-link"
            >
              <XLogo size={18} />
            </a>
          </div>
          
          <a href="mailto:rajatrsrivastav810@gmail.com" className="footer-email">
            <Mail size={14} />
            <span>rajatrsrivastav810@gmail.com</span>
            <ArrowUpRight size={12} className="email-arrow" />
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span>© {currentYear} Rajat Srivastav</span>
        <span className="footer-divider">·</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}
