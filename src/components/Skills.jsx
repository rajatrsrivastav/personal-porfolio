import React from "react";
import { Cpu, Database, Server, Wrench, Globe, Boxes } from "lucide-react";
import "./Skills.css";

const stacks = [
  {
    label: "Core UI",
    icon: <Globe size={18} aria-hidden />,
    items: ["React", "Next.js", "TypeScript", "Zustand", "Framer Motion", "Zod"],
  },
  {
    label: "Backend & API",
    icon: <Server size={18} aria-hidden />,
    items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Prisma", "REST / WebSockets"],
  },
  {
    label: "Data & Storage",
    icon: <Database size={18} aria-hidden />,
    items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma ORM"],
  },
  // {
  //   label: "DevOps & Infra",
  //   icon: <Cpu size={18} aria-hidden />,
  //   items: ["Docker", "AWS", "Vercel", "Linux", "CI/CD", "Monitoring"],
  // },
  {
    label: "Tooling",
    icon: <Wrench size={18} aria-hidden />,
    items: ["Git", "GitHub", "pnpm", "Bun", "ESLint", "Clerk"],
  },
  // {
  //   label: "Architecture",
  //   icon: <Boxes size={18} aria-hidden />,
  //   items: ["Microservices", "Monorepos", "Design Systems", "Caching", "Security"],
  // },
];

export default function Skills() {
  return (
    <section className="sk-section" id="skills">
      <div className="sk-header">
        <div className="sk-kicker">Capabilities</div>
        <h2 className="sk-title">
          Skills &<span> Technologies</span>
        </h2>
        <p className="sk-sub">
          A focused, evolving toolset chosen for delivering fast, maintainable
          products.
        </p>
      </div>
      <div className="sk-groups">
        {stacks.map((group) => (
          <div key={group.label} className="sk-card">
            <div className="sk-cardHead">
              <span className="sk-icon">{group.icon}</span>
              <h3 className="sk-groupLabel">{group.label}</h3>
            </div>
            <ul className="sk-list">
              {group.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
