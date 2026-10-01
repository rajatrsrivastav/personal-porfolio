import React, { useState, useCallback, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import "./HomeHero.css";

export default function HomeHero({ onOpenContact }) {
  const email = "rajatrsrivastav810@gmail.com";
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError(false);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  }, [email]);

  // Hide scroll indicator once user scrolls past hero
  useEffect(() => {
    const handleScroll = () => {
      setScrollHidden(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollClick = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="home-hero" id="home">

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight text-neutral-900 text-center max-w-4xl mx-auto leading-tight mb-4">
        I build seamless{" "}
        <span className="font-serif italic font-normal bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
          digital experiences
        </span>{" "}
        from real-world challenges.
      </h1>

      <p className="text-sm text-neutral-500 font-mono text-center mt-6">
        Hello, I'm Rajat Srivastav a Full-Stack Engineer
      </p>

      <div className="home-ctas">
        <button
          type="button"
          className="home-btn primary learn-more connect-cta"
          onClick={onOpenContact}
          aria-label="Open contact form"
        >
          <span className="circle" aria-hidden="true">
            <span className="icon arrow" />
          </span>
          <span className="button-text">Let's Connect</span>
        </button>
        <button
          type="button"
          className={`home-btn secondary email-copy-btn ${copied ? 'is-copied' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Email copied to clipboard' : 'Copy email address'}
        >
          <Mail size={18} aria-hidden />
          <span className="email-text">{email}</span>
          <span className="copy-status" aria-live="polite">{copied ? 'Copied!' : ''}</span>
        </button>
      </div>

      {copyError && <p className="home-copy-error" role="status">Couldn't copy automatically. <a href={`mailto:${email}`}>Send me an email</a> or select the address above.</p>}

      <button
        type="button"
        className={`scroll-indicator ${scrollHidden ? 'is-hidden' : ''}`}
        onClick={handleScrollClick}
        aria-label="Scroll to know more"
      >
        <span className="scroll-indicator-text">Scroll to know more</span>
        <span className="scroll-indicator-arrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </span>
      </button>
    </section>
  );
}
