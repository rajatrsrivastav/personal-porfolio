import React from "react";
import "./CuratedWork.css";

export default function CuratedWork() {
  const projects = [
    {
      title: "LendMate",
      image: "lenmate.png",
      desc:
        "A peer-to-peer lending platform designed to connect underbanked individuals and MSMEs with lenders. It’s built to provide a secure, transparent, and accessible financial ecosystem with a robust, modern tech stack.",
      points: [
        "Engineered a borrower credibility system with dynamic trust scores",
        "Designed secure REST APIs to handle the full lifecycle of financial transactions",
        "Built a responsive, scalable UI for managing loans and investments",
      ],
      tags: [
        "React",
        "Express.js",
        "Node.js",
        "PostgreSQL",
        "Prisma",
        "JWT",
        "CSS",
      ],
    },
    {
      title: "ChatBot-Ai",
      image: "chatBot.png",
      desc:
        "A team productivity app to plan, track, and automate workflows with real-time collaboration and granular permissions.",
      points: [
        "Kanban boards with drag-and-drop and persisted state",
        "Role-based access with activity logs and audit trails",
        "Instant updates via subscriptions and optimistic UI",
      ],
      tags: ["React", "Vite", "Redux", "Firebase", "Zustand", "CSS"],
    },
  ];

  return (
    <section className="cw-section" id="work">
      <div className="cw-kicker">A selection of my work from concept to code.</div>
      <div className="cw-title">
        From Challenge to<span> Solution</span>
      </div>

      {projects.map((p, idx) => (
        <div key={p.title} className="cw-grid">
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
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <img src={p.image} alt={`${p.title} screenshot`} />
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
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <img src={p.image} alt={`${p.title} screenshot`} />
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
      ))}
    </section>
  );
}
