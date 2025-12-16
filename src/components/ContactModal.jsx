import React, { useEffect, useRef, useState } from 'react';
import { X, Linkedin, Github, Twitter, Check, Send, MapPin, ArrowUpRight } from 'lucide-react';
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
    <div className="toast">
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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
      
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
          
          {/* Close button */}
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>

          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">Let's <em>connect</em></h2>
            <p className="modal-subtitle">Have a project in mind? I'd love to hear from you.</p>
          </div>

          {/* Content grid */}
          <div className="modal-content">
            
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
                    <Twitter size={16} />
                    <span>Twitter/X</span>
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
