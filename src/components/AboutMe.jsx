import React, { useState } from "react";
import "./AboutMe.css";

export default function AboutMe() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section className="ab-viewport w-full relative min-h-0 py-16 sm:py-20 lg:py-24 lg:flex lg:flex-col lg:justify-center scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-28" id="about">
      <div className="ab-section">
      <div className="ab-text">
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono mb-2 text-center sm:text-left">
          KNOW ABOUT ME
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 leading-tight mb-4 text-center sm:text-left">
          Full-Stack Developer and <br /> a little bit of{" "}
          <em className="font-serif italic font-normal bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent">
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
        {/* Right Column: Interactive 3D Flip Card */}
        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto select-none">
          {/* Perspective Wrapper */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative w-72 sm:w-80 h-[390px] sm:h-[430px] cursor-pointer ab-flip-wrapper [perspective:1000px]"
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? "Flip back to Deadpool flyer" : "Flip to see real photo"}
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
              {/* 1. FRONT FACE (DEFAULT): Deadpool Flyer + Animated Avatar */}
              <div className="absolute inset-0 w-full h-full ab-face-3d [backface-visibility:hidden] rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 shadow-md flex flex-col items-center justify-between overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
                {/* Poster Header */}
                <div className="text-center pt-1">
                  <p className="text-xs sm:text-sm font-mono font-bold tracking-[0.18em] text-neutral-800 uppercase">
                    HAVE YOU SEEN THIS MAN?
                  </p>
                </div>

                {/* Deadpool & Fitted Animated Avatar */}
                <div className="relative w-full flex-1 flex items-center justify-center my-auto min-h-0">
                  <div className="relative h-full max-h-[300px] sm:max-h-[340px] aspect-[394/436] flex items-center justify-center">
                    <img
                      src="/deadpool-cutout.png"
                      alt="Deadpool holding flyer"
                      className="w-full h-full object-contain pointer-events-none"
                    />

                    {/* Photo coordinates are relative to the shared flyer artwork. */}
                    <div
                      className="absolute z-10 pointer-events-none aspect-[3/4] rounded-xs border border-neutral-300/80 bg-white p-1.5 sm:p-2 shadow-md shadow-neutral-900/10"
                      style={{
                        width: "48%",
                        top: "34%",
                        left: "44%",
                        transform: "rotate(4deg)",
                        transformOrigin: "50% 50%",
                      }}
                    >
                      <img
                        src="/rajat-animated.png"
                        alt="Rajat's mugshot clipped to Deadpool's flyer"
                        className="w-full h-full object-cover object-top rounded-xs"
                      />
                      <svg
                        className="absolute -top-[3%] right-[4%] w-[10%] h-[20%] overflow-visible"
                        viewBox="0 0 16 40"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M12 28V8a5 5 0 0 0-10 0v24a7 7 0 0 0 14 0V12M6 12v18a3 3 0 0 0 6 0" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
                        <path d="M3 9v22" stroke="#e4e4e7" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Deadpool Glove Overlay to naturally grip the avatar edge */}
                    <img
                      src="/deadpool-glove-overlay.png"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
                    />
                  </div>
                </div>

                {/* In-Frame Clean Action Hint */}
                <div className="w-full text-center pb-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100/90 border border-neutral-200/80 text-[11px] font-mono font-medium text-neutral-600 transition-colors group-hover:bg-neutral-200/80 group-hover:text-neutral-900 shadow-2xs">
                    <span>Flip to see real person</span>
                    <span className="text-xs transition-transform duration-300 group-hover:-rotate-180">↺</span>
                  </span>
                </div>
              </div>

              {/* 2. BACK FACE (FLIPPED): Real Photo Full Frame */}
              <div className="absolute inset-0 w-full h-full ab-face-3d ab-face-back [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-3 shadow-md flex flex-col justify-between items-center overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
                <div className="w-full h-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 relative">
                  <img
                    src="/rajat-photo.jpg"
                    alt="Rajat Srivastav (Real)"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* In-Frame Clean Action Hint */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/70 text-white/95 text-[11px] font-mono font-medium backdrop-blur-sm border border-white/20 shadow-xs">
                      {/* <span>Flip back to avatar</span> */}
                      <span className="text-xs">↺</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
