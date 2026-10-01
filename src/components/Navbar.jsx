import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Navbar.css";

const NAV_SECTIONS = ["home", "about", "experience", "work", "activity", "skills"];
const NAVBAR_HEIGHT = 80;
const SCROLL_LOCK_MS = 900;

export default function Navbar({ onOpenContact }) {
  const [active, setActive] = useState("home");
  const isClickScrolling = useRef(false);
  const lockTimer = useRef(null);
  const rafId = useRef(null);

  // Detect which section is at the focal point (30% from top)
  const detectActiveSection = useCallback(() => {
    if (isClickScrolling.current) return;

    if (rafId.current !== null) return;
    rafId.current = window.requestAnimationFrame(() => {
      rafId.current = null;
      const focalLine = window.innerHeight * 0.3;

      // Walk sections top-to-bottom, pick the LAST one whose top is above the focal line.
      // This ensures the section currently occupying the viewport wins,
      // even for tall scroll-driven sections like #work (250vh).
      let matched = null;
      for (const id of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= focalLine) {
          matched = id;
        }
      }
      if (matched) setActive(matched);
    });
  }, []);

  // Click handler: lock scrollspy, set active immediately, smooth-scroll
  const handleNavClick = useCallback((event, sectionId) => {
    event.preventDefault();

    // Immediately set active to prevent flicker
    setActive(sectionId);
    isClickScrolling.current = true;

    // Clear any existing lock timer
    if (lockTimer.current) clearTimeout(lockTimer.current);

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      const elementTop = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementTop - NAVBAR_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Unlock scrollspy after animation settles
    lockTimer.current = setTimeout(() => {
      isClickScrolling.current = false;
      detectActiveSection();
    }, SCROLL_LOCK_MS);
  }, [detectActiveSection]);

  useEffect(() => {
    window.addEventListener("scroll", detectActiveSection, { passive: true });
    window.addEventListener("resize", detectActiveSection);
    detectActiveSection();

    return () => {
      window.removeEventListener("scroll", detectActiveSection);
      window.removeEventListener("resize", detectActiveSection);
      if (rafId.current !== null) window.cancelAnimationFrame(rafId.current);
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, [detectActiveSection]);

  return (
    <header className="nb-wrap">
      <nav className="nb-nav">
        <a className="nb-brand" href="#home" aria-label="Rajat Srivastav home">
          <img src="/logo.png" alt="Logo" className="nb-logo" />
        </a>
        <div className="nb-pill">
          {NAV_SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : ""}
              aria-current={active === id ? "page" : undefined}
              onClick={(e) => handleNavClick(e, id)}
            >
              {id === "home" ? "Home"
                : id === "about" ? "About"
                : id === "experience" ? "Experience"
                : id === "work" ? "Work"
                : id === "activity" ? "Activity"
                : "Skills"}
            </a>
          ))}
          <button type="button" className="nb-linkBtn" onClick={onOpenContact}>
            Contact
          </button>
        </div>
        <div className="nb-kbd"></div>
      </nav>
    </header>
  );
}
