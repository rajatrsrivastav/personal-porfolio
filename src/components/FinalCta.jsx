import React from "react";
import { Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import "./FinalCta.css";

export default function FinalCta() {
  return (
    <footer className="fc-footer" role="contentinfo" id="contact">
      <div className="fc-inner">
        <div className="fc-brandBlock">
          <div className="fc-mark fc-mark--image">
            <img src="/logo.png" alt="Logo" />
          </div>
          <p className="fc-tagline">
            Building performant, accessible web products with a focus on clean
            engineering & thoughtful UX.
          </p>
          <a href="mailto:rajatrsrivastav810@gmail.com" className="fc-email">
            <Mail size={16} /> rajatrsrivastav810@gmail.com
          </a>
        </div>
        <nav className="fc-navGroups" aria-label="Footer">
          <div className="fc-group">
            <h4>Site</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#work">Projects</a>
            <a href="#blog">Blog</a>
          </div>
            <div className="fc-group">
            <h4>Resources</h4>
            <a href="#">Articles</a>
            <a href="#">Snippets</a>
            <a href="#">Changelog</a>
            <a href="#">Newsletter</a>
          </div>
          <div className="fc-group">
            <h4>More</h4>
            <a href="#">Book a Call</a>
            <a href="#">Open Source</a>
            <a href="#">Stack</a>
            <a href="#">Attribution</a>
          </div>
          <div className="fc-group">
            <h4>Social</h4>
            <a href="https://github.com/" target="_blank" rel="noreferrer"><Github size={14}/> GitHub</a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={14}/> LinkedIn</a>
            <a href="#"><ExternalLink size={14}/> Resume</a>
          </div>
        </nav>
      </div>
      <div className="fc-bottom">
        <p>© {new Date().getFullYear()} Rajat Srivastav. All rights reserved.</p>
        <div className="fc-bottomLinks">
          <a href="#">Privacy</a>
          <span aria-hidden>•</span>
          <a href="#">Terms</a>
          <span aria-hidden>•</span>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
