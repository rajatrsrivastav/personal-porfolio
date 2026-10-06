export const dispatches = [
  {
    slug: "breaking-and-fixing-production-cluster",
    topic: "Cloud Native",
    title: "Breaking our production cluster so you don't have to",
    description: "The cloud-native settings that tripped us up, what went sideways, and what I'd check before the next deploy.",
    readTime: "4 min read",
    tags: ["Kubernetes", "Docker"],
    featured: true,
    sections: [
      {
        heading: "What went wrong",
        paragraphs: [
          "It started with an unthrottled background sync job that triggered node-level memory pressure. Kubelet began evicting pods aggressively, pushing CoreDNS into a restart loop that took down internal service discovery.",
          "Within three minutes, downstream services couldn't resolve dependencies, turning a contained resource spike into a cluster-wide incident.",
        ],
      },
      {
        heading: "How we fixed it",
        paragraphs: [
          "We set hard resource quotas with explicit eviction thresholds, isolated internal DNS onto dedicated nodes with NodeLocal DNSCache, and added circuit-breakers to our sync jobs.",
          "The real win wasn't just technical—we wrote straightforward runbooks so any engineer on-call can diagnose and isolate pod evictions in under a minute.",
        ],
      },
    ],
  },
  {
    slug: "tracing-requests-through-microservices",
    topic: "Observability",
    title: "Tracing requests without losing your sanity",
    description: "Finding the slow hop between services without adding a span to every function or drowning in telemetry.",
    readTime: "3 min read",
    tags: ["OpenTelemetry", "Go"],
    sections: [
      {
        heading: "Context propagation is the foundation",
        paragraphs: [
          "Distributed tracing falls apart the moment a single HTTP client or message consumer drops the traceparent header. Once context propagation is wired into your base transport client, every downstream call links up automatically.",
          "Instead of adding spans to every trivial function, focus only on network boundaries, database queries, and async message dispatches.",
        ],
      },
      {
        heading: "Spotting the silent delays",
        paragraphs: [
          "The most insidious latency issues are almost never slow code—they are idle time waiting for database connection pools, unbatched round-trips, or lock contention. Trace waterfalls make these gaps immediately obvious.",
        ],
      },
    ],
  },
  {
    slug: "designing-api-before-ui",
    topic: "Full Stack",
    title: "Designing the API first was a mistake",
    description: "What the frontend needed, what the backend returned, and how thinking through the screen first made both simpler.",
    readTime: "3 min read",
    tags: ["React", "TypeScript"],
    sections: [
      {
        heading: "The UI-driven contract",
        paragraphs: [
          "When you design an endpoint purely around database models, frontend clients end up making three sequential calls to render a single dashboard view. Every extra round-trip amplifies loading friction and error states.",
          "Starting with the screen's real requirements—what data is shown together, what fails together, and what needs optimistic updates—produces leaner endpoints and cleaner code on both sides.",
        ],
      },
      {
        heading: "Handling edge states honestly",
        paragraphs: [
          "Empty states, partial failures, and field-level validation errors shouldn't be treated as afterthoughts. An API contract that models these states explicitly makes the frontend resilient by default.",
        ],
      },
    ],
  },
];

export function getDispatch(slug) {
  return dispatches.find((dispatch) => dispatch.slug === slug);
}
