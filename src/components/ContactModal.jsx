import React, { useEffect, useRef, useState } from 'react';
import { X, Linkedin, Github, Check, Send, MapPin, ArrowUpRight, Mail } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import './ContactModal.css';

function XLogo({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Minimal Toast notification
function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <div className="toast-icon-wrap">
        <Check size={14} />
      </div>
      <span className="toast-text">{message}</span>
    </div>
  );
}

export default function ContactModal({ open, onClose }) {
  const email = "rajatrsrivastav810@gmail.com";
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [state, handleSubmit] = useForm("xvgdzbdg");
  const formRef = useRef(null);
  const dialogRef = useRef(null);

  // Focus trap & body scroll lock
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    dialogRef.current?.focus();

    function handleKey(event) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const items = Array.from(
        dialogRef.current?.querySelectorAll('button:not(:disabled), a[href], input, textarea') || []
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener('keydown', handleKey);
      requestAnimationFrame(() => previousFocus?.focus());
    };
  }, [open, onClose]);

  // Formspree success handler
  useEffect(() => {
    if (state.succeeded && formRef.current) {
      formRef.current.reset();
      setIsSubmitted(true);
      setToastMessage("Message sent successfully!");
      setShowToast(true);
    }
  }, [state.succeeded]);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setToastMessage("Email copied to clipboard!");
    setShowToast(true);
    setTimeout(() => setEmailCopied(false), 2400);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    if (formRef.current) formRef.current.reset();
  };

  if (!open) return null;

  return (
    <>
      <Toast 
        message={toastMessage} 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
      
      <div className="modal-overlay" onClick={onClose} data-lenis-prevent>
        <div 
          className="modal" 
          onClick={e => e.stopPropagation()} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="contact-title" 
          ref={dialogRef} 
          tabIndex={-1} 
          data-lenis-prevent
        >
          {/* Close button */}
          <button 
            type="button"
            className="modal-close" 
            onClick={onClose} 
            aria-label="Close dialog"
          >
            <X size={15} />
          </button>

          {/* Header */}
          <div className="modal-header">
            <h2 id="contact-title" className="modal-title font-serif">
              Let's{" "}
              <span className="font-serif italic font-normal bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent">
                connect
              </span>
            </h2>
            <p className="modal-subtitle">
              Have a project, opportunity, or idea in mind? I'd love to hear from you.
            </p>
          </div>

          {/* Content Grid */}
          <div className="modal-content" data-lenis-prevent>
            
            {/* Left: Form */}
            <div className="modal-form-wrap">
              {isSubmitted ? (
                <div className="modal-success-state">
                  <div className="success-icon-wrap">
                    <Check size={24} />
                  </div>
                  <h3 className="success-title">Message sent!</h3>
                  <p className="success-desc">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                  <button 
                    type="button" 
                    onClick={handleReset}
                    className="modal-reset-btn"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="modal-form" onSubmit={handleSubmit} ref={formRef}>
                  <div className="form-group">
                    <label htmlFor="modal-name">Name</label>
                    <input 
                      id="modal-name"
                      name="name" 
                      type="text"
                      placeholder="Your name"
                      required 
                      autoComplete="name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="modal-email">Email</label>
                    <input 
                      id="modal-email"
                      name="email" 
                      type="email"
                      placeholder="you@example.com"
                      required 
                      autoComplete="email"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="form-validation-error" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="modal-subject">Subject</label>
                    <input 
                      id="modal-subject"
                      name="subject" 
                      type="text"
                      placeholder="What's this about?"
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="modal-message">Message</label>
                    <textarea 
                      id="modal-message"
                      name="message" 
                      rows={4}
                      placeholder="Tell me about your project or question..."
                      required 
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="form-validation-error" />
                  </div>
                  
                  <button className="form-submit" type="submit" disabled={state.submitting}>
                    <span>{state.submitting ? 'Sending...' : 'Send Message'}</span>
                    <Send size={14} className={state.submitting ? 'animate-pulse' : ''} />
                  </button>
                </form>
              )}
            </div>

            {/* Right: Sidebar */}
            <aside className="modal-sidebar">
              {/* Direct email */}
              <div className="sidebar-section">
                <h4>Direct Email</h4>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`sidebar-email-btn ${emailCopied ? 'is-copied' : ''}`}
                  title="Click to copy email address"
                >
                  <Mail size={14} className="sidebar-email-icon" />
                  <span className="sidebar-email-text">{emailCopied ? "Copied to clipboard!" : email}</span>
                  {emailCopied ? (
                    <Check size={12} className="text-emerald-600 shrink-0" />
                  ) : (
                    <ArrowUpRight size={12} className="sidebar-arrow shrink-0" />
                  )}
                </button>
              </div>

              {/* Profiles */}
              <div className="sidebar-section">
                <h4>Connect with me</h4>
                <div className="social-links">
                  <a 
                    href="https://www.linkedin.com/in/rajatrsrivastav/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="social-btn"
                  >
                    <Linkedin size={15} />
                    <span>LinkedIn</span>
                    <ArrowUpRight size={12} className="social-arrow" />
                  </a>
                  <a 
                    href="https://github.com/rajatrsrivastav" 
                    target="_blank" 
                    rel="noreferrer"
                    className="social-btn"
                  >
                    <Github size={15} />
                    <span>GitHub</span>
                    <ArrowUpRight size={12} className="social-arrow" />
                  </a>
                  <a 
                    href="https://x.com/rajatrsrivastav" 
                    target="_blank" 
                    rel="noreferrer"
                    className="social-btn"
                  >
                    <XLogo size={14} />
                    <span>X (Twitter)</span>
                    <ArrowUpRight size={12} className="social-arrow" />
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="sidebar-section">
                <h4>Location</h4>
                <div className="location-info">
                  <MapPin size={13} className="text-neutral-400 shrink-0" />
                  <span>Mumbai, India</span>
                </div>
              </div>

              {/* Availability */}
              <div className="availability-badge">
                <span className="status-dot" />
                <span>Available for opportunities</span>
              </div>
            </aside>

          </div>

        </div>
      </div>
    </>
  );
}
