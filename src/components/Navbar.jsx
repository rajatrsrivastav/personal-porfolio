import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="nb-wrap">
      <nav className="nb-nav">
        <a className="nb-brand" href="#home" aria-label="Rajat Srivastav home">
          <img src="/logo.png" alt="Logo" className="nb-logo" />
        </a>
        <div className="nb-pill">
          <a className="active" href="#home">
            Home
          </a>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nb-kbd">⌘</div>
      </nav>
    </header>
  );
}
