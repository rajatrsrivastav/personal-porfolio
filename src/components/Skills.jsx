import React from "react";
import "./Skills.css";

const skills = [
  { name: "HTML5", icon: "devicon-html5-plain colored" },
  { name: "CSS3", icon: "devicon-css3-plain colored" },
  { name: "JavaScript (ES6+)", icon: "devicon-javascript-plain colored" },
  { name: "Sass / SCSS", icon: "devicon-sass-original colored" },
  { name: "React.js", icon: "devicon-react-original colored" },
  { name: "Next.js", icon: "devicon-nextjs-original" },
  { name: "Node.js", icon: "devicon-nodejs-plain colored" },
  { name: "Express.js", icon: "devicon-express-original" },
  { name: "MongoDB", icon: "devicon-mongodb-plain colored" },
  { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
  { name: "MySQL", icon: "devicon-mysql-plain colored" },
  { name: "NeonDB", icon: "devicon-postgresql-plain colored" }, // uses PostgreSQL icon
  { name: "Prisma", icon: "devicon-prisma-original" },
  { name: "Supabase", icon: "devicon-supabase-plain colored" },
  { name: "Redis", icon: "devicon-redis-plain colored" },
  { name: "Tailwind CSS", icon: "devicon-tailwindcss-original-wordmark colored" },
  { name: "Git", icon: "devicon-git-plain colored" },
  { name: "GitHub", icon: "devicon-github-original" },
  { name: "Zod", icon: "devicon-typescript-plain colored" }, 
  { name: "Postman", icon: "devicon-postman-plain colored" },
  { name: "ESLint", icon: "devicon-eslint-plain colored" },
  { name: "Figma", icon: "devicon-figma-plain colored" },
  { name: "Notion", icon: "devicon-notion-plain colored" },
  { name: "VS Code", icon: "devicon-vscode-plain colored" },
  { name: "WebStorm", icon: "devicon-webstorm-plain colored" },
  { name: "Bash", icon: "devicon-bash-plain colored" },
  { name: "Linux", icon: "devicon-linux-plain" },
  { name: "Markdown", icon: "devicon-markdown-original" },
  { name: "Docker", icon: "devicon-docker-plain colored" },
  { name: "Kubernetes", icon: "devicon-kubernetes-plain colored" },
  { name: "Vercel", icon: "devicon-vercel-original" },
  { name: "Cloudflare", icon: "devicon-cloudflare-plain colored" },
];

export default function Skills() {
  return (
    <section className="sk-section sk-dark" id="skills">
      <div className="sk-center">
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
        <div className="sk-badges">
          {skills.map((s) => (
            <div
              key={s.name}
              className="sk-badge"
              title={s.name}
              aria-label={s.name}
            >
              <i className={s.icon} aria-hidden></i>
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
