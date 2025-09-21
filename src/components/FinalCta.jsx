import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import "./FinalCta.css";

export default function FinalCta() {
  return (
    <footer className="fc-footer" role="contentinfo" id="contact">
      <div className="fc-grid">
        <div className="fc-brandCol">
          <img className="fc-logo" src="/logo.png" alt="Logo" />
          <p className="fc-intro">I'm Rajat – a full‑stack developer & problem solver. Thanks for visiting!</p>
          <div className="fc-socialRow">
            <a href="https://www.linkedin.com/in/rajatrsrivastav/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com/rajatrsrivastav" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://x.com/rajatrsrivastav" target="_blank" rel="noreferrer" aria-label="Twitter/X">
              <Twitter size={18} />
            </a>
          </div>
        </div>
        <div className="fc-linksCol">
          <div className="fc-col">
            <h4>General</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#work">Projects</a>
            <a href="#skills">Skills</a>
          </div>
          <div className="fc-col">
            <h4>More</h4>
            <a href="#">Open Source</a>
            <a href="#">Stack</a>
            <a href="#">Attribution</a>
          </div>
          <div className="fc-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div className="fc-bottomBar">
        <div className="fc-bottomLeft">© {new Date().getFullYear()} Rajat Srivastav. All rights reserved.</div>
      </div>
    </footer>
  );
}
