import React, { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar({ onOpenContact }) {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sectionIds = ["home", "about", "work", "skills"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.45,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="nb-wrap">
      <nav className="nb-nav">
        <a className="nb-brand" href="#home" aria-label="Rajat Srivastav home">
          <img src="/logo.png" alt="Logo" className="nb-logo" />
        </a>
        <div className="nb-pill">
          <a
            className={active === "home" ? "active" : ""}
            href="#home"
            aria-current={active === "home" ? "page" : undefined}
          >
            Home
          </a>
          <a
            href="#about"
            className={active === "about" ? "active" : ""}
            aria-current={active === "about" ? "page" : undefined}
          >
            About
          </a>
          <a
            href="#work"
            className={active === "work" ? "active" : ""}
            aria-current={active === "work" ? "page" : undefined}
          >
            Work
          </a>
          <a
            href="#skills"
            className={active === "skills" ? "active" : ""}
            aria-current={active === "skills" ? "page" : undefined}
          >
            Skills
          </a>
          <button type="button" className="nb-linkBtn" onClick={onOpenContact}>
            Contact
          </button>
        </div>
        <div className="nb-kbd"></div>
      </nav>
    </header>
  );
}
