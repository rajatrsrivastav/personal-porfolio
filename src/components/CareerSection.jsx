import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const experiences = [
  {
    id: "safcurl",
    role: "Full Stack Engineer",
    company: "Safcurl Technologies Private Limited",
    type: "Internship",
    location: "Remote",
    dateRange: "Apr 2026 – Aug 2026",
    dateStart: "2026-04",
    logo: "/safcurl-logo.png",
    logoAlt: "Safcurl Technologies",
    techStack: [
      "AWS",
      "Terraform",
      "Docker",
      "Kubernetes",
      "Node.js",
      "React",
      "Nginx",
    ],
    highlights: [
      {
        num: "01",
        title: "Infrastructure with access built in.",
        description:
          "Provisioned secure AWS EC2 environments using Terraform (IaC) and configured OIDC for session-based remote access.",
        tags: ["AWS EC2", "Terraform", "OIDC"],
      },
      {
        num: "02",
        title: "Clear boundaries between tenants.",
        description:
          "Engineered a polymorphic authentication layer and integrated an Nginx API Gateway to enforce strict multi-tenancy and route trusted identity contexts across microservices.",
        tags: ["Authentication", "API architecture", "Nginx"],
      },
      {
        num: "03",
        title: "Billing that follows the workflow.",
        description:
          "Built dynamic Razorpay webhook listeners for \"auth-first, charge-later\" billing loops and integrated the Resend API for automated system updates.",
        tags: ["Razorpay", "Webhooks", "Resend"],
      },
    ],
  },
];

function CompanyLogo({ src, alt, fallbackInitial }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cn(
        "relative w-11 h-11 rounded-xl overflow-hidden",
        "border border-neutral-200/80 bg-white p-1 flex-shrink-0",
        "flex items-center justify-center"
      )}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          width={36}
          height={36}
          className="object-contain rounded-lg"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-base font-bold text-neutral-700 select-none">
          {fallbackInitial}
        </span>
      )}
    </div>
  );
}

function CareerRow({ entry }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-200/70">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={cn(
          "flex w-full items-start justify-between gap-4 py-6 text-left group",
          "cursor-pointer bg-transparent transition-colors"
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3.5">
          <CompanyLogo
            src={entry.logo}
            alt={entry.logoAlt}
            fallbackInitial={entry.company.charAt(0)}
          />
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-neutral-900 leading-snug">
              {entry.role}
            </h3>
            <p className="mt-0.5 text-sm text-neutral-600 flex items-center gap-2 flex-wrap">
              <span>{entry.company}</span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1",
                  "font-mono text-[10px] font-medium uppercase tracking-wider text-neutral-500"
                )}
              >
                {entry.type}
              </span>
            </p>
            <div className="sm:hidden mt-1 flex items-center gap-3 text-xs text-neutral-400">
              <time dateTime={entry.dateStart} className="font-mono">
                {entry.dateRange}
              </time>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {entry.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 pt-0.5">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <time
              dateTime={entry.dateStart}
              className="text-sm text-neutral-400 font-mono"
            >
              {entry.dateRange}
            </time>
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
              <MapPin className="h-3 w-3" />
              {entry.location}
            </span>
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono transition-all duration-200 select-none",
              isOpen
                ? "border-neutral-300 bg-neutral-100 text-neutral-900 shadow-xs"
                : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 group-hover:border-neutral-300 group-hover:bg-neutral-100 group-hover:text-neutral-900"
            )}
          >
            <span className="text-[11px] font-medium">
              {isOpen ? "Hide impact" : "View impact"}
            </span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex h-3.5 w-3.5 items-center justify-center text-neutral-400 group-hover:text-neutral-700 transition-colors"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.span>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-neutral-200 pt-5 mt-4"
          >
            <div className="space-y-5 pb-6 pl-[58px]">
              <div className="space-y-5">
                {entry.highlights.map((highlight) => (
                  <div key={highlight.num}>
                    <div className="flex items-baseline gap-3">
                      <span className="shrink-0 font-mono text-xs tabular-nums text-neutral-400">
                        {highlight.num}
                      </span>
                      <h4 className="text-sm font-semibold text-neutral-900">
                        {highlight.title}
                      </h4>
                    </div>
                    <p className="mt-2 pl-7 text-sm leading-relaxed text-neutral-600">
                      {highlight.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5 pl-7">
                      {highlight.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full border border-neutral-200/80 bg-neutral-50 px-2.5 py-0.5 text-xs text-neutral-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-neutral-100" />

              <div>
                <p className="mb-2 text-xs font-mono text-neutral-400">
                  Working stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.techStack.map((technology) => (
                    <span
                      key={technology}
                      className="inline-block rounded-full border border-neutral-200/80 bg-neutral-50 px-2.5 py-0.5 text-xs text-neutral-600 transition-colors hover:border-neutral-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      <div className="text-center mb-12">
        <h2
          id="career-title"
          className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 text-center"
        >
          Career{" "}
          <span className="font-serif italic font-normal bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            Evolution
          </span>
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="border-t border-neutral-200/70" />
        {experiences.map((entry) => (
          <CareerRow key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
