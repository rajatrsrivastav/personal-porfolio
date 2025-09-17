import React from "react";
import { Blocks } from "lucide-react";
import "./AboutMe.css";

export default function AboutMe() {
  return (
    <section className="ab-section">
      <div className="ab-text">
        <div className="ab-kicker">KNOW ABOUT ME</div>
        <h2 className="ab-title">
          Full-Stack Developer and <br /> a little bit of{" "}
          <span>everything</span>
        </h2>
        <p>
          I'm Rajat Srivastav, a second-year student and full-stack developer passionate about building scalable and impactful web applications. From crafting seamless frontends to designing robust backends, I enjoy solving complex problems through clean, efficient, and modern code.
        </p>
        <p>
          My expertise spans JavaScript, TypeScript, React.js, Next.js, Node.js, Express.js, PostgreSQL, MongoDB, MySQL, and Prisma ORM, along with experience in REST APIs, WebSockets, and real-time systems. I also explore AI/ML and Web3 to stay at the forefront of modern technologies.
        </p>
        <p>I believe in waking up each day eager to make a difference!</p>
        <a className="ab-cta" href="#work">
          Download Resume →
        </a>
      </div>
      <div className="ab-art">
        <div className="ab-card">
          <Blocks size={160} color="#eaeaf1" strokeWidth={1.2} />
        </div>
      </div>
    </section>
  );
}
