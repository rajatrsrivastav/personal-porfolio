import React from "react";
import "./Experience.css";

const experiences = [
  {
    role: "Full Stack Engineer",
    company: "Safcurl Technologies Pvt. Ltd.",
    type: "Remote",
    startDate: "Apr 2026",
    endDate: null, // null means "Present"
    points: [
      "Led end-to-end development across the entire SDLC — planning, implementation, testing, and deployment.",
      "Architected critical system components, including complex Support and Printing modules.",
      "Championed cloud-native DevOps practices using AWS, Terraform, and Docker.",
    ],
    tags: [
      { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark colored" },
      { name: "Terraform", icon: "devicon-terraform-plain colored" },
      { name: "Docker", icon: "devicon-docker-plain colored" },
      { name: "Kubernetes", icon: "devicon-kubernetes-plain colored" },
      { name: "Node.js", icon: "devicon-nodejs-plain colored" },
      { name: "React", icon: "devicon-react-original colored" },
    ],
  },
];

export default function Experience() {
  return (
    <section className="ex-section" id="experience">
      <div className="ex-header">
        <div className="ex-kicker">Professional</div>
        <h2 className="ex-title">
          Career <span>Evolution</span>
        </h2>
        <p className="ex-sub">
          A timeline of my progressive roles, where I've built production
          systems and developed key technical contributions.
        </p>
      </div>

      <div className="ex-timeline">
        {experiences.map((exp) => (
          <div key={exp.company + exp.startDate} className="ex-card">
            <div className="ex-card-header">
              <div>
                <h3 className="ex-role">{exp.role}</h3>
                <div className="ex-company">
                  {exp.company}
                  <span className="ex-company-dot" />
                  {exp.type}
                </div>
              </div>
              <div className="ex-timeline-date">
                <span>
                  {exp.startDate} – {exp.endDate ?? ""}
                </span>
                {!exp.endDate && (
                  <span className="ex-present-badge">Present</span>
                )}
              </div>
            </div>

            <ul className="ex-points">
              {exp.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>

            <div className="ex-badges">
              {exp.tags.map((t) => (
                <span key={t.name} className="ex-badge" title={t.name}>
                  <i className={t.icon} aria-hidden />
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
