import React, { useState } from "react";
import "./AboutMe.css";

export default function AboutMe() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <section className="ab-section" id="about">
      <div className="ab-text">
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono mb-2 text-center sm:text-left">
          KNOW ABOUT ME
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 leading-tight mb-4 text-center sm:text-left">
          Full-Stack Developer and <br /> a little bit of{" "}
          <em className="font-serif italic font-normal bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            everything
          </em>
        </h2>
        <p>
          I'm Rajat Srivastav, a B.Tech CSE (AI & DS) student and a full-stack engineer currently working at Safcurl Technologies, where I build scalable cloud-native systems end-to-end.
          I enjoy solving complex problems through clean, efficient, and modern code.
        </p>
        <p>
          My technical toolkit spans Go, TypeScript, and JavaScript across the full stack from React and Next.js on the frontend to Node.js, Express, and Gin (Go) on the backend with production experience in Kubernetes, Docker, Terraform, and AWS for cloud infrastructure.
        </p>
        <p>
          Alongside building systems, I'm passionate about problem solving and AI/ML, applying data structures, algorithms, and structured AI workflows using LangChain and LangGraph to design efficient, reliable solutions for real-world use cases.
        </p>
        <p>I believe in waking up each day eager to make a difference!</p>
        <button
          className="ab-cta"
          onClick={() => window.open("https://drive.google.com/file/d/1roOv_PUeWRXVCp8YRL5wlUpXvB294kmA/view?usp=sharing", "_blank")}
        >
          Download Resume <span className="arrow">→</span>
        </button>
      </div>

      <div className="ab-art">
        <div className="ab-flip-card-wrapper">
          {/* Hand-drawn style hint & curved arrow pointing to the avatar */}
          <div
            className="ab-flip-hint"
            onClick={handleFlip}
            role="button"
            tabIndex={-1}
            aria-hidden="true"
            title="Click to flip photo"
          >
            <span className="ab-flip-hint-text">
              {isFlipped ? "flip back to avatar ↺" : "flip to see the real me!"}
            </span>
            <svg
              className="ab-flip-hint-arrow"
              viewBox="0 0 60 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 52 4 C 44 18, 28 28, 8 36"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 18 26 L 7 37 L 20 40"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Interactive 3D Flip Card */}
          <div
            className={`ab-flip-card ${isFlipped ? "is-flipped" : ""}`}
            onClick={handleFlip}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={
              isFlipped
                ? "Real photo of Rajat Srivastav. Click to flip back to animated avatar."
                : "Illustrated avatar of Rajat Srivastav. Click to flip to real photo."
            }
            aria-pressed={isFlipped}
          >
            <div className="ab-flip-inner">
              {/* Front Face: Animated Avatar (shown first) */}
              <div className="ab-flip-face ab-flip-front">
                <img
                  src="/avatar-animated.png"
                  alt="Illustrated avatar of Rajat Srivastav"
                  width={400}
                  height={400}
                  className="ab-avatar-img"
                  loading="eager"
                />
              </div>

              {/* Back Face: Real Photo (shown on flip) */}
              <div className="ab-flip-face ab-flip-back">
                <img
                  src="/avatar.PNG"
                  alt="Real photo of Rajat Srivastav"
                  width={400}
                  height={400}
                  className="ab-avatar-img"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
