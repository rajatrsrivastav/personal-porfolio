import React from "react";
import "./CuratedWork.css";

export default function CuratedWork() {
  const projects = [
    {
  title: "PeerBot",
  image: "/chatBot.png",
  desc:
    "A full-stack chatbot platform built with Next.js and MongoDB that enables teams to create, manage, and deploy tailored AI chatbots for onboarding and support.",
    hosted_link:"https://peerbot-ai.vercel.app/",
  points: [
    "Implemented Google Auth, JWT, bcrypt, and Zod for secure authentication and validation",
    "Developed dynamic conversation flows with context-aware, real-time interactions",
    "Delivered a seamless frontend–backend integration in a single Next.js repository",
  ],
  tags: [
    "Next.js",
    "MongoDB",
    "Google Auth",
    "JWT",
    "bcrypt",
    "Zod",
    "Tailwind CSS",
  ],
},
    {
  title: "EduNerve AI",
  image: "edunerve.png",
  desc:
    "AI-powered learning and interview-preparation platform featuring interactive quizzes, real-time mock interviews, and guided learning paths",
    hosted_link:"https://edu-nerve-ai-frontend-liard.vercel.app",
  points: [
    "Developed  customizable mock interview engine using Vapi, Express, Prisma, and PostgreSQL with role-specific,behavior-based, and topic-focused simulations",
    "Implemented dynamic quiz generation using LLM prompting, offering scoring, explanations, and progress tracking tailored to each user’s performance",
  ],
  tags: [
   " Next.js",
   "Node.js",
   "PostgreSQL",
   "Prisma",
   "Vapi"
  ],
},
  ];

  return (
    <section className="cw-section" id="work">
      <div className="cw-kicker">
        A selection of my work from concept to code.
      </div>
      <div className="cw-title">
        From Challenge to<span> Solution</span>
      </div>

      {projects.map((p, idx) => (
        <div key={p.title} className="cw-fullRow">
          <div className="cw-grid">
            {idx % 2 === 1 ? (
              <>
                <aside className="cw-details">
                  <h3 className="cw-project">{p.title}</h3>
                  <p className="cw-desc">{p.desc}</p>
                  <ul className="cw-points">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <div className="cw-badges">
                    {p.tags.map((t) => (
                      <span key={t} className="cw-badge">
                        {t}
                      </span>
                    ))}
                  </div>
                </aside>
                <div className="cw-card">
                  <div className="cw-screenshotWrap">
                    <div
                      className="cw-screenshotFrame"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div className="cw-windowControls">
                        <span className="cw-dot cw-dot-red"></span>
                        <span className="cw-dot cw-dot-yellow"></span>
                        <span className="cw-dot cw-dot-green"></span>
                      </div>
                     <a href={p.hosted_link}><img src={p.image} alt={`${p.title} screenshot`} /></a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="cw-card">
                  <div className="cw-screenshotWrap">
                    <div
                      className="cw-screenshotFrame"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div className="cw-windowControls">
                        <span className="cw-dot cw-dot-red"></span>
                        <span className="cw-dot cw-dot-yellow"></span>
                        <span className="cw-dot cw-dot-green"></span>
                      </div>
                      <a href={p.hosted_link}><img src={p.image} alt={`${p.title} screenshot`} /></a>
                    </div>
                  </div>
                </div>
                <aside className="cw-details">
                  <h3 className="cw-project">{p.title}</h3>
                  <p className="cw-desc">{p.desc}</p>
                  <ul className="cw-points">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <div className="cw-badges">
                    {p.tags.map((t) => (
                      <span key={t} className="cw-badge">
                        {t}
                      </span>
                    ))}
                  </div>
                </aside>
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
