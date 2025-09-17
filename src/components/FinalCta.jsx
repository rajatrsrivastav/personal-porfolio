import React from "react";
import "./FinalCta.css";

export default function FinalCta() {
  return (
    <section className="fc-wrap">
      <div className="fc-top">
        <h2 className="fc-title">
          FROM CONCEPT TO <span>CREATION</span>
          <br />
          LET'S MAKE IT <span>HAPPEN!</span>
        </h2>
        <a className="fc-button" href="#contact">
          Get In Touch <span>→</span>
        </a>
        <p className="fc-sub">
          I'm available for full-time roles & freelance projects.
        </p>
        <p className="fc-sub2">
          I thrive on crafting dynamic web applications, and delivering seamless
          user experiences.
        </p>
      </div>
      <div className="fc-footerCard">
        <div className="fc-footerLeft">
          <div className="fc-footerLogo">AB</div>
          <p>
            I'm Rajat - a full-stack developer, freelancer & problem solver.
            Thanks for checking out my site!
          </p>
        </div>
        <div className="fc-cols">
          <div>
            <h4>General</h4>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Projects</a>
            <a href="#">Blog</a>
          </div>
          <div>
            <h4>Specifics</h4>
            <a href="#">Guest Book</a>
            <a href="#">Bucket List</a>
            <a href="#">Uses</a>
            <a href="#">Attribution</a>
          </div>
          <div>
            <h4>More</h4>
            <a href="#">Book a call</a>
            <a href="#">Links</a>
            <a href="#">RSS</a>
          </div>
        </div>
      </div>
      <div className="fc-legal">
        © 2025 Aayush Bharti. All rights reserved • Privacy Policy • Terms &
        Conditions
      </div>
    </section>
  );
}
