import React, { useState, useCallback } from "react";
import { Mail,Copy } from "lucide-react";
import "./HomeHero.css";

export default function HomeHero({ onOpenContact }) {
  const email = "rajatrsrivastav810@gmail.com";
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          setCopied(true); setTimeout(()=>setCopied(false),1500);
        }).catch(() => {
          const temp = document.createElement('textarea');
          temp.value = email; document.body.appendChild(temp); temp.select(); document.execCommand('copy'); document.body.removeChild(temp);
          setCopied(true); setTimeout(()=>setCopied(false),1500);
        });
      } else {
        const temp = document.createElement('textarea');
        temp.value = email; document.body.appendChild(temp); temp.select(); document.execCommand('copy'); document.body.removeChild(temp);
        setCopied(true); setTimeout(()=>setCopied(false),1500);
      }
    } catch(err) { console.error('Copy failed', err); }
  }, [email]);
  return (
    <section className="home-hero" id="home">
      {/* <div className="home-badge">
      </div> */}

      <h1 className="home-heading">
        I build seamless <em>digital experiences</em> 
        <br />
        from real-world challenges.
        {/* <br />
        <em>experiences & solutions</em> */}
      </h1>

      <p className="home-sub">
        Hello, I'm Rajat Srivastav
        a Full Stack Developer
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
          <Copy />
          <span className="copy-status" aria-live="polite">{copied ? 'Copied!' : ''}</span>
        </button>
      </div>

      <div className="home-horizon" />
    </section>
  );
}