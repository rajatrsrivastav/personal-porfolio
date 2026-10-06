'use client';

import React from "react";
function GrafanaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12.016 1.996c-5.526 0-10.01 4.478-10.01 10.004 0 5.524 4.484 10.004 10.01 10.004 5.524 0 10.008-4.48 10.008-10.004 0-5.526-4.484-10.004-10.008-10.004zm6.822 13.916c-.22.56-.554 1.054-.972 1.458-.87.842-2.034 1.34-3.328 1.34-1.292 0-2.456-.498-3.326-1.34-.418-.404-.752-.898-.972-1.458-.266-.676-.36-1.424-.266-2.19.148-1.218.796-2.288 1.748-2.98.74-.54 1.636-.856 2.584-.88.948.024 1.844.34 2.584.88.952.692 1.6 1.762 1.748 2.98.094.766 0 1.514-.266 2.19z"
        fill="#F05A28"
      />
      <path
        d="M12.016 12.18c-.896 0-1.622.726-1.622 1.622s.726 1.622 1.622 1.622 1.622-.726 1.622-1.622-.726-1.622-1.622-1.622z"
        fill="#F47A20"
      />
    </svg>
  );
}

const skillRows = [
  // Row 1: Languages
  [
    { name: "Go", icon: "devicon-go-original-wordmark colored" },
    { name: "TypeScript", icon: "devicon-typescript-plain colored" },
    { name: "Python", icon: "devicon-python-plain colored" },
    { name: "Bash", icon: "devicon-bash-plain colored" },
    { name: "SQL", icon: "devicon-postgresql-plain colored" },
    { name: "JavaScript", icon: "devicon-javascript-plain colored" },
  ],
  // Row 2: Cloud & DevOps
  [
    { name: "Kubernetes", icon: "devicon-kubernetes-plain colored" },
    { name: "Docker", icon: "devicon-docker-plain colored" },
    { name: "Terraform", icon: "devicon-terraform-plain colored" },
    { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark colored" },
    { name: "Linux", icon: "devicon-linux-plain" },
    { name: "GitHub Actions", icon: "devicon-githubactions-plain colored" },
  ],
  // Row 3: Databases & Observability
  [
    { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
    { name: "MongoDB", icon: "devicon-mongodb-plain colored" },
    { name: "MySQL", icon: "devicon-mysql-plain colored" },
    { name: "Redis", icon: "devicon-redis-plain colored" },
    { name: "OpenTelemetry", icon: "devicon-opentelemetry-plain colored" },
    { name: "Prometheus", icon: "devicon-prometheus-original colored" },
    { name: "Grafana", customIcon: <GrafanaIcon /> },
    { name: "Jaeger", icon: "devicon-jaegertracing-plain colored" },
  ],
  // Row 4: Frameworks & AI/ML
  [
    { name: "Next.js", icon: "devicon-nextjs-original" },
    { name: "React", icon: "devicon-react-original colored" },
    { name: "Node.js", icon: "devicon-nodejs-plain colored" },
    { name: "Express.js", icon: "devicon-express-original" },
    { name: "LangChain", icon: "devicon-python-plain colored" },
    { name: "LangGraph", icon: "devicon-python-plain colored" },
    { name: "Tailwind CSS", icon: "devicon-tailwindcss-original colored" },
    { name: "Prisma ORM", icon: "devicon-prisma-original" },
  ],
];

const pillClasses =
  "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200/90 bg-transparent hover:border-neutral-400 hover:bg-neutral-100/40 transition-colors text-xs sm:text-sm font-medium text-neutral-800";

function SkillPill({ skill }) {
  return (
    <div className={pillClasses} title={skill.name} aria-label={skill.name}>
      {skill.customIcon || (
        <i
          className={`${skill.icon} inline-flex shrink-0 text-[17px] leading-none`}
          aria-hidden="true"
        />
      )}
      <span>{skill.name}</span>
    </div>
  );
}

function BadgeRow({ skills }) {
  return (
    <div className="sk-row">
      {skills.map((skill) => (
        <SkillPill key={skill.name} skill={skill} />
      ))}
    </div>
  );
}

export default function Skills() {
  return (
    <section className="sk-section sk-dark" id="skills">
      <div className="sk-center">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight text-neutral-900">
            Skills &{" "}
            <span className="italic font-normal bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          <p className="text-sm text-neutral-500 text-center mt-3 max-w-xl mx-auto">
            A focused, evolving toolset chosen for delivering fast, maintainable products.
          </p>
        </div>
        <div className="sk-pyramid">
          {skillRows.map((row, index) => (
            <BadgeRow key={`skill-row-${index + 1}`} skills={row} />
          ))}
        </div>
      </div>
    </section>
  );
}
