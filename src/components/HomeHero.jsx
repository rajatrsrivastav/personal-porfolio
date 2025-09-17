import React from "react";
import { ArrowRight, Mail } from "lucide-react";
import "./HomeHero.css";

export default function HomeHero() {
  return (
    <section className="home-hero">
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
        <a className="home-btn primary" href="#contact">
          <span>Let's Connect</span>
          <span className="arrowCircle" aria-hidden>
            <ArrowRight size={18} />
          </span>
        </a>

        <a className="home-btn secondary" href="mailto:rajatrsrivastav810@gmail.com">
          <Mail size={18} aria-hidden />
          rajatrsrivastav810@gmail.com
        </a>
      </div>

      <div className="home-horizon" />
    </section>
  );
}
