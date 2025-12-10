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
          I'm Rajat Srivastav, a second-year student and full-stack developer
          passionate about building scalable and impactful web applications.
          From crafting seamless frontends to designing robust backends, I enjoy
          solving complex problems through clean, efficient, and modern code.
        </p>
        <p>
          My expertise spans JavaScript, TypeScript, React.js, Next.js, Node.js, Express.js, PostgreSQL, MongoDB, MySQL, and Prisma ORM, supported by hands-on experience building scalable architectures using REST APIs, WebSockets, and real-time systems.
        </p>
        <p>
          I also work actively with Python, focusing on Generative AI, including LangChain, LangGraph, and LLM-powered applications. Beyond this, I consistently explore emerging fields like AI/ML and Web3 to stay at the forefront of modern technologies and deliver innovative, high-impact solutions.
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
