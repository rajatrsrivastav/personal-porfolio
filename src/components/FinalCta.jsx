'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Copy } from 'lucide-react';

const EMAIL = 'rajatrsrivastav810@gmail.com';
const LINKS = [
  { label: 'GitHub', href: 'https://github.com/rajatrsrivastav', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rajatrsrivastav/', external: true },
  { label: 'Resume', href: 'https://drive.google.com/file/d/1roOv_PUeWRXVCp8YRL5wlUpXvB294kmA/view?usp=sharing', external: true },
  { label: 'Blog', href: '/blog' },
];

export default function FinalCta({ onOpenContact }) {
  const [copyStatus, setCopyStatus] = useState('');
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const copyEmail = async () => {
    clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyStatus('Email copied.');
    } catch {
      setCopyStatus('Could not copy. Use Get in touch instead.');
    }
    copyTimer.current = setTimeout(() => setCopyStatus(''), 3000);
  };

  return (
    <footer className="footer" id="contact" aria-labelledby="footer-title">
      <div className="footer-container">
        <div className="footer-closing">
          <h2 id="footer-title" className="footer-heading">
            Let's get in touch
          </h2>
          <p className="footer-subtext">Feel free to reach out for internships, projects, or just a quick chat.</p>
          <div className="footer-actions">
            <button type="button" className="footer-email" onClick={copyEmail} aria-label={`Copy email address: ${EMAIL}`}>
              {copyStatus === 'Email copied.' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              <span>{EMAIL}</span>
            </button>
            {onOpenContact ? (
              <button type="button" className="footer-cta" onClick={onOpenContact}>
                Get in touch <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            ) : (
              <a className="footer-cta" href={`mailto:${EMAIL}`}>
                Get in touch <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </div>
          <p className="footer-copy-status" role="status" aria-live="polite">{copyStatus}</p>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} Rajat Srivastav</p>
          <nav className="footer-nav" aria-label="Footer navigation">
            {LINKS.map(link => link.href === '/blog' ? (
              <Link key={link.label} href={link.href} className="footer-nav-link">{link.label}</Link>
            ) : (
              <a key={link.label} href={link.href} className="footer-nav-link" target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined}>{link.label}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
