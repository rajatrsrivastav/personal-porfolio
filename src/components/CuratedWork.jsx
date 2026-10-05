import React, { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Apna Hostel",
    category: "Hostel Management Platform",
    image: "/apna-hostel.png",
    url: "apna-hostel-zeta.vercel.app",
    githubUrl: "https://github.com/rajatrsrivastav/apna-hostel",
    description:
      "A hostel lifecycle and accommodation management platform built to bring student onboarding, room allocation, and resident support into one place.",
    highlights: [
      "Supports hostel room allocation and resident onboarding workflows.",
      "Brings hostel administration and resident services together in a single platform.",
      "Designed to make accommodation operations easier to manage for students and hostel teams.",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
      "Node.js",
    ],
  },
  {
    title: "Smart Parking System",
    category: "Full-Stack Application",
    date: "December 2025",
    image: "/smartParking.png",
    url: "https://smart-parking-system-sigma.vercel.app/",
    description:
      "Developed a full-stack smart parking web application enabling users to park and retrieve vehicles using slot-based entry with real-time session tracking.",
    highlights: [
      "Engineered slot-based parking flows with real-time session tracking to streamline parking and retrieval.",
      "Designed a scalable PostgreSQL schema with Supabase to manage parking slots, sessions, and payments while preventing double occupancy.",
    ],
    technologies: [
      "Next.js",
      "PostgreSQL",
      "Supabase",
      "Express.js",
      "TanStack Query",
      "Tailwind CSS",
      "TypeScript",
    ],
  },
  {
    title: "PeerBot",
    category: "AI Chatbot Platform",
    date: "April 2025",
    image: "/chatBot.png",
    url: "https://peerbot-ai.vercel.app/",
    description:
      "Developed a full-stack chatbot platform using a single Next.js repository with MongoDB, enabling seamless frontend-backend integration.",
    highlights: [
      "Implemented RAG using document uploads, vector embeddings, and LangChain for accurate responses strictly grounded in company context and documents.",
      "Delivered dynamic, context-aware AI chat flows that improve onboarding efficiency and reduce repetitive inquiry overhead.",
      "Engineered with Google Auth, bcrypt password hashing, and Zod validation for secure chatbot configuration.",
    ],
    technologies: [
      "Next.js",
      "MongoDB",
      "LangChain",
      "LangGraph",
      "Python",
      "Google Auth",
      "Tailwind CSS",
    ],
  },
  {
    title: "OSSGrid",
    category: "Open-Source Mentorship Explorer",
    image: "/ossgrid.png",
    url: "https://ossgrid.tech/",
    githubUrl: "https://github.com/rajatrsrivastav/ossgrid",
    description:
      "A fast, public dashboard for exploring organizations, projects, and technology stacks across open-source mentorship programs such as LFX Mentorship and Google Summer of Code.",
    highlights: [
      "Searches across organizations, projects, technologies, and mentor names with multi-facet filters.",
      "Uses shareable URL filters and a responsive interface to make project discovery easier.",
      "Serves prebuilt project data client-side and refreshes datasets daily through GitHub Actions.",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Fuse.js",
      "GitHub Actions",
    ],
  },
];

const slideVariants = {
  enter: { x: 30, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -30, opacity: 0 },
};

