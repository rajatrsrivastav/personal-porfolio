import Image from 'next/image';
import { ExternalLink } from "lucide-react";

/**
 * Projects, laid out like the Tapfolio card site (card.rajatsrivastav.dev):
 * a screenshot, then what it is, the problem, my part and the stack.
 */
const projects = [
  {
    title: "Apna Hostel",
    category: "Hostel fee portal",
    image: "/apna-hostel.png",
    url: "https://apna-hostel-zeta.vercel.app",
    githubUrl: "https://github.com/rajatrsrivastav/apna-hostel",
    summary: "A mobile-first hostel fee portal for ITI and Diploma students.",
    problem:
      "Hostel residents need to see dues, pay monthly rent in parts and get receipts, while the office needs collections it can trust.",
    contribution:
      "Built it end to end: Google sign-in with admin approval, automated monthly rent, partial payments, printable receipts, and Cashfree payments verified through signed, idempotent webhooks.",
    technologies: ["Next.js 16", "TypeScript", "Better Auth", "Drizzle ORM", "Neon PostgreSQL", "Cashfree"],
  },
  {
    title: "Smart Parking System",
    category: "Parking operations",
    image: "/smartParking.png",
    url: "https://smart-parking-system-sigma.vercel.app",
    githubUrl: "https://github.com/rajatrsrivastav/smart-parking-system",
    summary: "Park and retrieve vehicles through slot-based entry with real-time session tracking.",
    problem: "A parking lot has to track slots, sessions and payments without ever booking the same space twice.",
    contribution:
      "Built the slot-based parking and retrieval flows with real-time session tracking, and a PostgreSQL schema on Supabase for slots, sessions and payments that prevents double occupancy.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Express.js", "TanStack Query"],
  },
  {
    title: "PeerBot",
    category: "AI chatbot builder",
    image: "/chatBot.png",
    url: "https://peerbot-ai.vercel.app",
    githubUrl: "https://github.com/rajatrsrivastav/Peer_Bot",
    summary: "Create focused AI chatbots from your own instructions and context.",
    problem: "Teams want an assistant that answers only from their own material, without building a chatbot each time.",
    contribution:
      "Built the full-stack app: email and Google sign-in, chatbot create, update and delete flows, a public gallery, and Gemini-powered conversations.",
    technologies: ["Next.js", "MongoDB", "NextAuth", "Gemini API"],
  },
  {
    title: "OSSGrid",
    category: "Open-source mentorship index",
    image: "/ossgrid.png",
    url: "https://www.ossgrid.tech",
    githubUrl: "https://github.com/rajatrsrivastav/ossgrid",
    summary:
      "A free, no-login index of Google Summer of Code and LFX Mentorship organizations, past projects and mentors.",
    problem:
      "Students preparing for mentorship programs piece together past projects and mentors from dozens of repos, spreadsheets and blog posts.",
    contribution:
      "Author and maintainer. Built a static-first pipeline: scheduled GitHub Actions fetch official program data, audit it, and open a pull request when it changes, so every data update is reviewed like code.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Fuse.js", "GitHub Actions"],
  },
];

function ProjectLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="cw-link">
      {children}
      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
    </a>
  );
}

function ProjectPanel({ project, index }) {
  const host = project.url.replace(/^https?:\/\/(www\.)?/, "");
  return (
    <article className={`cw-panel ${index % 2 === 1 ? "is-flipped" : ""}`}>
      <figure className="cw-window">
        <div className="cw-window-bar" aria-hidden="true">
          <span className="cw-dot" />
          <span className="cw-dot" />
          <span className="cw-dot" />
          <span className="cw-host">{host}</span>
        </div>
        <div className="cw-shot">
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover object-top"
          />
        </div>
      </figure>

      <div className="cw-copy">
        <p className="cw-kicker font-mono">{project.category}</p>
        <h3 className="cw-name">{project.title}</h3>
        <p className="cw-summary">{project.summary}</p>
        <dl className="cw-facts">
          <div>
            <dt className="font-mono">Problem</dt>
            <dd>{project.problem}</dd>
          </div>
          <div>
            <dt className="font-mono">My part</dt>
            <dd>{project.contribution}</dd>
          </div>
        </dl>
        <ul className="cw-chips" aria-label={`${project.title} technology`}>
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="cw-links">
          <ProjectLink href={project.url}>Live site</ProjectLink>
          <ProjectLink href={project.githubUrl}>Source on GitHub</ProjectLink>
        </div>
      </div>
    </article>
  );
}

export default function CuratedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="cw-section scroll-mt-24">
      <header className="cw-header">
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-mono mb-2 text-center">Selected work</p>
        <h2 id="work-title" className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 text-center">
          From Challenge to{" "}
          <span className="font-serif font-normal bg-gradient-to-r from-[#7c6cf0] via-[#5b4fc7] to-[#4338a8] bg-clip-text text-transparent">
            Solution
          </span>
        </h2>
      </header>
      <div className="cw-list">
        {projects.map((project, index) => (
          <ProjectPanel key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
