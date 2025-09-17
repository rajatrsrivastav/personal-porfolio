import React from "react";
import { ArrowRight, Mail, User } from "lucide-react";
import "./HomeHero.css";

export default function HomeHero() {
  return (
    <section className="home-hero" id="home">

      <div className="home-badge">
        <span className="dot" />
        <span className="new">New</span>
        <span>Next Ventures is live!</span>
        <span className="caret">›</span>
      </div>

      <h1 className="home-heading">
        I help founders turn ideas
        <br />
        into seamless <em>digital experiences</em>
      </h1>

      <p className="home-sub">
        Hello, I'm Aayush Bharti
        <span className="home-avatar">
          <User size={36} aria-hidden />
        </span>
        a Full Stack Developer
      </p>

      <div className="home-ctas">
        <a className="home-btn primary" href="#contact">
          <span>Let's Connect</span>
          <span className="arrowCircle" aria-hidden>
            <ArrowRight size={18} />
          </span>
        </a>

        <a className="home-btn secondary" href="mailto:hello@aayushbharti.in">
          <Mail size={18} aria-hidden />
          rajatrsrivastav810@gmail.com
        </a>
      </div>

      <div className="home-horizon" />
    </section>
  );
}
