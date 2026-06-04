import React from "react";
import "./AboutMe.css";

export default function AboutMe() {
  return (
    <section className="ab-section" id="about">
      <div className="ab-text">
        <div className="ab-kicker">KNOW ABOUT ME</div>
        <h2 className="ab-title">
          Full-Stack Developer and <br /> a little bit of{" "}
          <span>everything</span>
        </h2>
        <p>
          I'm Rajat Srivastav, a B.Tech CSE (AI & DS) student and a full-stack engineer currently working at Safcurl Technologies, where I build scalable cloud-native systems end-to-end.
          I enjoy solving complex problems through clean, efficient, and modern code.
        </p>
        <p>
          My technical toolkit spans Go, TypeScript, and JavaScript across the full stack — from React and Next.js on the frontend to Node.js, Express, and Gin (Go) on the backend — with production experience in Kubernetes, Docker, Terraform, and AWS for cloud infrastructure.
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
            src="/avatar.svg"
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
