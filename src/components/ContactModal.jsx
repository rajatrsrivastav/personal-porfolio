import React, { useEffect, useRef } from 'react';
import { X, Linkedin, Github, Twitter } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import './ContactModal.css';

export default function ContactModal({ open, onClose }) {

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const [state, handleSubmit] = useForm("xvgdzbdg");
  const formRef = useRef(null);

  // Reset form when submission succeeds
  useEffect(() => {
    if (state.succeeded && formRef.current) {
      formRef.current.reset();
    }
  }, [state.succeeded]);

  if (!open) return null;

  return (
    <div className="contact-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-heading">
      <div className="contact-shell">
        <button className="contact-close" onClick={onClose} aria-label="Close contact panel"><X size={18} /></button>
        <div className="contact-socials">
          <a href="https://www.linkedin.com/in/rajatrsrivastav/" aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
          <a href="https://github.com/rajatrsrivastav" aria-label="GitHub" target="_blank" rel="noreferrer"><Github size={18} /></a>
          <a href="https://x.com/rajatrsrivastav" aria-label="Twitter" target="_blank" rel="noreferrer"><Twitter size={18} /></a>
        </div>
        <div className="contact-grid single">
          <form className="contact-form full" onSubmit={handleSubmit} method="POST">
            <div className="form-row">
              <label>Name<input name="name" required/></label>
              <label>Email<input type="email" name="email" required/></label>
            </div>
            <label>Subject<input name="subject" required/></label>
            <label>Message<textarea rows={4} name="message" required/></label>
            <button className="submit" type="submit" disabled={state.submitting}>
              {state.submitting ? 'Sending...' : 'Send'}
            </button>
            <ValidationError errors={state.errors} />
          </form>
        </div>
        <p className="form-note">Submitting this form will send me an email.</p>
        <div className="contact-availability"><span className="dot"/> Currently offline · Available for opportunities · Mumbai, India</div>
      </div>
    </div>
  );
}
