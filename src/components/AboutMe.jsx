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
          I’m Rajat Srivastav, a second-year B.Tech CSE (AI & DS) student and a full-stack developer passionate about building scalable, reliable, and impactful web applications.
          I enjoy solving complex problems through clean, efficient, and modern code.
        </p>
        <p>
          My technical skill set includes JavaScript, TypeScript, React.js, Next.js, Node.js, Express.js, PostgreSQL, MongoDB, MySQL, and Prisma ORM, with hands-on experience building scalable architectures using REST APIs, AI workflows using LangChain and LangGraph.
        </p>
        <p>
          Alongside web technologies, I’m passionate about problem solving and AI/ML, applying data structures, algorithms, and structured AI workflows to design efficient, reliable, and maintainable solutions for real-world use cases.
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
