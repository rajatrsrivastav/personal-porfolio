import React, { useEffect, useRef, useState } from 'react';
import { X, Linkedin, Github, Check, Send, MapPin, ArrowUpRight } from 'lucide-react';

function XLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import { useForm, ValidationError } from '@formspree/react';
import './ContactModal.css';

// Toast component
function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast" role="status">
      <div className="toast-icon-wrap">
        <Check size={14} />
      </div>
      <span className="toast-text">{message}</span>
    </div>
  );
}

export default function ContactModal({ open, onClose }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [state, handleSubmit] = useForm("xvgdzbdg");
  const formRef = useRef(null);
  const dialogRef = useRef(null);

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
      const items = Array.from(dialogRef.current.querySelectorAll('button:not(:disabled), a[href], input, textarea'));
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
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

  useEffect(() => {
    if (state.succeeded && formRef.current) {
      formRef.current.reset();
      setToastMessage("Message sent successfully!");
      setShowToast(true);
    }
  }, [state.succeeded]);

  if (!open) return null;

  return (
    <>
      <Toast 
        message={toastMessage} 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
      
      <div className="modal-overlay" onClick={onClose} data-lenis-prevent>
        <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="contact-title" ref={dialogRef} tabIndex={-1} data-lenis-prevent>
          
          {/* Close button */}
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>

          {/* Header */}
          <div className="modal-header">
            <h2 id="contact-title" className="modal-title font-serif !font-medium">
              Let's{" "}
              <span className="font-serif italic font-normal bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                connect
              </span>
            </h2>
            <p className="mt-0 mb-0 text-sm text-neutral-500">
              Have a project in mind? I'd love to hear from you.
            </p>
          </div>

          {/* Content grid */}
          <div className="modal-content" data-lenis-prevent>
            
            {/* Form */}
            <form className="modal-form" onSubmit={handleSubmit} ref={formRef}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  id="name"
                  name="name" 
                  type="text"
                  placeholder="Your name"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  id="email"
                  name="email" 
                  type="email"
                  placeholder="you@example.com"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  id="subject"
                  name="subject" 
                  type="text"
                  placeholder="What's this about?"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  name="message" 
                  rows={4}
                  placeholder="Tell me about your project..."
                  required 
                />
              </div>
              
              <button className="form-submit" type="submit" disabled={state.submitting}>
                <span>{state.submitting ? 'Sending...' : 'Send Message'}</span>
                <Send size={14} />
              </button>
              
              <ValidationError errors={state.errors} />
            </form>

            {/* Sidebar */}
            <aside className="modal-sidebar">
              <div className="sidebar-section">
                <h4>Connect with me</h4>
                <div className="social-links">
                  <a 
                    href="https://www.linkedin.com/in/rajatrsrivastav/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="social-btn"
                  >
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                    <ArrowUpRight size={12} className="social-arrow" />
                  </a>
                  <a 
                    href="https://github.com/rajatrsrivastav" 
                    target="_blank" 
                    rel="noreferrer"
                    className="social-btn"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                    <ArrowUpRight size={12} className="social-arrow" />
                  </a>
                  <a 
                    href="https://x.com/rajatrsrivastav" 
                    target="_blank" 
                    rel="noreferrer"
                    className="social-btn"
                  >
                    <XLogo size={16} />
                    <span>X (Twitter)</span>
                    <ArrowUpRight size={12} className="social-arrow" />
                  </a>
                </div>
              </div>

              <div className="sidebar-section">
                <h4>Location</h4>
                <div className="location-info">
                  <MapPin size={14} />
                  <span>Mumbai, India</span>
                </div>
              </div>

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
