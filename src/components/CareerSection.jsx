import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const experiences = [
  {
    id: "safcurl",
    company: "Safcurl Technologies",
    role: "Full Stack Engineer",
    type: "Internship",
    location: "Remote",
    dateRange: "Apr 2026 – Aug 2026",
    dateStart: "2026-04",
    logo: "/safcurl-logo.png",
    logoAlt: "Safcurl Technologies",
    description:
      "Engineered cloud-native infrastructure and backend microservices end-to-end. Provisioned secure AWS EC2 environments using Terraform (IaC) with OIDC session access, designed an Nginx API Gateway to enforce strict multi-tenancy across microservices, and built dynamic Razorpay webhook listeners for billing loops with automated Resend notifications.",
    techStack: [
      "AWS",
      "Terraform",
      "Docker",
      "Kubernetes",
      "Node.js",
      "React",
      "Nginx",
      "Razorpay",
    ],
  },
];

function ExperienceItem({ exp, isFirst }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {!isFirst && <div className="my-8 border-t border-neutral-200/70" />}
      <article className="group">
        {/* Top row: Company name & Date range */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-3">
            {exp.logo && (
              <img
                src={exp.logo}
                alt={exp.logoAlt}
                className="w-7 h-7 rounded-lg object-contain border border-neutral-200/80 p-0.5 bg-white shrink-0"
              />
            )}
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 tracking-tight">
              {exp.company}
            </h3>
          </div>
          <time
            dateTime={exp.dateStart}
            className="text-xs sm:text-sm font-mono text-neutral-500 shrink-0"
          >
            {exp.dateRange}
          </time>
        </div>

        {/* Sub-row: Role · Work Mode (Location) + Dropdown toggle beside it */}
        <div className="mt-1.5 flex items-center flex-wrap gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-neutral-500 font-medium">
          <span>{exp.role}</span>
          <span className="text-neutral-300">·</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-red-500/10 text-red-700 border border-red-500/20">
            {exp.type}
          </span>
          {exp.location && (
            <span className="text-neutral-400">({exp.location})</span>
          )}

          {/* Dropdown toggle button directly beside the role info */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-mono font-medium text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 transition-all cursor-pointer ml-1 select-none"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Hide impact details" : "View impact details"}
          >
            <span>{isOpen ? "Hide impact" : "View impact"}</span>
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-neutral-900" : "text-neutral-400"}`}
            />
          </button>
        </div>

        {/* Expandable below content only: Description & Tech Stack */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {/* Description */}
              <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-neutral-600">
                {exp.description}
              </p>

              {/* Tech Stack Pills */}
              {exp.techStack && exp.techStack.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-block rounded-md border border-neutral-200/80 bg-neutral-50/80 px-2.5 py-0.5 text-xs font-mono text-neutral-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </div>
  );
}

export default function CareerSection() {
  return (
    <section
      id="experience"
      className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20 lg:py-24"
      aria-labelledby="career-title"
    >
      <div className="text-center mb-12 sm:mb-14">
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono mb-2 text-center">
          EXPERIENCE
        </p>
        <h2
          id="career-title"
          className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 text-center"
        >
          Career{" "}
          <span className="font-serif italic font-normal bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent">
            Evolution
          </span>
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        {experiences.map((exp, index) => (
          <ExperienceItem key={exp.id} exp={exp} isFirst={index === 0} />
        ))}
      </div>
    </section>
  );
}
