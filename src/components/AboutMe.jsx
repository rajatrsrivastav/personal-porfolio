'use client';

import React, { useState } from "react";
import Image from 'next/image';
export default function AboutMe() {
  const [isFlipped, setIsFlipped] = useState(false);
  // Phones show the first paragraph and keep the rest behind "Read more".
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <section className="ab-viewport w-full relative min-h-0 py-16 sm:py-20 lg:py-24 lg:flex lg:flex-col lg:justify-center scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-28" id="about">
      <div className="ab-section">
      <div className="ab-text">
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-mono mb-2 text-center sm:text-left">
          KNOW ABOUT ME
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 leading-tight mb-4 text-center sm:text-left">
          Full-Stack Developer and <br className="hidden sm:inline" /> a little bit of{" "}
          <em className="font-serif font-normal not-italic bg-gradient-to-r from-[#7c6cf0] via-[#5b4fc7] to-[#4338a8] bg-clip-text text-transparent">
            everything
          </em>
        </h2>
        <p>
          I'm Rajat Srivastav, a B.Tech CSE (AI & DS) student and a full-stack engineer currently working at Safcurl Technologies, where I build scalable cloud-native systems end-to-end.
          I enjoy solving complex problems through clean, efficient, and modern code.
        </p>
        <div id="about-more" className={`ab-more ${moreOpen ? "is-open" : ""}`}>
          <p>
            My technical toolkit spans Go, TypeScript, and JavaScript across the full stack from React and Next.js on the frontend to Node.js, Express, and Gin (Go) on the backend with production experience in Kubernetes, Docker, Terraform, and AWS for cloud infrastructure.
          </p>
          <p>
            Alongside building systems, I'm passionate about problem solving and AI/ML, applying data structures, algorithms, and structured AI workflows using LangChain and LangGraph to design efficient, reliable solutions for real-world use cases.
          </p>
          <p>I believe in waking up each day eager to make a difference!</p>
        </div>
        <button
          type="button"
          className="ab-more-toggle"
          aria-expanded={moreOpen}
          aria-controls="about-more"
          onClick={() => setMoreOpen((open) => !open)}
        >
          {moreOpen ? "Show less" : "Read more"}
        </button>
        <button
          className="ab-cta"
          onClick={() => window.open("https://drive.google.com/file/d/1roOv_PUeWRXVCp8YRL5wlUpXvB294kmA/view?usp=sharing", "_blank")}
        >
          Download Resume <span className="arrow">→</span>
        </button>
      </div>

      <div className="ab-art">
        {/* Right Column: Interactive 3D Flip Card */}
        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto select-none">
          {/* Perspective Wrapper */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative w-72 sm:w-80 h-[390px] sm:h-[430px] cursor-pointer ab-flip-wrapper [perspective:1000px]"
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? "Flip back to the illustration" : "Flip to see the real photo"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsFlipped(!isFlipped);
              }
            }}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 ab-flip-card-3d [transform-style:preserve-3d] ${
                isFlipped ? "flipped [transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* 1. FRONT FACE (DEFAULT): illustrated portrait */}
              <div className="absolute inset-0 w-full h-full ab-face-3d [backface-visibility:hidden] rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-3 shadow-md flex flex-col overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
                <div className="relative w-full flex-1 min-h-0 overflow-hidden rounded-xl sm:rounded-2xl bg-[#f1efff]">
                  <Image
                    src="/rajat-animated.png" fill sizes="(max-width: 640px) 300px, 360px"
                    alt="Illustrated portrait of Rajat Srivastav"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex items-center justify-between px-1 pt-3">
                  <span className="text-sm font-semibold text-neutral-900">Rajat Srivastav</span>
                  <span className="text-xs font-mono text-neutral-500">Full-stack engineer</span>
                </div>
              </div>

              {/* 2. BACK FACE (FLIPPED): Real Photo Full Frame */}
              <div className="absolute inset-0 w-full h-full ab-face-3d ab-face-back [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-3 shadow-md flex flex-col justify-between items-center overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
                <div className="w-full h-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 relative">
                  <Image
                    src="/rajat-photo.jpg" fill sizes="(max-width: 640px) 300px, 360px"
                    alt="Rajat Srivastav (Real)"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="ab-flip-hint"
            onClick={() => setIsFlipped((flipped) => !flipped)}
          >
            <svg className="ab-flip-hint-arrow" viewBox="0 0 64 48" fill="none" aria-hidden="true">
              <path d="M54 42C29 44 12 31 17 8M7 17L17 7L26 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ab-flip-hint-text">
              {isFlipped ? "Flip back to the illustration" : "Flip to see the real person"}
            </span>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}
