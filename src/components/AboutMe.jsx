import React from "react";
import "./AboutMe.css";

export default function AboutMe() {
  return (
    <section className="ab-section" id="about">
      <div className="ab-text">
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono mb-2 text-center">
          KNOW ABOUT ME
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 leading-tight mb-4">
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
        <div className="ab-card">
          <img
            src="/avatar.PNG"
            alt="Avatar"
            width={400}
            height={400}
            style={{ opacity: 0.9 }}
          />
        </div>
      </div>
    </section>
  );
}
