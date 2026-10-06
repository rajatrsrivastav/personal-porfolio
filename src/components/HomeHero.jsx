import React, { useState, useCallback, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import "./HomeHero.css";

export default function HomeHero({ onOpenContact }) {
  const email = "rajatrsrivastav810@gmail.com";
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

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


  return (
    <section className="home-hero relative" id="home">
      {/* Ultra-Subtle Ambient Deadpool Wallpaper Watermark */}
      <div
        className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        <img
          src="/deadpool-marvel-superhero-tzhfez1w8ud2z8aw (3).jpeg"
          alt=""
          className="w-[780px] sm:w-[980px] md:w-[1180px] max-w-none opacity-[0.035] grayscale object-contain [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]"
        />
      </div>

      {/* Hero Content Container */}
      <div className="hero-content-wrapper">
        {/* Availability Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-neutral-200/80 bg-white/70 backdrop-blur-md shadow-2xs mb-6 group cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono text-neutral-600">
            Available for internships, full-time roles & projects
          </span>
        </div>

        {/* Editorial Headline with curved hand-drawn sunset gradient flourish */}
        <h1 className="hero-main-heading font-serif font-medium tracking-tight text-neutral-900 text-center max-w-4xl mx-auto leading-tight">
          I build seamless{" "}
          <span className="hero-highlight-word font-serif italic font-normal bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent">
            digital experiences
            <svg
              className="hero-underline-flourish"
              viewBox="0 0 280 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Primary confident sweep */}
              <path
                d="M 4 13 C 60 17.5, 150 17.5, 220 14 C 248 12, 268 9.5, 277 6.5"
                stroke="url(#heroDeadpoolGradient)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Subtle secondary echo stroke for organic editorial feel */}
              <path
                d="M 24 16.5 C 85 19, 160 19, 248 13.5"
                stroke="url(#heroDeadpoolGradient)"
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0.42"
              />
              <defs>
                <linearGradient id="heroDeadpoolGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="50%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
              </defs>
            </svg>
          </span>{" "}
          <span className="inline-block">
            from <span className="whitespace-nowrap">real&#8209;world</span> challenges.
          </span>
        </h1>

        {/* Editorial Subtext */}
        <p className="hero-subtext text-neutral-500 font-mono text-center">
          Hello, I'm Rajat Srivastav a Full-Stack Engineer
        </p>

        {/* Dual-action Call to Actions */}
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

        {copyError && (
          <p className="home-copy-error" role="status">
            Couldn't copy automatically. <a href={`mailto:${email}`}>Send me an email</a> or select the address above.
          </p>
        )}
      </div>

    </section>
  );
}
