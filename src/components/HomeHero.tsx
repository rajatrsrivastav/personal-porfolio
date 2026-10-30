'use client';

import React, { useState, useCallback, useRef, useEffect } from "react";
import { FileText, Mail } from "lucide-react";

type HomeHeroProps = { onOpenContact?: () => void };

export default function HomeHero({ onOpenContact }: HomeHeroProps) {
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
      {/* Hero Content Container */}
      <div className="hero-content-wrapper">
        {/* Availability Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-neutral-200/80 bg-white/70 backdrop-blur-md shadow-2xs mb-5 sm:mb-6 group cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono text-neutral-600">
            Open to platform, backend and Web3 roles
          </span>
        </div>

        {/* Name first, as on the Tapfolio card: who, then what */}
        <h1 className="hero-name text-neutral-900 text-center">Rajat Srivastav</h1>

        <p className="hero-role text-center text-neutral-800">
          Full-stack engineer building{" "}
          <span className="bg-gradient-to-r from-[#7c6cf0] via-[#5b4fc7] to-[#4338a8] bg-clip-text text-transparent">
            cloud-native infrastructure
          </span>
          .
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
          {/* Phones and tablets hide the email button, so the résumé takes its place. */}
          <a
            className="home-btn secondary hero-resume-btn"
            href="https://drive.google.com/file/d/1roOv_PUeWRXVCp8YRL5wlUpXvB294kmA/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText size={18} aria-hidden />
            <span>Résumé</span>
          </a>
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
