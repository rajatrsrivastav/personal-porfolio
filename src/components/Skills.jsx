import React from "react";
import "./Skills.css";

// Row 1 — Core Cloud-Native (5 pills)
const row1 = [
  { name: "Go", icon: "devicon-go-original-wordmark colored" },
  { name: "Kubernetes (K8s)", icon: "devicon-kubernetes-plain colored" },
  { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark colored" },
  { name: "Docker", icon: "devicon-docker-plain colored" },
  { name: "Linkerd", icon: "devicon-linux-plain" }, // closest fallback
];

// Row 2 — DevOps & Data (10 pills)
const row2 = [
  { name: "Helm", icon: "devicon-helm-original colored" },
  { name: "Terraform", icon: "devicon-terraform-plain colored" },
  { name: "CI/CD", icon: "devicon-githubactions-plain colored" },
  { name: "Python", icon: "devicon-python-plain colored" },
  { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
  { name: "MongoDB", icon: "devicon-mongodb-plain colored" },
  { name: "Redis", icon: "devicon-redis-plain colored" },
  { name: "gRPC", icon: "devicon-grpc-plain colored" },
  { name: "Prometheus", icon: "devicon-prometheus-original colored" },
  { name: "Grafana", icon: "devicon-grafana-original colored" },
];

// Row 3 — Languages, Frontend & Tools (13 pills)
const row3 = [
  { name: "TypeScript", icon: "devicon-typescript-plain colored" },
  { name: "Node.js", icon: "devicon-nodejs-plain colored" },
  { name: "Express.js", icon: "devicon-express-original" },
  { name: "React.js", icon: "devicon-react-original colored" },
  { name: "Next.js", icon: "devicon-nextjs-original" },
  { name: "Git", icon: "devicon-git-plain colored" },
  { name: "GitHub", icon: "devicon-github-original" },
  { name: "Linux", icon: "devicon-linux-plain" },
  { name: "Bash", icon: "devicon-bash-plain colored" },
  { name: "Vercel", icon: "devicon-vercel-original" },
  { name: "Cloudflare", icon: "devicon-cloudflare-plain colored" },
  { name: "GraphQL", icon: "devicon-graphql-plain colored" },
  { name: "WebAssembly", icon: "devicon-wasm-original colored" },
];

function BadgeRow({ skills }) {
  return (
    <div className="sk-row">
      {skills.map((s) => (
        <div key={s.name} className="sk-badge" title={s.name} aria-label={s.name}>
          <i className={s.icon} aria-hidden></i>
          <span>{s.name}</span>
        </div>
      ))}
    </div>
  );
}

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
        <div className="sk-pyramid">
          <BadgeRow skills={row1} />
          <BadgeRow skills={row2} />
          <BadgeRow skills={row3} />
        </div>
      </div>
    </section>
  );
}
