import React from "react";
import "./Skills.css";

const techs = [
  "ReactJS",
  "NextJS",
  "TypeScript",
  "Tailwind CSS",
  "Motion",
  "Sanity",
  "Contentful",
  "ExpressJS",
  "PostgreSQL",
  "MongoDB",
  "Prisma",
  "Zustand",
  "Zod",
  "Bun",
  "Git",
  "GitHub",
  "Vercel",
  "AWS",
  "Docker",
  "Clerk",
  "Linux",
  "Expo",
  "pnpm",
  "NodeJS",
];

export default function Skills() {
  return (
    <section className="sk-section">
      <div className="sk-centerpiece">
        <div className="sk-kicker">I Specialize In</div>
        <h2 className="sk-title">
          Skills &<span>Technologies</span>
        </h2>
      </div>
      <div className="sk-grid">
        {techs.map((t) => (
          <span key={t} className="sk-chip">
            {t}
          </span>
        ))}
      </div>
      <div className="sk-ribbonTop" />
      <div className="sk-ribbonBottom">
        <div className="sk-ticker">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>
              OPTIMIZED ★ INTERACTIVE ★ SECURE ★ RELIABLE ★ ENGAGING ★
              ACCESSIBLE ★ RESPONSIVE ★ DYNAMIC ★ SCALABLE ★ SEARCH OPTIMIZED ★{" "}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