export default function CuratedWork() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const index = Math.min(projects.length - 1, Math.floor(progress * projects.length));
    setActiveIndex(index);
  });

  const scrollToProject = useCallback((index) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollableDistance = container.offsetHeight - window.innerHeight;
    const boundedIndex = Math.max(0, Math.min(index, projects.length - 1));
    const progress = (boundedIndex + 0.5) / projects.length;
    const top =
      container.getBoundingClientRect().top +
      window.scrollY +
      scrollableDistance * progress;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const activeProject = projects[activeIndex];
  const totalProjects = projects.length;

  return (
    <section id="work" aria-labelledby="work-title">
      <div ref={containerRef} className="relative h-[250vh]">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center py-12 max-w-5xl mx-auto px-4">
          <header className="mb-8 text-center">
            <h2
              id="work-title"
              className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 text-center"
            >
              From Challenge to{" "}
              <span className="font-serif italic font-normal bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent">
                Solution
              </span>
            </h2>
          </header>

          {/* Minimalist tab switcher */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200/80 mb-10 pb-2 sm:pb-0 gap-4 sm:gap-0"
            role="tablist"
            aria-label="Project navigation"
          >
            <div className="hidden sm:flex min-w-0 w-full sm:w-auto flex-1 items-center gap-5 overflow-x-auto hide-scrollbar pr-4 sm:gap-8">
              {projects.map((project, index) => (
                <button
                  key={project.title}
                  id={`project-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-controls="project-panel"
                  onClick={() => scrollToProject(index)}
                  className={`relative pb-3.5 text-sm bg-transparent border-0 transition-colors ${
                    index === activeIndex
                      ? "font-semibold text-neutral-900"
                      : "font-medium text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  <span className="font-mono text-xs mr-2 text-neutral-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {project.title}
                  {index === activeIndex && (
                    <motion.div
                      layoutId="activeWorkUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-rose-600"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Discrete controls + counter */}
            <div className="flex shrink-0 items-center justify-between w-full sm:w-auto sm:justify-end gap-3 pb-3 sm:pb-3">
              <span className="text-xs font-mono text-neutral-400">
                {String(activeIndex + 1).padStart(2, "0")}
                {" / "}
                {String(totalProjects).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollToProject(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous project"
                  className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-800 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToProject(activeIndex + 1)}
                  disabled={activeIndex === totalProjects - 1}
                  aria-label="Next project"
                  className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-800 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Project detail panel */}
          <div
            id="project-panel"
            role="tabpanel"
            aria-labelledby={`project-tab-${activeIndex}`}
            className="min-h-0"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeProject.title}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] md:grid-cols-2"
              >
                {/* Browser preview */}
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${activeProject.title} website`}
                  className="group block overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-50 transition-shadow hover:shadow-lg no-underline"
                >
                  <div className="flex items-center gap-1.5 border-b border-neutral-200/60 bg-neutral-100/60 px-4 py-2.5">
                    <span className="size-[9px] rounded-full bg-[#ff5f56]" />
                    <span className="size-[9px] rounded-full bg-[#ffbd2e]" />
                    <span className="size-[9px] rounded-full bg-[#27ca3f]" />
                    <span className="ml-3 min-w-0 flex-1 truncate rounded-md bg-white border border-neutral-200/50 px-3 py-1 text-center font-mono text-[10px] text-neutral-400">
                      {activeProject.url.replace(/^https?:\/\//, "")}
                    </span>
                  </div>
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={activeProject.image}
                      alt={`${activeProject.title} preview`}
                      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                </a>

                {/* Project details */}
                <div className="py-1">
                  {/* Title + visit link */}
                  <div className="mb-4">
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 leading-tight mb-2">
                      {activeProject.title}
                    </h3>
                    <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      {activeProject.category}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <a
                        href={activeProject.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group/link inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1 rounded-full bg-red-500/10 text-red-700 border border-red-500/20 hover:bg-red-500/20 transition-colors no-underline"
                      >
                        <span>Visit Project</span>
                        <ExternalLink className="h-3 w-3 transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                      {activeProject.githubUrl && (
                        <a
                          href={activeProject.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group/link inline-flex items-center gap-1.5 text-xs font-mono font-medium text-neutral-400 transition-colors hover:text-neutral-900 no-underline"
                        >
                          <span>View Source</span>
                          <ExternalLink className="h-3 w-3 transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-neutral-500 mb-6">
                    {activeProject.description}
                  </p>

                  {/* Highlights plain list, no numbers */}
                  <ul className="space-y-3 mb-6 list-none p-0 m-0">
                    {activeProject.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="text-sm leading-relaxed text-neutral-600 pl-3 border-l-2 border-neutral-200"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <div className="border-t border-neutral-100 pt-4">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2.5">
                      Built With
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200/60 transition-colors hover:bg-neutral-200/70 hover:border-neutral-300"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
