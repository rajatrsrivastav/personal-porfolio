import React, { useEffect } from 'react';
import { Mail, X, Linkedin, Github, Twitter } from 'lucide-react';
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
          <a className="contact-card email" href="mailto:rajatrsrivastav810@gmail.com">
            <div className="card-head"><Mail size={22}/> <h3 className="emailText">Email</h3></div>
            <div className="card-body">
              <p className="primary">rajatrsrivastav810@gmail.com</p>
              <p className="secondary">Send me an email directly</p>
            </div>
          </a>
          <form className="contact-form in-grid" onSubmit={e=>e.preventDefault()}>
            <div className="form-row">
              <label>Name<input required/></label>
              <label>Email<input type="email" required/></label>
            </div>
            <label>Subject<input required/></label>
            <label>Message<textarea rows={4} required/></label>
            <button className="submit">Send</button>
          </form>
        </div>
        {/* <div className="contact-availability"><span className="dot"/> Currently offline · Available for opportunities · Mumbai, India</div> */}
      </div>
    </div>
  );
}
